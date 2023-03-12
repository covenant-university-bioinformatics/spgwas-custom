import config from '../config/bullmq.config';
import appConfig from '../config/app.config';
import { WorkerJob } from '../jobqueue/queue/spgwas.queue';
import { Job, QueueScheduler, Worker } from 'bullmq';
import { JobStatus, SpgwasJobsModel } from '../jobs/models/spgwas.jobs.model';
import * as path from 'path';
import { SpgwasModel } from '../jobs/models/spgwas.model';
import { JobCompletedPublisher } from '../nats/publishers/job-completed-publisher';
import { fileOrPathExists } from '@cubrepgwas/pgwascommon';

let scheduler;

const createScheduler = () => {
  scheduler = new QueueScheduler(config.queueName, {
    connection: config.connection,
    // maxStalledCount: 10,
    // stalledInterval: 15000,
  });
};

const processorFile = path.join(__dirname, 'spgwas.worker.js');

export const createWorkers = async (
  jobCompletedPublisher: JobCompletedPublisher,
) => {
  createScheduler();

  for (let i = 0; i < config.numWorkers; i++) {
    console.log('Creating worker ' + i);

    const worker = new Worker<WorkerJob>(config.queueName, processorFile, {
      connection: config.connection,
      // concurrency: config.concurrency,
      limiter: config.limiter,
    });

    worker.on('completed', async (job: Job, returnvalue: any) => {
      console.log('worker ' + i + ' completed ' + returnvalue);

      // save in mongo database
      // job is complete
      const parameters = await SpgwasModel.findOne({
        job: job.data.jobId,
      }).exec();

      const pathToOutputDir = `/pv/analysis/${job.data.jobUID}/${appConfig.appName}/output`;

      const clump_ResultsFile = `${pathToOutputDir}/step1_clump/clumped.results`;
      const coloc_ResultsFile = `${pathToOutputDir}/step2_colocFinemapp/finemapping.txt`;
      const pascal_geneScoresFile = `${pathToOutputDir}/step3_pascal/pascal_genescores.txt`;
      const pascal_pathwaySetFile = `${pathToOutputDir}/step3_pascal/pascal_pathway.txt`;
      let pascal_fusionGenesFile;
      if (
        await fileOrPathExists(
          `${pathToOutputDir}/step3_pascal/pascal_fusion.txt`,
        )
      ) {
        pascal_fusionGenesFile = `${pathToOutputDir}/step3_pascal/pascal_fusion.txt`;
      } else {
        pascal_fusionGenesFile = `${pathToOutputDir}/step3_pascal/no_pascal_fusion.txt`;
      }
      const emagma_genes_out = `${pathToOutputDir}/step4_eMAGMA/gene_set.genes.out`;
      const emagma_manhattan_plot = `${pathToOutputDir}/step4_eMAGMA/manhattan.png`;
      const emagma_tissue_genes_out = `${pathToOutputDir}/step4_eMAGMA/gene_set.${parameters.emagma_tissues}.genes.out`;

      let smr_cageSMRFile;
      if (await fileOrPathExists(`${pathToOutputDir}/step5_SMR/CAGE.smr`)) {
        smr_cageSMRFile = `${pathToOutputDir}/step5_SMR/CAGE.smr`;
      } else {
        smr_cageSMRFile = `${pathToOutputDir}/step5_SMR/error_cage.log`;
      }
      const smr_cageSMRManhattanPlot = `${pathToOutputDir}/step5_SMR/CAGE_manhattan.png`;

      let smr_cageTransFile;
      if (
        await fileOrPathExists(`${pathToOutputDir}/step5_SMR/CAGE_trans.smr`)
      ) {
        smr_cageTransFile = `${pathToOutputDir}/step5_SMR/CAGE_trans.smr`;
      } else {
        smr_cageTransFile = `${pathToOutputDir}/step5_SMR/error_cage_trans.log`;
      }

      let smr_cageMultiFile;
      if (
        await fileOrPathExists(`${pathToOutputDir}/step5_SMR/CAGE_multi.msmr`)
      ) {
        smr_cageMultiFile = `${pathToOutputDir}/step5_SMR/CAGE_multi.msmr`;
      } else {
        smr_cageMultiFile = `${pathToOutputDir}/step5_SMR/error_cage_multi.log`;
      }
      const smr_cageMultiManhattanPlot = `${pathToOutputDir}/step5_SMR/CAGE_multi_manhattan.png`;

      let smr_westraSMRFile;
      if (await fileOrPathExists(`${pathToOutputDir}/step5_SMR/Westra.smr`)) {
        smr_westraSMRFile = `${pathToOutputDir}/step5_SMR/Westra.smr`;
      } else {
        smr_westraSMRFile = `${pathToOutputDir}/step5_SMR/error_westra.log`;
      }

      const smr_westraSMRManhattanPlot = `${pathToOutputDir}/step5_SMR/Westra_manhattan.png`;

      let smr_westraTransFile;
      if (
        await fileOrPathExists(`${pathToOutputDir}/step5_SMR/Westra_trans.smr`)
      ) {
        smr_westraTransFile = `${pathToOutputDir}/step5_SMR/Westra_trans.smr`;
      } else {
        smr_westraTransFile = `${pathToOutputDir}/step5_SMR/error_westra_trans.log`;
      }

      let smr_westraMultiFile;
      if (
        await fileOrPathExists(`${pathToOutputDir}/step5_SMR/Westra_multi.msmr`)
      ) {
        smr_westraMultiFile = `${pathToOutputDir}/step5_SMR/Westra_multi.msmr`;
      } else {
        smr_westraMultiFile = `${pathToOutputDir}/step5_SMR/error_westra_multi.log`;
      }

      const smr_westraMultiManhattanPlot = `${pathToOutputDir}/step5_SMR/Westra_multi_manhattan.png`;

      let smr_tissueSMRFile;
      if (
        await fileOrPathExists(
          `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}.smr`,
        )
      ) {
        smr_tissueSMRFile = `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}.smr`;
      } else {
        smr_tissueSMRFile = `${pathToOutputDir}/step5_SMR/error_tissue.log`;
      }
      const smr_tissueSMRManhattanPlot = `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_manhattan.png`;

      let smr_tissueTransFile;
      if (
        await fileOrPathExists(
          `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_trans.smr`,
        )
      ) {
        smr_tissueTransFile = `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_trans.smr`;
      } else {
        smr_tissueTransFile = `${pathToOutputDir}/step5_SMR/error_tissue_trans.log`;
      }

      let smr_tissueMultiFile;
      if (
        await fileOrPathExists(
          `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_multi.msmr`,
        )
      ) {
        smr_tissueMultiFile = `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_multi.msmr`;
      } else {
        smr_tissueMultiFile = `${pathToOutputDir}/step5_SMR/error_tissue_multi.log`;
      }
      const smr_tissueMultiManhattanPlot = `${pathToOutputDir}/step5_SMR/${parameters.smr_gtex_tissue}_multi_manhattan.png`;

      const delet_outputFile = `${pathToOutputDir}/step6_deleteriousness/deleteriousness_output.hg19_multianno_full.tsv`;
      const delet_exon_plot = `${pathToOutputDir}/step6_deleteriousness/exon_plot.jpg`;
      const annot_outputFile = `${pathToOutputDir}/step7_annotations/annotation_output.hg19_multianno_full.tsv`;
      const annot_disgenet = `${pathToOutputDir}/step7_annotations/disgenet.txt`;
      const annot_snp_plot = `${pathToOutputDir}/step7_annotations/snp_plot.jpg`;
      const annot_exon_plot = `${pathToOutputDir}/step7_annotations/exon_plot.jpg`;
      const haplor_ResultsFile = `${pathToOutputDir}/step8_HaploR/results_haploR.txt`;

      //update db with result files
      const finishedJob = await SpgwasJobsModel.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.COMPLETED,
          clump_ResultsFile,
          coloc_ResultsFile,
          pascal_geneScoresFile,
          pascal_pathwaySetFile,
          pascal_fusionGenesFile,
          emagma_genes_out,
          emagma_manhattan_plot,
          emagma_tissue_genes_out,
          smr_cageSMRFile,
          smr_cageTransFile,
          smr_cageMultiFile,
          smr_cageSMRManhattanPlot,
          smr_cageMultiManhattanPlot,
          smr_westraSMRFile,
          smr_westraTransFile,
          smr_westraMultiFile,
          smr_westraSMRManhattanPlot,
          smr_westraMultiManhattanPlot,
          smr_tissueSMRFile,
          smr_tissueTransFile,
          smr_tissueMultiFile,
          smr_tissueSMRManhattanPlot,
          smr_tissueMultiManhattanPlot,
          delet_outputFile,
          delet_exon_plot,
          annot_outputFile,
          annot_disgenet,
          annot_snp_plot,
          annot_exon_plot,
          haplor_ResultsFile,
          completionTime: new Date(),
        },
        { new: true },
      );

      //send email if its a long job
      if (finishedJob.longJob) {
        await jobCompletedPublisher.publish({
          type: 'jobStatus',
          recipient: {
            email: job.data.email,
          },
          payload: {
            comments: `${job.data.jobName} has completed successfully`,
            jobID: job.data.jobId,
            jobName: job.data.jobName,
            status: finishedJob.status,
            username: job.data.username,
            link: `workflows/result_view/${finishedJob._id}`,
          },
        });
      }
    });

    worker.on('failed', async (job: Job) => {
      console.log('worker ' + i + ' failed');
      //update job in database as failed
      //save in mongo database
      const finishedJob = await SpgwasJobsModel.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.FAILED,
          failed_reason: job.failedReason,
          completionTime: new Date(),
        },
        { new: true },
      );

      if (finishedJob.longJob) {
        await jobCompletedPublisher.publish({
          type: 'jobStatus',
          recipient: {
            email: job.data.email,
          },
          payload: {
            comments: `${job.data.jobName} has failed to complete`,
            jobID: job.data.jobId,
            jobName: job.data.jobName,
            status: finishedJob.status,
            username: job.data.username,
            link: `workflows/result_view/${finishedJob._id}`,
          },
        });
      }
    });

    // worker.on('close', () => {
    //   console.log('worker ' + i + ' closed');
    // });

    process.on('SIGINT', () => {
      worker.close();
      console.log('worker ' + i + ' closed');
    });

    process.on('SIGTERM', () => {
      worker.close();
      console.log('worker ' + i + ' closed');
    });

    process.on('SIGBREAK', () => {
      worker.close();
      console.log('worker ' + i + ' closed');
    });

    console.log('Worker ' + i + ' created');
  }
};
