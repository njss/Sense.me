setwd("D:/Graz_2013/Sense_Phd_Project/SenseWebViz/elasticviz/data")

#original dataset
newdata = read.csv("user1.csv", sep=",")


#Get only data where trial = ?
newdata2 <- newdata[ which(newdata$trial==1),]

## enter id here, you could also use 1:nrow(d) instead of rownames
id <- 1:nrow(newdata2)
newdata2 <- cbind(id=id, newdata2)

# Dataset with AOIS
datasetAOIS<- subset(newdata2, select=c(id, aoi, duration, trial))

final = reshape(datasetAOIS, direction = "wide", idvar = "trial", timevar = "id")

#write Durations Dataset
write.table(final, file = "user1_analysis.csv", append = FALSE, quote = TRUE, sep = ",",
            eol = "\n", na = "NA", dec = ".", row.names = TRUE,
            col.names = TRUE, qmethod = c("escape", "double"),
            fileEncoding = "")

