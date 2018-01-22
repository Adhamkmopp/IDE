integrated = read.table("2003-2012.tab",sep="\t", header=TRUE)
data2007= integrated[integrated$Wave==2,]
data2011= integrated[integrated$Wave==3,]
m = matrix(1:35, 35,43)

weights_females <- list("2007"=c(), "2011"=c())
weights_males <- list("2007"=c(), "2011"=c())
weights_age_1<- list("2007"=c(), "2011"=c())
weights_age_2<- list("2007"=c(), "2011"=c())
weights_age_3<- list("2007"=c(), "2011"=c())
weights_age_4<- list("2007"=c(), "2011"=c())
weights_age_5 <- list("2007"=c(), "2011"=c())

social_contact <- cbind(data2011$Y11_Q33a,data2011$Y11_Q33b,data2011$Y11_Q33c,data2011$Y11_Q33d)
social_contact[social_contact==6 | social_contact==99 | social_contact == 98] <-NA # replacing all values of 6 ("Don't have relatives") with zeros
completeSoc <- !is.na(data2011$Y11_Q33a)
social_contact <-rowSums(social_contact, na.rm = T)/4
for (i in 1:35){
  
  weights_age_1$`2007`[i] = sum(data2007$w4[which(data2007$Y11_Agecategory == 1 & data2007$Y11_Country==i)], na.rm = T)
  weights_age_2$`2007`[i] = sum(data2007$w4[which(data2007$Y11_Agecategory == 2 & data2007$Y11_Country==i)], na.rm = T)
  weights_age_3$`2007`[i] = sum(data2007$w4[which(data2007$Y11_Agecategory == 3 & data2007$Y11_Country==i)], na.rm = T)
  weights_age_4$`2007`[i] = sum(data2007$w4[which(data2007$Y11_Agecategory == 4 & data2007$Y11_Country==i)], na.rm = T)
  weights_age_5$`2007`[i] = sum(data2007$w4[which(data2007$Y11_Agecategory == 5 & data2007$Y11_Country==i)], na.rm = T)
  
  weights_age_1$`2011`[i] = sum(data2011$w4[which(data2011$Y11_Agecategory == 1 & data2011$Y11_Country==i)], na.rm = T)
  weights_age_2$`2011`[i] = sum(data2011$w4[which(data2011$Y11_Agecategory == 2 & data2011$Y11_Country==i)], na.rm = T)
  weights_age_3$`2011`[i] = sum(data2011$w4[which(data2011$Y11_Agecategory == 3 & data2011$Y11_Country==i)], na.rm = T)
  weights_age_4$`2011`[i] = sum(data2011$w4[which(data2011$Y11_Agecategory == 4 & data2011$Y11_Country==i)], na.rm = T)
  weights_age_5$`2011`[i] = sum(data2011$w4[which(data2011$Y11_Agecategory == 5 & data2011$Y11_Country==i)], na.rm = T)
  
  
  #  Counting males and females for each country
  m[i,1]= (sum( data2007$Y11_HH2a == 1 & data2007$Y11_Country==i))
  m[i,2]= (sum( data2007$Y11_HH2a == 2 & data2007$Y11_Country==i))
  
  m[i,3]= (sum( data2011$Y11_HH2a == 1 & data2011$Y11_Country==i))
  m[i,4]= (sum( data2011$Y11_HH2a == 2 & data2011$Y11_Country==i))

  #  Summing up all age groups per country
  m[i,5] = sum((data2007$Y11_Agecategory==1 & data2007$Y11_Country==i))
  m[i,6] = sum((data2007$Y11_Agecategory==2 & data2007$Y11_Country==i))
  m[i,7] = sum((data2007$Y11_Agecategory==3 & data2007$Y11_Country==i))
  m[i,8] = sum((data2007$Y11_Agecategory==4 & data2007$Y11_Country==i))
  m[i,9] = sum((data2007$Y11_Agecategory==5 & data2007$Y11_Country==i))
  
  m[i,10] = sum((data2011$Y11_Agecategory==1 & data2011$Y11_Country==i))
  m[i,11] = sum((data2011$Y11_Agecategory==2 & data2011$Y11_Country==i))
  m[i,12] = sum((data2011$Y11_Agecategory==3 & data2011$Y11_Country==i))
  m[i,13] = sum((data2011$Y11_Agecategory==4 & data2011$Y11_Country==i))
  m[i,14] = sum((data2011$Y11_Agecategory==5 & data2011$Y11_Country==i))
  
  # Aggregating education level for all samples per country
 
  
  m[i,15] = sum((data2007$Y11_ISCEDsimple== 0) & data2007$Y11_Country==i,na.rm=T)
  m[i,16] = sum((data2007$Y11_ISCEDsimple==1 & data2007$Y11_Country==i), na.rm=T)
  m[i,17] = sum((data2007$Y11_ISCEDsimple== 2 | data2007$Y11_ISCEDsimple== 3 | data2007$Y11_ISCEDsimple== 4) & data2007$Y11_Country==i,na.rm=T)
  m[i,18] = sum((data2007$Y11_ISCEDsimple== 5 | data2007$Y11_ISCEDsimple== 6 ) & data2007$Y11_Country==i,na.rm=T)
  
  m[i,19] =  sum((data2011$Y11_ISCEDsimple== 0) & data2011$Y11_Country==i,na.rm=T)
  m[i,20] = sum((data2011$Y11_ISCEDsimple==1 & data2011$Y11_Country==i), na.rm=T)
  m[i,21] = sum((data2011$Y11_ISCEDsimple== 2 | data2011$Y11_ISCEDsimple== 3 | data2011$Y11_ISCEDsimple== 4) & data2011$Y11_Country==i,na.rm=T)
  m[i,22] = sum((data2011$Y11_ISCEDsimple== 5 | data2011$Y11_ISCEDsimple== 6 ) & data2011$Y11_Country==i,na.rm=T)
  
  completeWHO2007 <- !is.na(data2007$Y11_MWIndex)
  completeWHO2011 <- !is.na(data2011$Y11_MWIndex)
  # Calutaing the mean WHO in total for each country
  m[i,23] = mean(data2007$Y11_MWIndex[which(data2007$Y11_Country==i & completeWHO2007)])
  m[i,24] = mean(data2011$Y11_MWIndex[which(data2011$Y11_Country==i & completeWHO2011)])
  
  # Summing WHO Mental Well-being by males and females per country and dividing by weight
  
  weightmale<- sum(data2007$w4[which(data2007$Y11_HH2a == 1 & data2007$Y11_Country==i & completeWHO2007)])
  weightfemale<- sum(data2007$w4[which(data2007$Y11_HH2a == 2 & data2007$Y11_Country==i & completeWHO2007)])
  m[i,25] = sum(data2007$Y11_MWIndex[which(data2007$Y11_HH2a == 1 & data2007$Y11_Country==i & completeWHO2007)])/weightmale
  m[i,26] = sum(data2007$Y11_MWIndex[which(data2007$Y11_HH2a == 2 & data2007$Y11_Country==i & completeWHO2007)])/weightfemale
  
  weightmale<- sum(data2011$w4[which(data2011$Y11_HH2a == 1 & data2011$Y11_Country==i & completeWHO2011)])
  weightfemale<- sum(data2011$w4[which(data2011$Y11_HH2a == 2 & data2011$Y11_Country==i & completeWHO2011)])
  m[i,27] = sum(data2011$Y11_MWIndex[which(data2011$Y11_HH2a == 1 & data2011$Y11_Country==i & completeWHO2011)])/weightmale
  m[i,28] = sum(data2011$Y11_MWIndex[which(data2011$Y11_HH2a == 2 & data2011$Y11_Country==i & completeWHO2011)])/weightfemale

wm1 <- sum(data2007$w4[which(data2007$Y11_Agecategory == 1 & data2007$Y11_Country==i  & completeWHO2007)])
wm2 <- sum(data2007$w4[which(data2007$Y11_Agecategory == 2 & data2007$Y11_Country==i  & completeWHO2007)])
wm3 <- sum(data2007$w4[which(data2007$Y11_Agecategory == 3 & data2007$Y11_Country==i  & completeWHO2007)])
wm4 <- sum(data2007$w4[which(data2007$Y11_Agecategory == 4 & data2007$Y11_Country==i  & completeWHO2007)])
wm5 <- sum(data2007$w4[which(data2007$Y11_Agecategory == 5 & data2007$Y11_Country==i  & completeWHO2007)])

wf1 <- sum(data2011$w4[which(data2011$Y11_Agecategory == 1 & data2011$Y11_Country==i  & completeWHO2011)])
wf2 <- sum(data2011$w4[which(data2011$Y11_Agecategory == 2 & data2011$Y11_Country==i  & completeWHO2011)])
wf3 <- sum(data2011$w4[which(data2011$Y11_Agecategory == 3 & data2011$Y11_Country==i  & completeWHO2011)])
wf4 <- sum(data2011$w4[which(data2011$Y11_Agecategory == 4 & data2011$Y11_Country==i  & completeWHO2011)])
wf5 <- sum(data2011$w4[which(data2011$Y11_Agecategory == 5 & data2011$Y11_Country==i  & completeWHO2011)])


m[i,29]= sum(data2007$Y11_MWIndex[(data2007$Y11_Agecategory==1 & data2007$Y11_Country==i  & completeWHO2007 )])/wm1
  m[i,30]= sum(data2007$Y11_MWIndex[(data2007$Y11_Agecategory==2 & data2007$Y11_Country==i & completeWHO2007)])/wm2
  m[i,31]= sum(data2007$Y11_MWIndex[(data2007$Y11_Agecategory==3 & data2007$Y11_Country==i & completeWHO2007)])/wm3
  m[i,32]= sum(data2007$Y11_MWIndex[(data2007$Y11_Agecategory==4 & data2007$Y11_Country==i & completeWHO2007)])/wm4
  m[i,33]= sum(data2007$Y11_MWIndex[(data2007$Y11_Agecategory==5 & data2007$Y11_Country==i & completeWHO2007)])/wm5
  
  m[i,34]= sum(data2011$Y11_MWIndex[(data2011$Y11_Agecategory==1 & data2011$Y11_Country==i & completeWHO2011)])/wf1
  m[i,35]= sum(data2011$Y11_MWIndex[(data2011$Y11_Agecategory==2 & data2011$Y11_Country==i & completeWHO2011)])/wf2
  m[i,36]= sum(data2011$Y11_MWIndex[(data2011$Y11_Agecategory==3 & data2011$Y11_Country==i & completeWHO2011)])/wf3
  m[i,37]= sum(data2011$Y11_MWIndex[(data2011$Y11_Agecategory==4 & data2011$Y11_Country==i & completeWHO2011)])/wf4
  m[i,38]= sum(data2011$Y11_MWIndex[(data2011$Y11_Agecategory==5 & data2011$Y11_Country==i & completeWHO2011)])/wf5
  
  #  Finding the mean of social contact per country (2011 only)
  m[i,39] = mean(social_contact[data2011$Y11_Country==i & completeSoc])
  
  # Finding the mean of deprivation for all samples per country
  m[i,40]= mean(data2007$Y11_Deprindex[which(data2007$Y11_Country==i)], na.rm=T)
  m[i,41]= mean(data2011$Y11_Deprindex[which(data2011$Y11_Country==i)], na.rm=T)
  
  m[i,42]= mean(data2007$Y11_SocExIndex[which(data2007$Y11_Country==i)], na.rm=T)
  m[i,43]= mean(data2011$Y11_SocExIndex[which(data2011$Y11_Country==i)], na.rm=T)
}

m[is.nan(m)]<-0     

Countries = c("Austria" ,"Belgium","Bulgaria","Cyprus","Czech Republic","Germany","Denmark","Estonia","Greece","Spain","Finland","France","Hungary","Ireland","Italy","Lithuania","Luxembourg","Latvia","Malta","Netherlands","Poland","Portugal","Romania","Sweden","Slovenia","Slovakia","United Kingdom","Turkey","Croatia",
              "Macedonia","Kosovo", "Serbia", "Montenegro", "Iceland","Norway")
dt = cbind(Countries,as.data.frame(m))
colnames(dt) <- c("Countries", "Males2007", "Females2007", "Males2011","Females2011",
                  "a18to24_2007","a25to34_2007","a35to49_2007","a50to64_2007","a64_2007",
                  "a18to24_2011","a25to34_2011","a35to49_2011","a50to64_2011","a64_2011",
                  "None2007", "Primary2007","Secondary2007" ,"Tertiary2007",
                  "None2011", "Primary2011","Secondary2011" ,"Tertiary2011",
                  "Who2007", "Who2011","MaleWHO2007","FemaleWHO2007",
                  "MaleWHO2011","FemaleWHO2011",
                  "a18to24WHO_2007","a25to34WHO_2007","a35to49WHO_2007","a50to64WHO_2007","a64WHO_2007",
                  "a18to24WHO_2011","a25to34WHO_2011","a35to49WHO_2011","a50to64WHO_2011","a64WHO_2011",
                  "Social_contact2011","Deprivation2007","Deprivation2011", "Social_exclusion2007",
                  "Social_exclusion2011")

write.csv(dt, file = "final.csv", row.names = F, col.names = TRUE)

