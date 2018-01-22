data <- read.csv("hands_pca.csv", header = FALSE)
colnames(data) <- c(colnames(data)) 
transp <- t(data)

write.csv(transp, file = "hands_pca_colname.csv", row.names=FALSE)


