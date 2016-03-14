newdata = read.csv("user1.csv", sep=",")
# using subset function 
datasetAOIS<- subset(newdata, trial=1, select=c(aoi))

#Get AOIS
sAOIS <- strsplit(as.character(datasetAOIS$aoi), ',')
test = matrix(sAOIS,nrow = 1,ncol = 65)
set.seed(1)
xAOIS = data.frame(
  aoi = apply(test, 1, paste, collapse = ","),
  stringsAsFactors=FALSE)

#creates AOIS dataset with new columns V1, V2, V3
aois = do.call("rbind", strsplit(xAOIS$aoi, ","))
data.frame(apply(aois, 2, as.numeric))
names(aois) = paste("aoi_", 1:65, sep = ",")
head(aois)

#write AOIS Dataset
write.table(aois, file = "user1_aois.csv", append = FALSE, quote = TRUE, sep = ",",
            eol = "\n", na = "NA", dec = ".", row.names = TRUE,
            col.names = TRUE, qmethod = c("escape", "double"),
            fileEncoding = "")



#Get Durations
# using subset function 
datasetDurations<- subset(newdata, trial=1, select=c(duration))

sDurations <- strsplit(as.character(datasetDurations$duration), ',')
test = matrix(sDurations,nrow = 1,ncol = 65)
set.seed(1)
xDurations = data.frame(
  duration = apply(test, 1, paste, collapse = ","),
  stringsAsFactors=FALSE)

#creates Durations dataset with new columns V1, V2, V3
durations = do.call("rbind", strsplit(xDurations$duration, ","))
data.frame(apply(durations, 2, as.numeric))
names(durations) = paste("aoi_", 1:65, sep = ",")
head(durations)

#write Durations Dataset
write.table(durations, file = "user1_durations.csv", append = FALSE, quote = TRUE, sep = ",",
            eol = "\n", na = "NA", dec = ".", row.names = TRUE,
            col.names = TRUE, qmethod = c("escape", "double"),
            fileEncoding = "")

total <- rbind(data frameA, data frameB)
