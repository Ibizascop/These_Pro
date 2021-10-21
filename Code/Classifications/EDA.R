library(ggplot2)
library(ggthemes)

#Somme labels
data_with_tags <- read.csv("Data/data_with_tags.csv")
data_with_tags =data_with_tags[,3:ncol(data_with_tags)]
sum_labels = as.data.frame(colSums(data_with_tags))
colnames(sum_labels) = c("Somme")
sum_labels$label = colnames(data_with_tags)
write.table(sum_labels,"Data/sum_labels.csv",sep=",")

#Log log points
plot(log(sum_labels$rank), log(sum_labels$sum_labels), main='Log-Log Plot')
points <- ggplot(sum_labels, aes(x=log(rank), y= log(sum_labels)))
points + geom_point() + labs(title='Log-Log Plot of number of occurences of labels', x='Log(rank)', y='Log(number of occurences)') +
  theme_clean()

#Pie Chart
pie(sum_labels$Somme)