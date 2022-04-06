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
plots=function(gsa.out=gsa.out, indexes=indexes,output=output){
  if (file.exists(gsa.out)){ ## ex  Test_synapse.gsa.out
    eMAGMA_output <- read.table(gsa.out,header=TRUE, stringsAsFactors=FALSE,sep="", comment.char = "#")
    }else{
      stop("Can't find eMAGMA output file ", call.=FALSE)
    }

    if (file.exists(indexes)){ ## ex synapse_clusters.index.txt
      biological_functions <- read.table(indexes,header=TRUE, stringsAsFactors=FALSE,sep="\t", comment.char = "#")
      }else{
        stop("Can't find biological functions", call.=FALSE)
      }

    rownames(biological_functions)= biological_functions[,1]
    plot_name=paste0(output,".svg")
   


    if(dim(eMAGMA_output)[1]>=1){
      rownames(eMAGMA_output) = eMAGMA_output[,1]
      y_axis1=biological_functions[eMAGMA_output[,1],2]
      y_axis2=eMAGMA_output$NGENES
      bars= eMAGMA_output$P
      ## sort pvalues
      pvalues_sorted=order(eMAGMA_output$P)



      svg(plot_name, width = 7, height=7)
      par(mar=c(4,21,0,1) , oma=c(0,0,0,0))
      p<- barplot(bars[pvalues_sorted],horiz = TRUE,col="darkblue", names.arg=y_axis1[pvalues_sorted],las=2,
      panel.last=ggbg2(), xlab="pvalue")
      dev.off()
      eMAGMA_output[,1]=y_axis1
      write.table(eMAGMA_output,file= gsa.out, row.names=FALSE,sep="\t", quote = FALSE)

    }

}

plots(gsa.out=gsa.out, indexes=indexes,output=output)
