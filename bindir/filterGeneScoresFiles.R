#!/usr/bin/env Rscript
# To run it
###Rscript --vanilla ${bin_dir}/filterGeneScoresFiles.R ${outdir}/inputfileName ${outdir}/outputFileName pvalueCutoff

args = commandArgs(trailingOnly=TRUE)
inputfileName <- args[1]
outputFileName <- args[2]
pvalueCutoff <- args[2]
data=read.table(inputfileName, header=T)
indexes= which(data$pvalue<pvalueCutoff)
write.table(data[indexes,], file=outputFileName, row.names=FALSE,sep="\t", quote = FALSE)
