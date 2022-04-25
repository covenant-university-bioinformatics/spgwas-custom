./custom_pipeline.sh UK_custom.0.05_rs.txt output eur 0.1 0.05 0.8 1 No  Yes glist-hg19 0 \
cc 0.3 0.00001 \
on 22 msigdb_entrez 0.05 50000 50000  3000 sum 1 0.05 \
Default 0 0 Liver \
on on on 0.05 0.2 0.05 2000 5.0e-8  0.9 0.05 1.57e-3 1 3 20 1000 -9 0.1 true true Lung \
ucsc true true true true true true true true true true true


#General
gwas_summray=$1
output=$(basename ${gwas_summray})
ouputdir=$2
population=$3

## clump
clump_p1=$4;            ## P-value threshold for a SNP to be included as an index SNP. By default, must have p-value no larger than 0.0001
clump_p2=$5;            ## Secondary significance threshold for clumped SNPs
clump_r2=$6;            ## LD threshold for clumping
clump_kb=$6;            ## Physical distance threshold for clumping
allow_overlap=$8        ## {Yes, No}
use_gene_region_file=${9} ## {Yes, No}
clump_range=${10}         ##{glist-hg19, glist-hg38}
clump_range_border=${11}  ## A window arround  gene bounds by the given number of kilobases, default 0

## fine mapping
type=${12} ##{"quant", "cc"} #quantification or case-control
s=${13} #proportion between case and control (between 0 and 1)
p1=${14} #p1: prior probability a SNP is associated with the trait 1, default 1e-4

## Pascal
runpathway=${15} #{on, off}
chr=${16}; #{1-22, all}
genesetfile=${17}; # {msigdb_entrez, msigBIOCARTA_KEGG_REACTOME}
pvalue_cutoff=${18} # 0.05
up=${19}   # 50000
down=${20}  # 50000
maxsnp=${21} #maximum number of SNPs per gene 3000
genescoring=${22}; # genescoring method  {max, sum} sum
mergedistance=${23} #genomic distance in mega-bases 1
mafcutoff=${24}   # 0.05

## ##### eMAGMA
synonym=${25};  # Accounting for synonymous SNP IDs
#### synonyms=No -- > suppress automatically loading, to speed up the process
#### synonym-dup=drop  -->  SNPs that have multiple synonyms in the data are removed from the analysis
#### synonym-dup=drop-dup -->  for each synonym entry only the first listed in the synonym file is retained;
#### synonym-dup=skip ---> the SNPs are left in the data and the synonym entry in the synonym file is skipped.
#### synonym-dup=skip-dup --->  the genotype data for all synonymous SNPs is retained.
#### if not provided i.e NA --> same as skip
up_window=${26} #0
down_window=${27} #0
tissue=${28}


### SMR
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


## deleteriousness and  annotation
GENE_DB=${49} #{ucsc", "ensembl"}
CYTOBAND=${50}  #{ true, false}
ALL=${51}  #{ true, false}
AFR=${52} #{ true, false}
AMR=${53} #{ true, false}
EAS=${54} #{ true, false}
EUR=${55}#{ true, false}
SAS=${56} #{ true, false}
EXAC=${57} #{ true, false}
DISGENET=${58} #{ true, false}
CLINVAR=${59} #{ true, false}
INTERVAR=${60} #{ true, false}
DATABASES="refGene"; ## Dare, please explain this variable and why it has only one value
OPERATION="gx,f"    #### Dare, please explain this also.

##
