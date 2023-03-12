import { SandboxedJob } from 'bullmq';
import * as fs from 'fs';
import { JobStatus, SpgwasJobsModel } from '../jobs/models/spgwas.jobs.model';
import {
  OnOffOptions,
  SpgwasDoc,
  SpgwasModel,
} from '../jobs/models/spgwas.model';
import appConfig from '../config/app.config';
import { spawnSync } from 'child_process';
import connectDB, { closeDB } from '../mongoose';
import {
  deleteFileorFolder,
  fileOrPathExists,
  writeSpgwasFile,
} from '@cubrepgwas/pgwascommon';
import * as extract from "extract-zip";
import * as globby from "globby";

function sleep(ms) {
  console.log('sleeping');
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters: SpgwasDoc) {
  return [
    String(parameters.population),
    String(parameters.clump_p1),
    String(parameters.clump_p2),
    String(parameters.clump_r2),
    String(parameters.clump_kb),
    String(parameters.clump_allow_overlap),
    String(parameters.clump_use_gene_region_file),
    String(parameters.clump_range),
    String(parameters.clump_range_border),
    String(parameters.coloc_type),
    String(parameters.coloc_s),
    String(parameters.coloc_p1),
    String(parameters.pascal_runpathway),
    String(parameters.pascal_chr),
    String(parameters.pascal_genesetfile),
    String(parameters.pascal_pvalue_cutoff),
    String(parameters.pascal_up),
    String(parameters.pascal_down),
    String(parameters.pascal_maxsnp),
    String(parameters.pascal_genescoring),
    String(parameters.pascal_mergedistance),
    String(parameters.pascal_mafcutoff),
    String(parameters.emagma_synonym),
    String(parameters.emagma_up_window),
    String(parameters.emagma_down_window),
    String(parameters.emagma_tissues),
    String(parameters.smr_heidi),
    String(parameters.smr_trans),
    String(parameters.smr_smr_multi),
    String(parameters.smr_maf),
    String(parameters.smr_diff_freq),
    String(parameters.smr_diff_freq_prop),
    String(parameters.smr_cis_wind),
    String(parameters.smr_peqtl_smr),
    String(parameters.smr_ld_upper_limit),
    String(parameters.smr_ld_lower_limit),
    String(parameters.smr_peqtl_heidi),
    String(parameters.smr_heidi_mtd),
    String(parameters.smr_heidi_min_m),
    String(parameters.smr_heidi_max_m),
    String(parameters.smr_trans_wind),
    String(parameters.smr_set_wind),
    String(parameters.smr_ld_multi_snp),
    String(parameters.smr_westra_eqtl),
    String(parameters.smr_cage_eqtl),
    String(parameters.smr_gtex_tissue),
    String(parameters.annot_gene_db),
    String(parameters.annot_cytoband),
    String(parameters.annot_all),
    String(parameters.annot_afr),
    String(parameters.annot_amr),
    String(parameters.annot_eas),
    String(parameters.annot_eur),
    String(parameters.annot_sas),
    String(parameters.annot_exac),
    String(parameters.annot_disgenet),
    String(parameters.annot_clinvar),
    String(parameters.annot_intervar),
    String(parameters.haplor_ld_threshold),
    String(parameters.haplor_epi),
    String(parameters.haplor_cons),
    String(parameters.haplor_genetypes),
  ];
}

export default async (job: SandboxedJob) => {
  //executed for each job
  console.log(
    'Worker ' +
      ' processing job ' +
      JSON.stringify(job.data.jobId) +
      ' Job name: ' +
      JSON.stringify(job.data.jobName),
  );

  await connectDB();
  await sleep(2000);

  //fetch job parameters from database
  const parameters = await SpgwasModel.findOne({
    job: job.data.jobId,
  }).exec();

  // console.log('parameters ', parameters);

  const jobParams = await SpgwasJobsModel.findById(job.data.jobId).exec();

  let fileInput = jobParams.inputFile;

  //check if file is a zipped file
  if(/[^.]+$/.exec(jobParams.inputFile)[0] === 'zip'){
    fs.mkdirSync(`/pv/analysis/${jobParams.jobUID}/zip`, { recursive: true });
    await extract(jobParams.inputFile, {dir: `/pv/analysis/${jobParams.jobUID}/zip/`});
    const paths = await globby(`/pv/analysis/${jobParams.jobUID}/zip/*.*`);
    if (paths.length === 0){
      throw new Error('Zip had no files')
    }
    if (paths.length > 1){
      throw new Error('Zip had too many files')
    }
    fileInput = paths[0]
  }


  //create input file and folder
  let filename;

  //extract file name
  const name = fileInput.split(/(\\|\/)/g).pop();

  if (parameters.useTest === false) {
    filename = `/pv/analysis/${jobParams.jobUID}/input/${name}`;
  } else {
    filename = `/pv/analysis/${jobParams.jobUID}/input/test.txt`;
  }

  //write the exact columns needed by the analysis
  writeSpgwasFile(fileInput, filename, {
    marker_name: parameters.marker_name - 1,
    chr: parameters.chr - 1,
    pos: parameters.position - 1,
    effect_allele: parameters.effect_allele - 1,
    alternate_allele: parameters.alternate_allele - 1,
    freq: parameters.maf - 1,
    beta: parameters.beta - 1,
    se: parameters.standard_error - 1,
    p: parameters.pvalue - 1,
    n: parameters.sample_size - 1,
  });

  if (parameters.useTest === false) {
    deleteFileorFolder(jobParams.inputFile).then(() => {
      // console.log('deleted');
    });
  }

  if(/[^.]+$/.exec(jobParams.inputFile)[0] === 'zip'){
    deleteFileorFolder(fileInput).then(() => {
      console.log('deleted');
    });
  }

  //assemble job parameters
  const pathToInputFile = filename;
  const pathToOutputDir = `/pv/analysis/${job.data.jobUID}/${appConfig.appName}/output`;
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToOutputDir);

  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await SpgwasJobsModel.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
    },
    { new: true },
  );

  await sleep(3000);
  //spawn process
  const jobSpawn = spawnSync(
    // './pipeline_scripts/pascal.sh &>/dev/null',
    './pipeline_scripts/custom_pipeline.sh',
    jobParameters,
    { maxBuffer: 1024 * 1024 * 1024 },
  );

  console.log('Spawn command log');
  console.log(jobSpawn?.stdout?.toString());
  console.log('=====================================');
  console.log('Spawn error log');
  const error_msg = jobSpawn?.stderr?.toString();
  console.log(error_msg);

  // let clump_ResultsFile = await fileOrPathExists(
  //   `${pathToOutputDir}/step1_clump/clumped.results`,
  // );
  //
  // let coloc_ResultsFile = await fileOrPathExists(
  //   `${pathToOutputDir}/step2_colocFinemapp/finemapping.txt`,
  // );
  //
  // let pascal_geneScoresFile = await fileOrPathExists(
  //   `${pathToOutputDir}/step3_pascal/pascal_genescores.txt`,
  // );
  //
  // let pascal_pathwaySetFile = true;
  // let pascal_fusionGenesFile = true;
  //
  // if (parameters.pascal_runpathway === OnOffOptions.ON) {
  //   pascal_pathwaySetFile = await fileOrPathExists(
  //     `${pathToOutputDir}/step3_pascal/pascal_pathway.txt`,
  //   );
  //
  //   pascal_fusionGenesFile = await fileOrPathExists(
  //     `${pathToOutputDir}/step3_pascal/pascal_fusion.txt`,
  //   );
  // }
  //
  // const emagma_genes_out = await fileOrPathExists(
  //   `${pathToOutputDir}/step4_eMAGMA/gene_set.genes.out`,
  // );
  //
  // const emagma_manhattan_plot = await fileOrPathExists(
  //   `${pathToOutputDir}/step4_eMAGMA/manhattan.png`,
  // );
  //
  // let emagma_tissue_genes_out = true;
  //
  // if (String(parameters.emagma_tissues) !== '') {
  //   emagma_tissue_genes_out = await fileOrPathExists(
  //     `${pathToOutputDir}/step4_eMAGMA/gene_set.${parameters.emagma_tissues}.genes.out`,
  //   );
  // }
  //
  // let smr_cageSMRFile = true;
  // let smr_cageTransFile = true;
  // let smr_cageMultiFile = true;
  // let smr_cageSMRManhattanPlot = true;
  // let smr_cageMultiManhattanPlot = true;
  //
  // if (parameters.smr_cage_eqtl === 'true') {
  //   smr_cageSMRFile = await fileOrPathExists(
  //     `${pathToOutputDir}/step5_SMR/CAGE.smr`,
  //   );
  //   smr_cageSMRManhattanPlot = await fileOrPathExists(
  //     `${pathToOutputDir}/step5_SMR/CAGE_manhattan.png`,
  //   );
  //
  //   if (parameters.smr_trans === OnOffOptions.ON) {
  //     smr_cageTransFile = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/CAGE_trans.smr`,
  //     );
  //   }
  //   if (parameters.smr_smr_multi === OnOffOptions.ON) {
  //     smr_cageMultiFile = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/CAGE_multi.msmr`,
  //     );
  //     smr_cageMultiManhattanPlot = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/CAGE_multi_manhattan.png`,
  //     );
  //   }
  // }
  //
  // let smr_westraSMRFile = true;
  // let smr_westraTransFile = true;
  // let smr_westraMultiFile = true;
  // let smr_westraSMRManhattanPlot = true;
  // let smr_westraMultiManhattanPlot = true;
  //
  // if (parameters.smr_westra_eqtl === 'true') {
  //   smr_westraSMRFile = await fileOrPathExists(
  //     `${pathToOutputDir}/step5_SMR/Westra.smr`,
  //   );
  //   smr_westraSMRManhattanPlot = await fileOrPathExists(
  //     `${pathToOutputDir}/step5_SMR/Westra_manhattan.png`,
  //   );
  //
  //   if (parameters.smr_trans === OnOffOptions.ON) {
  //     smr_westraTransFile = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/Westra_trans.smr`,
  //     );
  //   }
  //   if (parameters.smr_smr_multi === OnOffOptions.ON) {
  //     smr_westraMultiFile = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/Westra_multi.msmr`,
  //     );
  //     smr_westraMultiManhattanPlot = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/Westra_multi_manhattan.png`,
  //     );
  //   }
  // }
  //
  // let smr_tissueSMRFile = true;
  // let smr_tissueTransFile = true;
  // let smr_tissueMultiFile = true;
  // let smr_tissueSMRManhattanPlot = true;
  // let smr_tissueMultiManhattanPlot = true;
  //
  // if (parameters.smr_gtex_tissue) {
  //   smr_tissueSMRFile = await fileOrPathExists(
  //     `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}.smr`,
  //   );
  //   smr_tissueSMRManhattanPlot = await fileOrPathExists(
  //     `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_manhattan.png`,
  //   );
  //   if (parameters.smr_trans === OnOffOptions.ON) {
  //     smr_tissueTransFile = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_trans.smr`,
  //     );
  //   }
  //   if (parameters.smr_smr_multi === OnOffOptions.ON) {
  //     smr_tissueMultiFile = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_multi.msmr`,
  //     );
  //     smr_tissueMultiManhattanPlot = await fileOrPathExists(
  //       `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_multi_manhattan.png`,
  //     );
  //   }
  // }
  //
  // const delet_outputFile = await fileOrPathExists(
  //   `${pathToOutputDir}/step6_deleteriousness/deleteriousness_output.hg19_multianno_full.tsv`,
  // );
  //
  // const delet_exon_plot = await fileOrPathExists(
  //   `${pathToOutputDir}/step6_deleteriousness/exon_plot.jpg`,
  // );
  //
  // const annot_outputFile = await fileOrPathExists(
  //   `${pathToOutputDir}/step7_annotations/annotation_output.hg19_multianno_full.tsv`,
  // );
  //
  // let annot_disgenet = true;
  //
  // if (parameters.annot_disgenet) {
  //   annot_disgenet = false;
  //   annot_disgenet = await fileOrPathExists(
  //     `${pathToOutputDir}/step7_annotations/disgenet.txt`,
  //   );
  // }
  //
  // const annot_snp_plot = await fileOrPathExists(
  //   `${pathToOutputDir}/step7_annotations/snp_plot.jpg`,
  // );
  //
  // const annot_exon_plot = await fileOrPathExists(
  //   `${pathToOutputDir}/step7_annotations/exon_plot.jpg`,
  // );
  //
  // // const haplor_ResultsFile = await fileOrPathExists(
  // //   `${pathToOutputDir}/step8_HaploR/results_haploR.txt`,
  // // );
  //
  // //close database connection
  // closeDB();
  //
  // const results = [
  //   clump_ResultsFile,
  //   coloc_ResultsFile,
  //   pascal_geneScoresFile,
  //   pascal_pathwaySetFile,
  //   pascal_fusionGenesFile,
  //   emagma_genes_out,
  //   emagma_manhattan_plot,
  //   emagma_tissue_genes_out,
  //   smr_cageSMRFile,
  //   smr_cageTransFile,
  //   smr_cageMultiFile,
  //   smr_cageSMRManhattanPlot,
  //   smr_cageMultiManhattanPlot,
  //   smr_westraSMRFile,
  //   smr_westraTransFile,
  //   smr_westraMultiFile,
  //   smr_westraSMRManhattanPlot,
  //   smr_westraMultiManhattanPlot,
  //   smr_tissueSMRFile,
  //   smr_tissueTransFile,
  //   smr_tissueMultiFile,
  //   smr_tissueSMRManhattanPlot,
  //   smr_tissueMultiManhattanPlot,
  //   delet_outputFile,
  //   delet_exon_plot,
  //   annot_outputFile,
  //   annot_disgenet,
  //   annot_snp_plot,
  //   annot_exon_plot,
  //   // haplor_ResultsFile,
  // ];
  //
  // console.log(results);
  //
  // const answer = results.some((element) => element === false);

  // if (answer) {
  //   throw new Error(error_msg || 'Job failed to successfully complete');
  // } else {
  //   return true;
  // }

  return true;
};
