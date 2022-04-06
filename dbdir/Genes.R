#!/usr/bin/env Rscript
# To run it
###Rscript --vanilla Genes.R gene_set_Ouput NCBI_build

args = commandArgs(trailingOnly=TRUE)
gene_set_Ouput <- args[1]
NCBI_build  <- args[2]

geneSet= read.table(gene_set_Ouput, header=T,sep="")
ncbi= read.table(NCBI_build, header=F)
ncbi_header=c("GENE", "CHR",  "START"  , "STOP", "STRAND", "Gene_Name")
colnames(ncbi)=ncbi_header


results=merge(geneSet,ncbi, by=c("GENE", "CHR",  "START"  , "STOP"))# NA's match
write.table(results, file=gene_set_Ouput, row.names=FALSE,sep="\t", quote = FALSE)
