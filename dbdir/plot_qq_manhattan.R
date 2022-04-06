#!/usr/bin/env Rscript

# To run it
###Rscript --vanilla plot_manhanttan.R $GWAS_Summary output-dir

##### Dependencies ---> qqman R package
###  Installation
#### 1- Install the stable release from CRAN:
     #### install.packages("qqman")
#### 2-  install directly from github using devtools
    ## library(devtools)
    ## install_github("stephenturner/qqman")

library(qqman)

args = commandArgs(trailingOnly=TRUE)
GWAS_summary <- args[1]
output_dir <- args[2]

GWAS_summary=read.table(GWAS_summary,header=T)
qq=paste0(output_dir,"/qq.png")
png(qq)# width=950, height=500)
qq(GWAS_summary$pval_nominal, main = "Q-Q plot of GWAS p-values")
dev.off()
manhattan =paste0(output_dir,"/manhattan.png")
png(manhattan, width=1000, height=500)
manhattan(GWAS_summary, chr="CHR", bp="BP", snp="rsid", p="pval_nominal" )
dev.off()
