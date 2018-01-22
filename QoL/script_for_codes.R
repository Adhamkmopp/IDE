gender_by_country <- read.csv(file="/Users/carlotta/Dropbox/MsC-Bioinfo/SECONDO ANNO/InteractiveDataExploration/IDEassignments/QoL/genderbycountry.csv", header=TRUE, sep=",")
country_names <- gender_by_country$Countries
country_names
iso_codes <- c(040, 056, 100, 196, 203, 276, 208, 233, 300, 724, 246, 250, 348, 372, 380, 440, 442,
               428, 470, 528, 616, 620, 642, 752, 705, 703, 826, 792, 191, 807, -99, 688, 499, 352, 578)

names(iso_codes) <- country_names

write.csv2(iso_codes, file='/Users/carlotta/Dropbox/MsC-Bioinfo/SECONDO ANNO/InteractiveDataExploration/IDEassignments/QoL/iso_codes_countries.csv')
