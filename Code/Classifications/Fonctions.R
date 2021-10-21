Jaccard = function(df) {
  Nb_rows = length(as.list(row.names(df)))
  Nb_col =  length(as.list(colnames(df)))
  distances_Matrix = matrix(nrow = Nb_rows, ncol = Nb_rows)
  
  for (x1 in 1: Nb_rows) {
    print(round(((x1/Nb_rows)*100),2))
    for (x2 in 1 : Nb_rows) {
        a = 0
        b = 0
        c = 0
        d = 0
        for (j in 1: Nb_col) {
          if (df[x1,j] == 1 & df[x2,j] == 1) {
            a = a +1
          }  
          if (df[x1,j] == 0 & df[x2,j] == 1) {
            b = b + 1
          }  
          if (df[x1,j] == 1 & df[x2,j] == 0) {
            c = c + 1
          }    
          distances_Matrix[x1,x2] = 1-(a/(a+b+c))
        }
      }
    }
  print("Distances terminées")
  distances_Matrix = (distances_Matrix - min(distances_Matrix)/max(distances_Matrix)-min(distances_Matrix))
  return(distances_Matrix)
}

Russel = function(df) {
  Nb_rows = length(as.list(row.names(df)))
  Nb_col =  length(as.list(colnames(df)))
  distances_Matrix = matrix(nrow = Nb_rows, ncol = Nb_rows)
  
  for (x1 in 1: Nb_rows) {
    print(round(((x1/Nb_rows)*100),2))
    for (x2 in 1 : Nb_rows) {
        a = 0
        b = 0
        c = 0
        d = 0
        for (j in 1: Nb_col) {
          if (df[x1,j] == 1 & df[x2,j] == 1) {
            a = a +1
          }  
          if (df[x1,j] == 0 & df[x2,j] == 1) {
            b = b + 1
          }  
          if (df[x1,j] == 1 & df[x2,j] == 0) {
            c = c + 1
          }    
          if (df[x1,j] == 0 & df[x2,j] == 0) {
            d= d + 1
          }
          distances_Matrix[x1,x2] = 1-(a/(a+b+c+d))
        }
      }
  } 
  (distances_Matrix - min(distances_Matrix)/max(distances_Matrix)-min(distances_Matrix))
  return(distances_Matrix)
}


Sohal = function(df) {
  Nb_rows = length(as.list(row.names(df)))
  Nb_col =  length(as.list(colnames(df)))
  distances_Matrix = matrix(nrow = Nb_rows, ncol = Nb_rows)
  
  for (x1 in 1: Nb_rows) {
    print(round(((x1/Nb_rows)*100),2))
    for (x2 in 1 : Nb_rows){
        a = 0
        b = 0
        c = 0
        d = 0
        for (j in 1: Nb_col) {
          if (df[x1,j] == 1 & df[x2,j] == 1) {
            a = a +1
          }  
          if (df[x1,j] == 0 & df[x2,j] == 1) {
            b = b + 1
          }  
          if (df[x1,j] == 1 & df[x2,j] == 0) {
            c = c + 1
          }    
          if (df[x1,j] == 0 & df[x2,j] == 0) {
            d= d + 1
          }
          distances_Matrix[x1,x2] = 1-((a+d)/(a+b+c+d))
        }
      }
    }
  (distances_Matrix - min(distances_Matrix)/max(distances_Matrix)-min(distances_Matrix))
  return(distances_Matrix)
}

#CAH avec TF-IDF

TF_IDF = function(data) {
  
  
  data_CAH = data
  data_CAH = data_CAH[-c(1,2,3)]
  #data_CAH = data_CAH[1:nrow(data_CAH)-1,]


  TF = as.matrix(data_CAH)
  IDF = matrix(0,nrow = 1, ncol = length(colnames(data_CAH)))
  row.names(IDF) = c("IDF")
  colnames(IDF) = colnames(data_CAH)
  
  for (i in 1:ncol(IDF)) {
    IDF[1,i] = log(nrow(data_CAH)/sum(data_CAH[,i]))
  }
  
  
  TF_IDF =matrix(0,nrow = nrow(data_CAH), ncol= ncol(data_CAH))
  row.names(TF_IDF) = row.names(data_CAH)
  colnames(TF_IDF) = colnames(data_CAH)
  
  for (i in 1:nrow(TF_IDF)) {
    TF_IDF[i,] = TF[i,] * IDF[1,]
  }
  
  distances_matrix = matrix(0, nrow = nrow(data_CAH), ncol = nrow(data_CAH))
  row.names(distances_matrix ) = row.names(data_CAH)
  colnames(distances_matrix ) = row.names(data_CAH)
  
  pb <- progress_bar$new(total = nrow(distances_matrix))
  for (i in 1: nrow(distances_matrix)) {
    pb$tick()
    Sys.sleep(1 / 100)
    for (j in 1: nrow(distances_matrix)) {
      distances_matrix[i,j] = 1-(cosine(TF_IDF[i,],TF_IDF[j,]))
    }
  }
  return(distances_matrix)
}

CAH = function(distance_matrix) {
  Dendo = agnes(x = distance_matrix , 
                diss = TRUE,
                stand = TRUE, 
                metric = "euclidean",
                method = "ward")
  return(Dendo)
}

Partitions = function(Dendo) {
  inertie <- sort(Dendo$height, decreasing = TRUE)
  plot(inertie[1:50], type = "s", xlab = "Nombre de classes", ylab = "Inertie")
}

Plot_Dendo = function(Dendo,nb_de_classes) {
  fviz_dend(Dendo, cex = 0.5, hang=-1,k=nb_de_classes,main = paste("Quality=",round(Dendo$ac,4)), 
            xlab = "",
            ylab = "Height",
            color_labels_by_k = TRUE,
            rect = TRUE,
            rect_border = "black")
}

Resultats_CAH = function(Dendo,data,nb_de_classes) {
  clusters = cutree(Dendo,k=nb_de_classes)
  res_CAH = matrix(ncol = 2,nrow = length(Dendo$order))
  res_CAH[,1] = clusters
  res_CAH[,2] = row.names(data)
  colnames(res_CAH) = c("Cluster","Image")
  return(res_CAH)
}

#KNN
KNN = function(data) {
  precision_KNN = matrix(0,nrow=sqrt(nrow(data)),ncol=1)
  precision_KNN_max = 0
  pb <- progress_bar$new(total = sqrt(nrow(data)))
  
    
  for (i in 1:sqrt(nrow(data))) {
    pb$tick()
    Sys.sleep(1 / 100)
    
    ran <- sample(1:nrow(data), 0.9 * nrow(data)) 
    data_train <- data[ran,] 
    data_test <- data[-ran,]
    notes_train <- data_train[,3]
    notes_test <- data_test[,3]
    
    knn_boot <- knn(data_train[,3:ncol(data)],data_test[,3:ncol(data)],cl=notes_train,k=i)
    tab <- table(knn_boot,notes_test) 
    precision_KNN[i] = accuracy(tab)
    
    if (precision_KNN[i] > precision_KNN_max) {
      precision_KNN_max = precision_KNN[i]
      knn_final = knn_boot
      notes_reelles_final = notes_test
      data_test_final <- data_test
      check = i 
    }
  }
  plot(1:sqrt(nrow(data)),precision_KNN,type='o',xlab ='Nb de voisins',ylab='Précision',main="Precision en fonction du nb de voisins")
  
  tab_final = table(knn_final,notes_reelles_final) 
  print(tab_final)
  final = list(knn = knn_final,data_test = data_test_final,notes = notes_reelles_final,l= length(knn_final))
  return(final)
}
Resultats_KNN = function(KNN,data_test,notes_reelles,l) {
  res_Knn = matrix(ncol = 3,nrow = l)
  res_Knn[,1] = KNN
  res_Knn[,2] = notes_reelles
  res_Knn[,3] = c(data_test$Nom.du.fichier)
  colnames(res_Knn) = c("Note_knn","Note_reelle","Image")
  return(res_Knn)
}

Correlations = function(data, tag) {
  #Enlever colonnes inutiles
  data = as.matrix(data[1:nrow(data),3:ncol(data)])
  
  #Corrélations et choix du tag 
  corr = as.data.frame(cor(data))
  tag_choisit = corr[c(tag)]
  
  
  #Trier
  tag_choisit_sort =  tag_choisit[order(-tag_choisit), ,drop = FALSE]
  
  #Récupérer top 10 et bottom 10
  top_10 =  tag_choisit_sort[2:11, ,drop = FALSE]
  bottom_10 =  tag_choisit_sort[(nrow(tag_choisit_sort)-9):nrow(tag_choisit_sort), ,drop = FALSE]
  
  #Assembler les 2
  most_correlated = rbind(top_10,bottom_10)
  
  #Encoder corrélations positives négatives
  most_correlated$fill = apply(most_correlated[,c(tag),drop = F],1,code)
  most_correlated$fill = as.factor(most_correlated$fill)

  
  #Barchart
  plot_correlations <- ggplot(most_correlated, aes(x = reorder(row.names(most_correlated), most_correlated[,c(tag)]), y =  most_correlated[,c(tag)] 
                                                   , fill = fill))+ geom_bar(stat = "identity", width = 0.7)+ 
    scale_fill_manual(values = c("1" = "green", "0" = "red"),guide = FALSE) +
    ylab(paste("Correlations avec",tag)) + xlab("Tags") +
    geom_text(aes(label=round(most_correlated[,c(tag)],2)), vjust=0.4)
  return(plot_correlations+ coord_flip())

  
}

Surprise_correlations = function(data) {
  library(ggplot2) 
  #Enlever colonnes inutiles
  data = as.matrix(data[1:nrow(data),3:ncol(data)])
  
  #Corrélations et choix du tag 
  corr = as.data.frame(cor(data))
  tag = sample(colnames(data),1)
  tag_choisit = corr[c(tag)]
  
  
  #Trier
  tag_choisit_sort =  tag_choisit[order(-tag_choisit), ,drop = FALSE]
  
  #Récupérer top 10 et bottom 10
  top_10 =  tag_choisit_sort[2:11, ,drop = FALSE]
  bottom_10 =  tag_choisit_sort[(nrow(tag_choisit_sort)-9):nrow(tag_choisit_sort), ,drop = FALSE]
  
  #Assembler les 2
  most_correlated = rbind(top_10,bottom_10)
  
  #Encoder corrélations positives négatives
  most_correlated$fill = apply(most_correlated[,c(tag),drop = F],1,code)
  most_correlated$fill = as.factor(most_correlated$fill)
  
  
  #Barchart
  plot_correlations <- ggplot(most_correlated, aes(x = reorder(row.names(most_correlated), most_correlated[,c(tag)]), y =  most_correlated[,c(tag)] 
                                                   , fill = fill))+ geom_bar(stat = "identity", width = 0.7)+ 
    scale_fill_manual(values = c("1" = "green", "0" = "red"),guide = FALSE) +
    ylab(paste("Correlations avec",tag)) + xlab("Tags") +
    geom_text(aes(label=round(most_correlated[,c(tag)],2)), vjust=0.4)
  return(plot_correlations+ coord_flip())
  
  
}

code = function(x) {
  if (x > 0 ) 
    return (1)
  else 
    return (0)
}

accuracy = function(confusion_table){
  sum(diag(confusion_table)/(sum(rowSums(confusion_table)))) * 100
}

change_tag_name = function(data,old_tag,new_tag) {
  for (i in 1:ncol(data)) {
    if ((colnames(data)[i]) == old_tag) {
      print(paste("Tag to change =",i))
      tag = i
    }
  }
  data[,new_tag] = data[,old_tag]
  print(paste("New tag name =",new_tag))
  data = data[-c(tag)]
  print(paste("Tag removed =",old_tag))
  return(data)
}

delete_tag = function(data,tag_to_delete) {
  for (i in 1:ncol(data)) {
    if ((colnames(data)[i]) == tag_to_delete) {
      print(paste("Tag to delete =",i))
      tag = i
    }
  }
  data = data[-c(tag)]
  print(paste("Tag removed =",tag_to_delete))
  return(data)
  print("Done")
}

Recommendations = function(data) {
  
  data_CAH = data
  data_CAH = data_CAH[-c(1,2,3)]
  #data_CAH = data_CAH[1:nrow(data_CAH)-1,]
  
  
  TF = as.matrix(data_CAH)
  IDF = matrix(0,nrow = 1, ncol = length(colnames(data_CAH)))
  row.names(IDF) = c("IDF")
  colnames(IDF) = colnames(data_CAH)
  
  for (i in 1:ncol(IDF)) {
    IDF[1,i] = log(nrow(data_CAH)/sum(data_CAH[,i]))
  }
  
  
  TF_IDF =matrix(0,nrow = nrow(data_CAH), ncol= ncol(data_CAH))
  row.names(TF_IDF) = row.names(data_CAH)
  colnames(TF_IDF) = colnames(data_CAH)
  
  for (i in 1:nrow(TF_IDF)) {
    TF_IDF[i,] = TF[i,] * IDF[1,]
  }
  
  distances_matrix = matrix(0, nrow = nrow(data_CAH), ncol = nrow(data_CAH))
  row.names(distances_matrix ) = row.names(data_CAH)
  colnames(distances_matrix ) = row.names(data_CAH)
  
  for (i in 1: nrow(distances_matrix)) {
    for (j in 1: nrow(distances_matrix)) {
      distances_matrix[i,j] = 1-(cosine(TF_IDF[i,],TF_IDF[j,]))
    }
  }
  distances_matrix = as.data.frame(distances_matrix)
  row.names(distances_matrix)=data$Nom.du.fichier
  colnames(distances_matrix)=data$Nom.du.fichier
  
  write.table(distances_matrix,"..\\distances.txt",sep=",")
  return(distances_matrix)
}

Arbre = function(data){
  
  data_arbre = data[-c(1,2)]
  data_arbre$Notes = as.character(data_arbre$Notes)
  
  precision_boot = matrix(0,nrow=100,ncol=1)
  precision_max = 0
  #Barre
  pb <- progress_bar$new(total = 100)
  
  for (i in 1:100) {
    pb$tick()
    Sys.sleep(1 / 100)
    #Bootsratp
    
      division_boot = sample(nrow(data_arbre), 0.6*nrow(data_arbre), replace = FALSE)
      TrainSet_boot = data_arbre[division_boot,]
      ValidSet_boot = data_arbre[-division_boot,]
      arbre_boot <- rpart(data_arbre$Notes~ ., data=data_arbre,subset = division_boot, control = rpart.control("minsplit" = 1), xval = 30)
      tab_boot = table(predict(arbre_boot, data_arbre[-division_boot,], type="class"), data_arbre[-division_boot,"Notes"]) 
      precision_boot[i] = (tab_boot[1]+tab_boot[7]
                           +tab_boot[13]
                           +tab_boot[19]
                           +tab_boot[25])/sum(tab_boot)
      
      if (precision_boot[i] > precision_max) {
        precision_max = precision_boot[i]
        arbre_final = arbre_boot
        check = i 
      }
    }
  #Recuperer meilleur arbre
  arbre_final
  tab_final = table(predict(arbre_final, data_arbre[-division_boot,], type="class"), data_arbre[-division_boot,"Notes"]) 
  print((tab_final[1]+tab_final[7]
    +tab_final[13]
    +tab_final[19]
    +tab_final[25])/sum(tab_final))
  
  #Visualisation simple
  plot(arbre_final)
  text(arbre_final,cex = 0.7)
  
  #Moyenne, Variance de l'ensemble des arbres
  mean(precision_boot)
  var(precision_boot)
  hist(precision_boot,xlab="Precision des arbres",main=paste("Precision moyenne =",
                                                             round(mean(precision_boot),4),",",
                                                             "Variance",round(var(precision_boot),4)))
  
}