#!/usr/bin/env bash
#set -x;
## rsid	CHR	BP A1	A2	freq	slope(beta)	slope_se(standard error)	pval_nominal(pvalue)	n z

#prod
bindir="/local/datasets/custom"
dbdir="/local/datasets/custom"

#dev
#bindir="/local/datasets/tools"
#dbdir="/local/datasets/tools"

bin_scripts=${dbdir}/scripts
#cd ${bin_scripts}
gwas_summary=$1
output=$(basename ${gwas_summary})
outdir=$2
population=$3


#### Step 1
#### perfom clumping
mkdir -p ${outdir}/step1_clump
clump_output="${outdir}/step1_clump"
clump_p1=$4;            ## P-value threshold for a SNP to be included as an index SNP. By default, must have p-value no larger than 0.0001
clump_p2=$5;            ## Secondary significance threshold for clumped SNPs
clump_r2=$6;            ## LD threshold for clumping
clump_kb=$7;            ## Physical distance threshold for clumping
allow_overlap=$8        ## {Yes, No}
use_gene_region_file=${9} ## {Yes, No}

clump_range=${10}         ##{glist-hg19, glist-hg38}
clump_range_border=${11}  ## A window arround  gene bounds by the given number of kilobases, default 0

allow_overlap_cmd='';
if [[ "$allow_overlap" = "Yes" ]]; then
    allow_overlap_cmd='--clump-allow-overlap';
fi

gene_region_cmd='';
if [[ "$use_gene_region_file" = "Yes" ]]; then
   gene_region_cmd="--clump-range ${dbdir}/${clump_range}  \
    --clump-range-border ${clump_range_border}";
fi

if [[ "${clump_p1}" > "0.0001" ]]; then
    clump_p1=0.0001;
fi

#By default, no variant may belong to more than one clump; remove this restriction with --clump-allow-overlap


${bin_scripts}/plink \
    --bfile ${dbdir}/g1000_${population}/g1000_${population} \
    --clump-p1 ${clump_p1} \
    --clump-p2 ${clump_p2} \
    --clump-r2 ${clump_r2} \
    --clump-kb ${clump_kb} \
    --clump ${gwas_summary} \
    --clump-snp-field rsid \
    --clump-field pval_nominal \
    ${allow_overlap_cmd} \
    ${gene_region_cmd} \
    --out ${clump_output}/${output} &> ${clump_output}/error.log
    sed -i $'s/^  *//' ${clump_output}/${output}.clumped  ## Remove space at the begining of each line
    sed -i 's/  */\t/g' ${clump_output}/${output}.clumped ## spaces to tab


####### Step 2 Selecting indepent SNPs
touch ${clump_output}/SNPs.clump
cut -f3 ${clump_output}/${output}.clumped | sed -e '1d' > ${clump_output}/SNPs.clump
mv  ${clump_output}/${output}.clumped   ${clump_output}/clumped.results
mv  ${clump_output}/${output}.clumped.ranges   ${clump_output}/clumped.ranges
mv  ${clump_output}/${output}.log   ${clump_output}/log.log

awk 'BEGIN{OFS="\t"}
(FNR==NR)  {a[$1]=$1; next}
(FNR==1 && NR!=FNR){print $0}
($1 in a ) {print $0 }'  ${clump_output}/SNPs.clump ${gwas_summary} > ${outdir}/input1.txt

###### perfom Fine mapping on input1 using coloc
mkdir -p ${outdir}/step2_colocFinemapp
finemap_outdir="${outdir}/step2_colocFinemapp"

type=${12} ##{"quant", "cc"} #quantification or case-control
s=${13} #proportion between case and control (between 0 and 1)
p1=${14} #p1: prior probability a SNP is associated with the trait 1, default 1e-4

Rscript --vanilla ${bin_scripts}/coloc_fineMapping.R ${outdir}/input1.txt  ${outdir} \
${p1}   \
${type}  \
${s}

mv  ${outdir}/finemapping.results  ${finemap_outdir}/
mv  ${outdir}/finemapping.txt     ${finemap_outdir}/


############### STEP 3 Pathway analysis
### prepare Pascal input file ---> two columns without header
### SNP , pvalue

mkdir -p ${outdir}/step3_pascal
pascal_outdir="${outdir}/step3_pascal"
touch ${pascal_outdir}/results.log

read -r line < "${outdir}/input1.txt"     ## read first line from file into 'line'
oldIFS="$IFS"                                   ## save current Internal Field Separator (IFS)
IFS=$' '                                        ## set IFS to word-split on '\t'
fieldarray=($line);                             ## fill 'fldarray' with fields in line
rsid_index=$(echo $line |tr "\t" "\n"|grep -inx 'rsid'| cut -d: -f1);
pvalue_index=$(echo $line |tr "\t" "\n"|grep -inx 'pval_nominal'| cut -d: -f1);      # Zscore column
cut -f ${rsid_index},${pvalue_index} ${outdir}/input1.txt > ${outdir}/Pascal.input
sed -i '1d'  ${outdir}/Pascal.input


runpathway=${15} #{on, off}
chr=${16}; #{1-22, all}
genesetfile=${17}; # {msigdb.v4.0.entrez, msigBIOCARTA_KEGG_REACTOME}
# resources/genesets/msigdb/msigdb.v4.0.entrez.gmt
# resources/genesets/msigdb/msigBIOCARTA_KEGG_REACTOME.gmt
#pathway_output_suffix=${genesetfile};
if [[ "$genesetfile" = "msigdb.v4.0.entrez" ]]; then
  genesetfile=${bin_scripts}'/resources/genesets/msigdb/msigdb.v4.0.entrez.gmt';
else # [[ "$genesetfile" -eq "msigBIOCARTA_KEGG_REACTOME" ]]; then
  genesetfile=${bin_scripts}'/resources/genesets/msigdb/msigBIOCARTA_KEGG_REACTOME.gmt';
fi

# add cutoff for pathways file as parameter 7
pvalue_cutoff=${18}
if [[ -z "$cutoff_pathways" ]]; then
  pvalue_cutoff=0.05;
fi
##### Parameters
#### adding more  variables
up=${19} #number of base-pairs upstream of the transcription start site
if [[ -z "$up" ]]; then
  up=50000;
fi

down=${20} #number of base-pairs downstream of the transcription start site
if [[ -z "$down" ]]; then
  down=50000;
fi

maxsnp=${21} #maximum number of SNPs per gene
if [[ -z "$maxsnp" ]]; then
  maxsnp=3000;
fi

genescoring=${22}; # genescoring method  {max, sum}
if [[ -z "$genescoring"  ]]; then
  genescoring=sum;
fi


mergedistance=${23} #genomic distance in mega-bases
if [[ -z "$mergedistance" ]]; then
  mergedistance=1;
fi


mafcutoff=${24} #This option should be supplied with a number between 0 and 1
if [[  -z "$mafcutoff" ]]; then
  mafcutoff=0.05;
fi


#mkdir -p ${outdir}/pascal_script
mkdir -p ${outdir}/pascal_script/output
cp -r ${bin_scripts}/Pascal ${outdir}/pascal_script/
cp -r ${bin_scripts}/jars ${outdir}/pascal_script/
cp -r ${bin_scripts}/lib ${outdir}/pascal_script/
cp -r ${bin_scripts}/xianyi-OpenBLAS-48f06dd ${outdir}/pascal_script/
cp -r ${bin_scripts}/settings.txt ${outdir}/pascal_script/
cp -r ${bin_scripts}/resources ${outdir}/pascal_script/
cd ${outdir}/pascal_script/



##1. Run analysis for all chromosomes
if [[ "$chr" == "all" ]]; then
bash ${outdir}/pascal_script/Pascal --pval=${outdir}/Pascal.input \
        --customdir=${dbdir}/custom-1000genomes  \
        --custom=$population \
        --runpathway=${runpathway}  \
        --up=$up \
        --down=$down \
        --maxsnp=$maxsnp \
        --genescoring=$genescoring \
        --mergedistance=$mergedistance \
        --mafcutoff=$mafcutoff \
        --genesetfile=$genesetfile \
        --outdir=${pascal_outdir} &> ${pascal_outdir}/results.log
else
    bash ${outdir}/pascal_script/Pascal --pval=${outdir}/Pascal.input \
                --customdir=${dbdir}/custom-1000genomes  \
                --custom=$population \
                --runpathway=${runpathway}  \
                --up=$up \
                --down=$down \
                --maxsnp=$maxsnp \
                --genescoring=$genescoring \
                --mergedistance=$mergedistance \
                --mafcutoff=$mafcutoff \
                --genesetfile=$genesetfile \
                --chr=$chr \
                --outdir=${pascal_outdir} &> ${pascal_outdir}/error.log
fi
### Filter genescores results
genescores_file=$(ls ${pascal_outdir}| grep ${genescoring}.genescores*);
if [[ -f "${pascal_outdir}/${genescores_file}" ]]; then
    genescores_output=$(echo ${genescores_file}| sed -e 's/.txt/_filtered.txt/');
    sed -i 's/,/./g' ${pascal_outdir}/${genescores_file};
    awk -v pvalue=$pvalue_cutoff '{if(NR==1) print $0; if (($8)<=pvalue) print $0}' ${pascal_outdir}/${genescores_file} > ${pascal_outdir}/${genescores_output}
    mv ${pascal_outdir}/${genescores_file} ${pascal_outdir}/pascal_genescores.txt
    mv ${pascal_outdir}/${genescores_output} ${pascal_outdir}/pascal_genescores_filtered.txt
else
    touch ${pascal_outdir}/no_pascal_genescores.txt;
fi



if [[ "$runpathway" == "on" ]]; then
  ## prepare Output files name.
  fusion_file=$(ls ${pascal_outdir}| grep ${genescoring}.fusion.genescores*);
  if [[ -f "${pascal_outdir}/${fusion_file}" ]]; then
      fusion_output=$(echo ${fusion_file}| sed -e 's/.txt/_filtered.txt/');
      sed -i 's/,/./g' ${pascal_outdir}/${fusion_file};
      awk -v pvalue=$pvalue_cutoff '{if(NR==1) print $0; if (($8)<=pvalue) print $0}' ${pascal_outdir}/${fusion_file} > ${pascal_outdir}/${fusion_output}
      mv ${pascal_outdir}/${fusion_file} ${pascal_outdir}/pascal_fusion.txt
      mv ${pascal_outdir}/${fusion_output} ${pascal_outdir}/pascal_fusion_filtered.txt
  else
      touch ${pascal_outdir}/no_pascal_fusion.txt;
  fi

  pathway_file=$(ls ${pascal_outdir}| grep PathwaySet)
  if [[ -f "${pascal_outdir}/${pathway_file}" ]]; then
      pathway_output=$(echo ${pathway_file}| sed -e 's/.txt/_filtered.txt/')
      sed -i 's/,/./g' ${pascal_outdir}/${pathway_file}
      awk -v pvalue=$pvalue_cutoff '{if(NR==1) print $0; if (($2)<=pvalue) print $0}' ${pascal_outdir}/${pathway_file} > ${pascal_outdir}/${pathway_output}
      mv ${pascal_outdir}/${pathway_file} ${pascal_outdir}/pascal_pathway.txt
      mv ${pascal_outdir}/${pathway_output} ${pascal_outdir}/pascal_pathway_filtered.txt
  else
     touch ${pascal_outdir}/no_pascal_pathway.txt;
  fi

fi

cd ${outdir}
rm -r ${outdir}/pascal_script

##### eMAGMA
mkdir -p ${outdir}/step4_eMAGMA
eMAGMA_outdir="${outdir}/step4_eMAGMA"
synonym=${25};  # Accounting for synonymous SNP IDs
#### synonyms=No -- > suppress automatically loading, to speed up the process
#### synonym-dup=drop  -->  SNPs that have multiple synonyms in the data are removed from the analysis
#### synonym-dup=drop-dup -->  for each synonym entry only the first listed in the synonym file is retained;
#### synonym-dup=skip ---> the SNPs are left in the data and the synonym entry in the synonym file is skipped.
#### synonym-dup=skip-dup --->  the genotype data for all synonymous SNPs is retained.
#### if not provided i.e NA --> same as skip

if [[ "$synonym" -eq "" ]]; then
  synonym=Default;
fi
up_window=${26}
down_window=${27}

if [[ "$up_window" -eq "" ]]; then
  up_window=0;
fi

if [[ "$down_window" -eq "" ]]; then
  down_window=0;
fi


#./eMAGMA.sh emagma_test.txt output_folder afr no 0 0

${bin_scripts}/magma --annotate window=${up_window},${down_window} --snp-loc ${outdir}/input1.txt --gene-loc ${dbdir}/NCBI/NCBI37.3.gene.loc \
--out ${eMAGMA_outdir}/${output} &> ${eMAGMA_outdir}/error1.log; ## NCBI to binary_dir

if [[ "$synonym" == "No" ]]; then
${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonyms=0 \
--gene-annot ${eMAGMA_outdir}/${output}.genes.annot \
--pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
--gene-settings adap-permp=1001 \
--big-data \
--out ${eMAGMA_outdir}/${output} &> ${eMAGMA_outdir}/error2.log;
elif  [[ "$synonym" == "drop" ]]; then
  ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonym-dup=drop \
  --gene-annot ${eMAGMA_outdir}/${output}.genes.annot \
  --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
  --gene-settings adap-permp=1001 \
  --big-data \
  --out ${eMAGMA_outdir}/${output} &> ${eMAGMA_outdir}/error2.log;
elif  [[ "$synonym" == "drop-dup" ]]; then
  ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonym-dup=drop-dup \
  --gene-annot ${eMAGMA_outdir}/${output}.genes.annot \
  --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
  --gene-settings adap-permp=1001 \
  --big-data \
  --out ${eMAGMA_outdir}/${output} &> ${eMAGMA_outdir}/error2.log;
elif  [[ "$synonym" == "skip" ]]; then
  ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonym-dup=skip \
  --gene-annot ${eMAGMA_outdir}/${output}.genes.annot \
  --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
  --gene-settings adap-permp=1001 \
  --big-data \
  --out ${eMAGMA_outdir}/${output} &> ${eMAGMA_outdir}/error2.log;
elif  [[ "$synonym" == "skip-dup" ]]; then
  ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonym-dup=skip-dup \
  --gene-annot ${eMAGMA_outdir}/${output}.genes.annot \
  --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
  --gene-settings adap-permp=1001 \
  --big-data \
  --out ${eMAGMA_outdir}/${output} &> ${eMAGMA_outdir}/error2.log;
else
  ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population}  \
  --gene-annot ${eMAGMA_outdir}/${output}.genes.annot \
  --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
  --gene-settings adap-permp=1001 \
  --big-data \
  --out ${eMAGMA_outdir}/${output} &> ${eMAGMA_outdir}/error2.log;
fi



tissue=${28}

if [[ "$tissue" != "No" ]]; then
    if [[ "$synonym" == "No" ]]; then
    ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonyms=0 \
    --gene-annot ${dbdir}/tissues/${tissue}.genes.annot \
    --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
    --gene-settings adap-permp=1001 \
    --big-data \
    --out ${eMAGMA_outdir}/${output}.${tissue} &> ${eMAGMA_outdir}/error3.log;
    elif  [[ "$synonym" == "drop" ]]; then
      ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonym-dup=drop \
      --gene-annot ${dbdir}/tissues/${tissue}.genes.annot \
      --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
      --gene-settings adap-permp=1001 \
      --big-data \
      --out ${eMAGMA_outdir}/${output}.${tissue} &> ${eMAGMA_outdir}/error3.log;
    elif  [[ "$synonym" == "drop-dup" ]]; then
      ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonym-dup=drop-dup \
      --gene-annot ${dbdir}/tissues/${tissue}.genes.annot \
      --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
      --gene-settings adap-permp=1001 \
      --big-data \
      --out ${eMAGMA_outdir}/${output}.${tissue} &> ${eMAGMA_outdir}/error3.log;
    elif  [[ "$synonym" == "skip" ]]; then
      ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonym-dup=skip \
      --gene-annot ${dbdir}/tissues/${tissue}.genes.annot \
      --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
      --gene-settings adap-permp=1001 \
      --big-data \
      --out ${eMAGMA_outdir}/${output}.${tissue} &> ${eMAGMA_outdir}/error3.log;
    elif  [[ "$synonym" == "skip-dup" ]]; then
      ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population} synonym-dup=skip-dup \
      --gene-annot ${dbdir}/tissues/${tissue}.genes.annot \
      --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
      --gene-settings adap-permp=1001 \
      --big-data \
      --out ${eMAGMA_outdir}/${output}.${tissue} &> ${eMAGMA_outdir}/error3.log;
    else
      ${bin_scripts}/magma --bfile ${dbdir}/g1000_${population}/g1000_${population}  \
      --gene-annot ${dbdir}/tissues/${tissue}.genes.annot \
      --pval ${outdir}/input1.txt use=rsid,pval_nominal ncol=n \
      --gene-settings adap-permp=1001 \
      --big-data \
      --out ${eMAGMA_outdir}/${output}.${tissue} &> ${eMAGMA_outdir}/error3.log;
    fi

    Rscript --vanilla ${bin_scripts}/Genes.R ${eMAGMA_outdir}/${output}.${tissue}.genes.out ${dbdir}/NCBI/NCBI37.3.gene.loc
fi

Rscript --vanilla ${bin_scripts}/Genes.R ${eMAGMA_outdir}/${output}.genes.out ${dbdir}/NCBI/NCBI37.3.gene.loc
Rscript --vanilla ${bin_scripts}/plot_qq_manhattan.R ${outdir}/input1.txt ${eMAGMA_outdir}

mv ${eMAGMA_outdir}/${output}.genes.out ${eMAGMA_outdir}/gene_set.genes.out
mv ${eMAGMA_outdir}/${output}.genes.annot ${eMAGMA_outdir}/genes.annot
mv ${eMAGMA_outdir}/${output}.genes.raw ${eMAGMA_outdir}/genes.raw
mv ${eMAGMA_outdir}/${output}.log ${eMAGMA_outdir}/log.log
mv ${eMAGMA_outdir}/${output}.log.suppl ${eMAGMA_outdir}/log.suppl
mv ${eMAGMA_outdir}/${output}.${tissue}.genes.out ${eMAGMA_outdir}/gene_set.${tissue}.genes.out
mv ${eMAGMA_outdir}/${output}.${tissue}.genes.raw ${eMAGMA_outdir}/genes.raw_${tissue}
mv ${eMAGMA_outdir}/${output}.${tissue}.log ${eMAGMA_outdir}/log.log_${tissue}
mv ${eMAGMA_outdir}/${output}.${tissue}.log.suppl ${eMAGMA_outdir}/log.suppl_${tissue}

echo "STEP 5 SMR"

### SMR
## Input files ----> SNP    A1  A2  freq    b   se  p   n
## orginal header --- > rsid	CHR	BP	A1	A2	freq	slope	slope_se	pval_nominal	n
mkdir -p ${outdir}/step5_SMR
SMR_outdir="${outdir}/step5_SMR"

cut -f1,4,5,6,7,8,9,10   ${outdir}/input1.txt > ${outdir}/input.smr
sed -i 's/rsid/SNP/' ${outdir}/input.smr
sed -i 's/slope_se/se/' ${outdir}/input.smr
sed -i 's/slope/b/' ${outdir}/input.smr
sed -i 's/pval_nominal/p/' ${outdir}/input.smr



heidi=${29}       #{on, off}
trans=${30};      #{on,off} #SMR and HEIDI tests in trans regions
smr_multi=${31};  #{on,off}  #Multi-SNP-based SMR test

maf=${32}; #The default value is 0.05
diff_freq=${33} # The default value is 0.2.
diff_freq_prop=${34} ; # The default value is 0.05.
cis_wind=${35} #The default value is 2000Kb.
peqtl_smr=${36};  # The default value is 5.0e-8.
ld_upper_limit=${37}; #The default value is 0.9
ld_lower_limit=${38}; #The default value is 0.05.

### Heidi Parameters
peqtl_heidi=${39}; #The default value is 1.57e-3,
heidi_mtd=${40}; #{0,1} The default value is 1
heidi_min_m=${41};  #  The default value is 3
heidi_max_m=${42}; # The default value is 20.

### Parameters for  trans regions analysis
trans_wind=${43} # 1000

### Parameters for Multi-SNP-based SMR test
set_wind=${44}; # defines a window width (Kb).-9 resulting in selecting SNPs in the whole cis-region if this option is not specified.
ld_multi_snp=${45} # The default value is 0.1.
Westra_eqtl=${46} #{true, false}
CAGE_eqtl=${47} #{true, false}
GTEx_v8_tissue=${48};

### Set commands for : HEIDI, trans, and multi_snp
HEIDI_cmd='';
if [[ $heidi = "off" ]]; then
  HEIDI_cmd='--heidi-off';
else
  HEIDI_cmd="--heidi-mtd ${heidi_mtd} \
  --peqtl-heidi ${peqtl_heidi} \
  --heidi-min-m ${heidi_min_m} \
  --heidi-max-m ${heidi_max_m} "
fi


#SMR and HEIDI tests in trans regions
trans_cmd='';
if [[ ${trans} = "on" ]]; then
  trans_cmd="--trans \
  --trans-wind ${trans_wind} "
fi

#Multi-SNP-based SMR test
smr_multi_cmd='';
if [[ ${smr_multi} = "on" ]]; then
  smr_multi_cmd="--smr-multi \
  --ld-multi-snp ${ld_multi_snp} "
fi

smr_cmd(){
  ${bin_scripts}/smr_Linux  --bfile ${dbdir}/g1000_${population}/g1000_${population}   \
  --gwas-summary ${outdir}/input.smr \
  --beqtl-summary ${dbdir}/smr/$1 \
  --maf ${maf} \
  --cis-wind ${cis_wind} \
  --diff-freq ${diff_freq} \
  --diff-freq-prop ${diff_freq_prop} \
  --peqtl-smr ${peqtl_smr} \
  ${HEIDI_cmd} \
  --out ${SMR_outdir}/$2

  Rscript --vanilla  ${bin_scripts}/plot_qq_manhattan_smr.R  ${SMR_outdir}/$2.smr ${SMR_outdir} $2
}

smr_trans_cmd(){
  ${bin_scripts}/smr_Linux  --bfile ${dbdir}/g1000_${population}/g1000_${population}   \
  --gwas-summary ${outdir}/input.smr \
  --beqtl-summary ${dbdir}/smr/$1 \
  --maf ${maf} \
  --cis-wind ${cis_wind} \
  --diff-freq ${diff_freq} \
  --diff-freq-prop ${diff_freq_prop} \
  --peqtl-smr ${peqtl_smr} \
  ${HEIDI_cmd} \
  ${trans_cmd} \
  --out ${SMR_outdir}/$2
}

smr_multi_cmd(){
  ${bin_scripts}/smr_Linux  --bfile ${dbdir}/g1000_${population}/g1000_${population}   \
  --gwas-summary ${outdir}/input.smr \
  --beqtl-summary ${dbdir}/smr/$1 \
  --maf ${maf} \
  --cis-wind ${cis_wind} \
  --diff-freq ${diff_freq} \
  --diff-freq-prop ${diff_freq_prop} \
  --peqtl-smr ${peqtl_smr} \
  ${HEIDI_cmd} \
  ${smr_multi_cmd} \
  --out ${SMR_outdir}/$2

  Rscript --vanilla  ${bin_scripts}/plot_qq_manhattan_smr.R  ${SMR_outdir}/$2.msmr ${SMR_outdir} $2
}


if [[ "$Westra_eqtl" = "true" ]]; then
    smr_out="Westra";
    smr_cmd westra_eqtl_hg19 ${smr_out} &> ${SMR_outdir}/error_westra.log;
    if [[ ${trans} = "on" ]]; then
      smr_trans_cmd westra_eqtl_hg19 ${smr_out}_trans &> ${SMR_outdir}/error_westra_trans.log;
    fi

    if [[ ${smr_multi} = "on" ]]; then
        smr_multi_cmd westra_eqtl_hg19 ${smr_out}_multi &> ${SMR_outdir}/error_westra_multi.log;
    fi
fi


if [[ "$CAGE_eqtl" = "true" ]]; then
    smr_out="CAGE";
    smr_cmd CAGE.sparse ${smr_out} &> ${SMR_outdir}/error_cage.log;
    if [[ ${trans} = "on" ]]; then
      smr_trans_cmd CAGE.sparse ${smr_out}_trans &> ${SMR_outdir}/error_cage_trans.log;
    fi

    if [[ ${smr_multi} = "on" ]]; then
        smr_multi_cmd CAGE.sparse ${smr_out}_multi &> ${SMR_outdir}/error_cage_multi.log;
    fi
fi

if [[ "$GTEx_v8_tissue" != "" ]]; then
	smr_out=${GTEx_v8_tissue};
  smr_cmd GTEx8/${GTEx_v8_tissue}/${GTEx_v8_tissue} ${smr_out} &> ${SMR_outdir}/error_tissue.log;
  if [[ ${trans} = "on" ]]; then
    smr_trans_cmd GTEx8/${GTEx_v8_tissue}/${GTEx_v8_tissue} ${smr_out}_trans &> ${SMR_outdir}/error_tissue_trans.log;
  fi

  if [[ ${smr_multi} = "on" ]]; then
      smr_multi_cmd GTEx8/${GTEx_v8_tissue}/${GTEx_v8_tissue} ${smr_out}_multi &> ${SMR_outdir}/error_tissue_multi.log;
  fi
fi

echo "STEP 6 and 7 Annovar"
## Annovar
## Input --> chromosome, start position, end position, the reference nucleotides and the observed nucleotides.
## orginal header --- > rsid	CHR	BP	A1	A2	freq	slope	slope_se	pval_nominal	n
awk 'BEGIN{OFS="\t"} (FNR==1) {next;} {print $2,$3,($3),$4,$5,$1}' ${outdir}/input1.txt > ${outdir}/input.annovar
mkdir -p ${outdir}/step6_deleteriousness
mkdir -p ${outdir}/step7_annotations
deleteriousness_outdir="${outdir}/step6_deleteriousness"
annotations_outdir="${outdir}/step7_annotations"

# deleteriousness and annotation
GENE_DB=${49} #{ucsc", "ensembl"}
CYTOBAND=${50}  #{ true, false}
ALL=${51}  #{ true, false}
AFR=${52} #{ true, false}
AMR=${53} #{ true, false}
EAS=${54} #{ true, false}
EUR=${55}  #{ true, false}
SAS=${56} #{ true, false}
EXAC=${57} #{ true, false}
DISGENET=${58} #{ true, false}
CLINVAR=${59} #{ true, false}
INTERVAR=${60} #{ true, false}
DATABASES="refGene"; ## Dare, please explain this variable and why it has only one value
OPERATION="g,f"    #### Dare, please explain this also.
if [ "$GENE_DB" = "ucsc" ]; then
  DATABASES="knownGene"
fi
if [ "$GENE_DB" = "ensembl" ]; then
  DATABASES="ensGene"
fi
DATABASES="${DATABASES},dbnsfp33a"
#
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar refGene ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb cytoBand ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar exac03 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar avsnp147 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar dbnsfp30a ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar dbnsfp33a ${dbdir}/annovar/humandb/
###
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar knownGene ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar ensGene ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar cytoBand ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar ALL.sites.2015_08 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar AFR.sites.2015_08 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar AMR.sites.2015_08 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar EAS.sites.2015_08 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar EUR.sites.2015_08 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar SAS.sites.2015_08 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar clinvar_20170130 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar intervar_2017020 ${dbdir}/annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar 1000g2015aug ${dbdir}//annovar/humandb/
# perl ${bin_scripts}/annotate_variation.pl -buildver hg19 -downdb -webfrom annovar intervar_20170202 ${dbdir}//annovar/humandb/
perl "${bin_scripts}/table_annovar.pl" "${outdir}/input.annovar" "${dbdir}/annovar/humandb/" -buildver hg19 \
    -out "${deleteriousness_outdir}/deleteriousness_output" -remove -protocol ${DATABASES} \
    -operation $OPERATION -nastring na -csvout -polish &> ${deleteriousness_outdir}/error_delet.log
#run rscript
Rscript ${bin_scripts}/filter_exonic.R ${outdir}/input.annovar ${deleteriousness_outdir} ${GENE_DB}
OPERATION="gx"    #### Dare, please explain this also.
DATABASES="refGene"
if [ "$GENE_DB" = "ucsc" ]; then
  DATABASES="knownGene"
fi
if [ "$GENE_DB" = "ensembl" ]; then
  DATABASES="ensGene"
fi
# DATABASES="${DATABASES},dbnsfp33a"
# if [ "$GENE_DB" = "ucsc" ]; then
  # DATABASES="knownGene"
# fi
# if [ "$GENE_DB" = "ensembl" ]; then
  # DATABASES="ensGene"
# fi
if [[ $CYTOBAND == true ]]
then
  DATABASES="${DATABASES},cytoBand"
  OPERATION="${OPERATION},r"
fi
if [[ $ALL == true ]]
then
  DATABASES="${DATABASES},ALL.sites.2015_08"
  OPERATION="${OPERATION},f"
fi
if [[ $AFR == true ]]
then
  DATABASES="${DATABASES},AFR.sites.2015_08"
  OPERATION="${OPERATION},f"
fi
if [[ $AMR == true ]]
then
  DATABASES="${DATABASES},AMR.sites.2015_08"
  OPERATION="${OPERATION},f"
fi
if [[ $EAS == true ]]
then
  DATABASES="${DATABASES},EAS.sites.2015_08"
  OPERATION="${OPERATION},f"
fi
if [[ $EUR == true ]]
then
  DATABASES="${DATABASES},EUR.sites.2015_08"
  OPERATION="${OPERATION},f"
fi
if [[ $SAS == true ]]
then
  DATABASES="${DATABASES},SAS.sites.2015_08"
  OPERATION="${OPERATION},f"
fi
if [[ $EXAC == true ]]
then
  DATABASES="${DATABASES},exac03"
  OPERATION="${OPERATION},f"
fi
if [[ $CLINVAR == true ]]
then
  DATABASES="${DATABASES},clinvar_20170130"
  OPERATION="${OPERATION},f"
fi
if [[ $INTERVAR == true ]]
then
  DATABASES="${DATABASES},intervar_20170202"
  OPERATION="${OPERATION},f"
fi
perl "${bin_scripts}/table_annovar.pl"  "${outdir}/input.annovar" "${dbdir}/annovar/humandb/" -buildver hg19 \
    -out "${annotations_outdir}/annotation_output" -remove -protocol ${DATABASES} \
    -operation $OPERATION -nastring . -csvout -polish -xref ${dbdir}/annovar/example/gene_xref.txt &> ${annotations_outdir}/error_annot.log
#run rscript
Rscript  ${bin_scripts}/disgenet_script.R ${DISGENET} "${outdir}/input.annovar" ${annotations_outdir} ${GENE_DB} ${dbdir}/annovar/disgenet
##perl annotate_variation.pl -webfrom annovar -downdb avdblist -buildver hg19 .

### Step 8 HaploR
#echo "STEP 8 HAPLOR"
#
##cleaning input file
#touch ${outdir}/input.haploR
#echo "SNPs" > ${outdir}/input.haploR   ### header
#
#awk 'BEGIN{OFS="\t"}
#(FNR==NR)  {a[$1]=$1; next}
#($1 in a ) {print $0 }' ${dbdir}/haploR/1KG_phase1_snps.db  ${clump_output}/SNPs.clump >>  ${outdir}/input.haploR
#
#mkdir -p ${outdir}/step8_HaploR
#HaploR_outdir="${outdir}/step8_HaploR"
#
#ldThresh=${61} #0.8
#ldPop=${population^^}    # {"AFR", "AMR", "ASN", "EUR"}
#if [ ${ldPop} = "SAS" ] || [ ${ldPop} = "EAS" ]; then
#    ldPop="ASN"
#fi
#epi=${62}  # {"vanilla", "imputed", "methyl"} ---> Default "vanilla"
#cons=${63}    # {"gerp",  "siphy","both"} ---> Default   "both"
#genetypes=${64}  #{'gencode', 'refseq'}
#
#Rscript --vanilla ${bin_scripts}/HaploReg.R ${outdir}/input.haploR \
#${HaploR_outdir} \
#$ldThresh \
#$ldPop \
#$epi \
#$cons \
#${genetypes}
#
#### Removing carriage return sybmbols
#sed -i 's/\r//g' ${outdir}/step8_HaploR/results_haploR.txt

# 0.8 vanilla both refseq
rm ${outdir}/input*
rm ${outdir}/Pascal.input