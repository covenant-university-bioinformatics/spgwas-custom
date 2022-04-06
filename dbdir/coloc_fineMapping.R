# /usr/bin/env Rscript
# To run it

# test if there is at least one argument: if not, return an error
args = commandArgs(trailingOnly=TRUE)

if (length(args)==0) {
  stop("Please check your input file", call.=FALSE)
}


gwas_summary=args[1]
outdir=args[2]
p1=args[3]
type=args[4]
s=as.numeric(args[5])
library('coloc')


gwas <- read.table(file=gwas_summary, header=T, as.is=T, sep="");

### Remove duplicates rsids
unique_rsids= duplicated(trimws(as.character(gwas$rsid)))
index_rsids = which(unique_rsids == "FALSE")
gwas2=gwas[index_rsids,]

dataset <- list(
  pvalues=gwas2$pval_nominal,
  N=nrow(gwas2),
  #beta=input$slope_gwas,
  #varbeta=input$slope_se_gwas,
  snp=unique(gwas2$rsid),
  MAF=gwas2$freq
)



### gwas: check is beta (slope) does not havwe missings values
### gwas: check is se (slope_se) does not havwe missings values
slope_gwas_check= is.na(gwas2$slope)
slope_gwas= length(which(slope_gwas_check=="FALSE"))
se_gwas_check= is.na(gwas2$slope_se)
se_gwas= length(which(se_gwas_check=="FALSE"))
if(length(slope_gwas)==dim(gwas2)[1] &&	(length(slope_gwas)==length(se_gwas))){
  dataset=append(
           dataset,
           list(beta=gwas2$slope)
         )
dataset=append(
          dataset,
          list(varbeta=gwas2$slope_se)
                )
}

#### add type
dataset=append(
         dataset,
         list(type=type))

if (type == "cc"){
  dataset=append(
           dataset,
           list(s=as.numeric(s)))
  }



#plot_dataset(dataset)
my.res <- finemap.abf(dataset=dataset, p1=as.numeric(p1)/nrow(gwas2)) ### Correction
output_finemap=paste0(outdir,'/', "finemapping.results")
write.table(my.res[1:nrow(gwas2),], file=output_finemap, row.names=FALSE, sep="\t")
output_input2=paste0(outdir,'/', "finemapping.txt")
SNP.PP=my.res$SNP.PP[1:(nrow(gwas2))]
results=cbind(gwas2, SNP.PP)
write.table(results, file=output_input2, row.names=FALSE, sep="\t")
