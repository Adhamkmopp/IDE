data <- read.table('Antananarivo.txt', header=TRUE)

library(reshape)
melted_data <- melt(data, id=c("YEAR"))
colnames(melted_data) <-c('Year', 'Month', 'Temperature')
melted_data[,1] 
write.csv(melted_data, file = "temperatureAnana_season.csv")


