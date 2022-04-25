#!/usr/bin/env Rscript
# To run it
###Rscript --vanilla plots.R $eMAGMA_output $networks_annotation plot_name

# test if there is at least one argument: if not, return an error
args = commandArgs(trailingOnly=TRUE)

if (length(args)<3){
  stop("Please check your input file", call.=FALSE)
                     }

ggbg2 <- function() {
  points(0,0,pch=16, cex=1e6, col="lightgray")
  grid(col="white", lty=1)
}

gsa.out= args[1]
indexes=args[2]
output=args[3]

db=read.table(gsa.out, header=T,stringsAsFactors = F)
db_index=read.table(indexes, header=F,stringsAsFactors = F)
pathway=unique(as.character(db_index[,1]))
links=rep("NA", dim(db)[1])
for(i in 1:length(pathway)){
  index1= which(as.character(db$FULL_NAME)==as.character(pathway[i]))
  index2=which(as.character(db_index[,1])==as.character(pathway[i]))
  links[index1]=as.character(db_index[index2,2])
}

db=cbind(db, links)

write.table(db, file = gsa.out , append = FALSE, quote =FALSE, sep = " ",
            row.names = FALSE,
            col.names = FALSE)

## significant pathway
j= which(db$P <= 0.05/dim(db)[1])

ggbg2 <- function() {
  points(0,0,pch=16, cex=1e6, col="lightgray")
  grid(col="white", lty=1)
}
if(length(j) >=1){
  plot_name=paste0(output,".svg")
  svg(plot_name, width = 7, height=7)
        par(mar=c(4,21,0,1) , oma=c(0,0,0,0))
        p<- barplot(db$P[j],horiz = TRUE,col="darkblue", names.arg=db$FULL_NAME[j],las=2,
        panel.last=ggbg2(), xlab="pvalue")
        dev.off()
}
