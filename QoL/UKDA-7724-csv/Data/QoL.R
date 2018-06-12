data2007  = read.csv("2007.csv")
data2011  = read.csv("2011.csv")

m = matrix(1:35, 35,37)

weights_females <- list("2007"=c(), "2011"=c())
weights_males <- list("2007"=c(), "2011"=c())

for (i in 1:35){
  m[i,1]= (sum( data2007$Y11_HH2a == 1 & data2007$Y11_Country==i))
  m[i,3]= (sum( data2007$Y11_HH2a == 2 & data2007$Y11_Country==i))
  weights_males$`2007`[i] = sum(data2007$w4[which(data2007$Y11_HH2a == 1 & data2007$Y11_Country==i)], na.rm = T)
  weights_females$`2007`[i] = sum(data2007$w4[which(data2007$Y11_HH2a == 2 & data2007$Y11_Country==i)], na.rm = T)
  m[i,5] = sum(data2007$Y11_MWIndex[which(data2007$Y11_HH2a == 1 & data2007$Y11_Country==i)], na.rm=T)/ weights_males$`2007`[i]
  m[i,7] =  sum(data2007$Y11_MWIndex[which(data2007$Y11_HH2a == 2 & data2007$Y11_Country==i)], na.rm=T)/weights_females$`2007`[i]
  
  
  m[i,2]= (sum( data2011$Y11_HH2a == 1 & data2011$Y11_Country==i))
  m[i,4]= (sum( data2011$Y11_HH2a == 2 & data2011$Y11_Country==i))
  weights_males$`2011`[i] = sum(data2011$w4[which(data2011$Y11_HH2a == 1 & data2011$Y11_Country==i)], na.rm = T)
  weights_females$`2011`[i] = sum(data2011$w4[which(data2011$Y11_HH2a == 2 & data2011$Y11_Country==i)], na.rm = T)
  m[i,6] = sum(data2011$Y11_MWIndex[which(data2011$Y11_HH2a == 1 & data2011$Y11_Country==i)], na.rm=T)/ weights_males$`2011`[i]
  m[i,8] = sum(data2011$Y11_MWIndex[which(data2011$Y11_HH2a == 2 & data2011$Y11_Country==i)], na.rm=T)/ weights_females$`2011`[i]
  
  m[i,9] = mean(data2011$Y11_MWIndex[which(data2011$Y11_Country==i)], na.rm=T)
  m[i,10] = mean(data2011$Y11_MWIndex[which(data2011$Y11_Country==i)], na.rm=T)
  
  m[i,11] = sum((data2007$Y11_ISCEDsimple==1 & data2007$Y11_Country==i), na.rm=T)
  m[i,12] = sum((data2007$Y11_ISCEDsimple==2 & data2007$Y11_Country==i), na.rm=T)
  m[i,13] = sum((data2007$Y11_ISCEDsimple==3 & data2007$Y11_Country==i), na.rm=T)
  m[i,14] = sum((data2007$Y11_ISCEDsimple==4 & data2007$Y11_Country==i), na.rm=T)
  m[i,15] = sum((data2007$Y11_ISCEDsimple==5 & data2007$Y11_Country==i), na.rm=T)
  m[i,16] = sum((data2007$Y11_ISCEDsimple==6 & data2007$Y11_Country==i), na.rm=T)
  m[i,17] = sum((data2007$Y11_ISCEDsimple==7 & data2007$Y11_Country==i), na.rm=T)
  m[i,18] = sum((data2007$Y11_ISCEDsimple==8 & data2007$Y11_Country==i), na.rm=T)

  m[i,19] = sum((data2011$Y11_ISCEDsimple==1 & data2011$Y11_Country==i), na.rm=T)
  m[i,20] = sum((data2011$Y11_ISCEDsimple==2 & data2011$Y11_Country==i), na.rm=T)
  m[i,21] = sum((data2011$Y11_ISCEDsimple==3 & data2011$Y11_Country==i), na.rm=T)
  m[i,22] = sum((data2011$Y11_ISCEDsimple==4 & data2011$Y11_Country==i), na.rm=T)
  m[i,23] = sum((data2011$Y11_ISCEDsimple==5 & data2011$Y11_Country==i), na.rm=T)
  m[i,24] = sum((data2011$Y11_ISCEDsimple==6 & data2011$Y11_Country==i), na.rm=T)
  m[i,25] = sum((data2011$Y11_ISCEDsimple==7 & data2011$Y11_Country==i), na.rm=T)
  m[i,26] = sum((data2011$Y11_ISCEDsimple==8 & data2011$Y11_Country==i), na.rm=T)
  
  m[i,27] = sum((data2011$Y11_Agecategory==1 & data2011$Y11_Country==i), na.rm=T)
  m[i,28] = sum((data2011$Y11_Agecategory==2 & data2011$Y11_Country==i), na.rm=T)
  m[i,29] = sum((data2011$Y11_Agecategory==3 & data2011$Y11_Country==i), na.rm=T)
  m[i,30] = sum((data2011$Y11_Agecategory==4 & data2011$Y11_Country==i), na.rm=T)
  m[i,31] = sum((data2011$Y11_Agecategory==5 & data2011$Y11_Country==i), na.rm=T)
  
  m[i,32] = sum((data2011$Y11_Agecategory==1 & data2011$Y11_Country==i), na.rm=T)
  m[i,33] = sum((data2011$Y11_Agecategory==2 & data2011$Y11_Country==i), na.rm=T)
  m[i,34] = sum((data2011$Y11_Agecategory==3 & data2011$Y11_Country==i), na.rm=T)
  m[i,35] = sum((data2011$Y11_Agecategory==4 & data2011$Y11_Country==i), na.rm=T)
  m[i,36] = sum((data2011$Y11_Agecategory==5 & data2011$Y11_Country==i), na.rm=T)
 
}
Countries = c("Austria" ,"Belgium","Bulgaria","Cyprus","Czech Republic","Germany","Denmark","Estonia","Greece","Spain","Finland","France","Hungary","Ireland","Italy","Lithuania","Luxembourg","Latvia","Malta","Netherlands","Poland","Portugal","Romania","Sweden","Slovenia","Slovakia","UK","Turkey","Croatia","Macedonia (FYROM)","Kosovo", "Serbia", "Montenegro", "Iceland","Norway")
dt = cbind(Countries,as.data.frame(m))
colnames(dt) <- c("Countries", "Males2007", "Males2011", "Females2007","Females2011","MaleWHO2007","MaleWHO2011", 
                 "FemaleWHO2007","FemaleWHO2011", "WHO2007", "WHO2011", "None2007", "Primary2007", 
                 "LowerSecondary2007","PostSecondary2007", "UpperSecondary2007", "TertiaryFirst2007", "TertiraryAdv2007"
                 , "NA2007", "None2011", "Primary2011", "LowerSecondary2011", 
                 "PostSecondary2011", "UpperSecondary2011", "TertiaryFirst2011", "TertiraryAdv2011", "NA2011" ,"18to24_2007","25o34_2007","35to49_2007","50to64_2007","64+in2007"
                 ,"18to24_2011","25o34_2011","35to49_2011","50to64_2011","64+in2011")
write.csv(dt, file = "genderbycountry.csv", row.names = F, col.names = TRUE)

