library(factoextra)
library(caret)
library(lime)
library(rpart)
library(cluster)
library(rpart.plot)
library(psych)
library(lsa)
library(progress)
source("Fonctions.R")

#CAH sur les distances TF IDF
distances_matrix = read.table("Data/TF_IDF_distances.csv",sep =",",header= TRUE)
distances_matrix = as.matrix(distances_matrix[,2:ncol(distances_matrix)])
row.names(distances_matrix) = colnames(distances_matrix )
#for (i in 1: nrow(distances_matrix)) {
  for (j in i: nrow(distances_matrix)) {
    distances_matrix[j,i] = distances_matrix[i,j]
  }
}

CAH_TF_IDF = CAH(distances_matrix )

partitions_TF_IDF = Partitions(CAH_TF_IDF)

Plot_Dendo(CAH_TF_IDF,35)

res_CAH = Resultats_CAH(CAH_TF_IDF,distances_matrix_2,35)

write.table(res_CAH,"Data/clusters_TF_IDF.csv",sep=",")

#CAH sur les distances color histogram
distances_matrix = read.table("Data/color_histogram_distances.csv",sep =",",header= TRUE)
distances_matrix = as.matrix(distances_matrix[,2:ncol(distances_matrix)])
row.names(distances_matrix) = colnames(distances_matrix )
#for (i in 1: nrow(distances_matrix)) {
  for (j in i: nrow(distances_matrix)) {
    distances_matrix[j,i] = distances_matrix[i,j]
  }
}

CAH_color_histogram = CAH(distances_matrix )

partitions_color_histogram = Partitions(CAH_color_histogram)

Plot_Dendo(CAH_color_histogram,25)

res_color_histogram = Resultats_CAH(CAH_color_histogram,distances_matrix,25)

write.table(res_color_histogram,"Data/clusters_color_histogram.csv",sep=",")


#CAH sur les distances CNN
distances_matrix = read.table("Data/CNN_distances.csv",sep =",",header= TRUE)
distances_matrix = as.matrix(distances_matrix[,2:ncol(distances_matrix)])
row.names(distances_matrix) = colnames(distances_matrix )
#for (i in 1: nrow(distances_matrix)) {
for (j in i: nrow(distances_matrix)) {
  distances_matrix[j,i] = distances_matrix[i,j]
}
}

CAH_CNN = CAH(distances_matrix )

partitions_CNN = Partitions(CAH_CNN)

Plot_Dendo(CAH_CNN,25)

res_CNN = Resultats_CAH(CAH_CNN,distances_matrix,25)

write.table(res_CNN,"Data/clusters_CNN.csv",sep=",")




