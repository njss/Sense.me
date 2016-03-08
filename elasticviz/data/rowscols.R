newdata = read.csv("user1.csv", sep=",")

# using subset function 
dataset<- subset(newdata, trial=1, select=c(aoi))

s <- strsplit(as.character(dataset$aoi), ',')


test = matrix(s,nrow = 1,ncol = 65)


set.seed(1)
x = data.frame(
  aoi = apply(test, 1, paste, collapse = ","),
  stringsAsFactors=FALSE)



splitdat = do.call("rbind", strsplit(x$aoi, ","))

splitdat = data.frame(apply(splitdat, 2, as.numeric))

names(splitdat) = paste("aoi_", 1:64, sep = ",")
head(splitdat)

