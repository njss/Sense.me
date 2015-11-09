var config = d3.csv("all_files.csv", function(error, dataset){
	//d3.select("#datasetslist").html(
var countCSVFiles = 0;
var filenames = new Array();

//Our final dataset with all the csv files concatenated in an array object!
var finalDataset = [];

	d3.select("#datasetslist").selectAll("option")
		.data(dataset)
		.enter()
			.append("option")			
			.attr("value", function (d) {
				return d.filename;
			})
			.text(function(d) {
				countCSVFiles += 1;
				filenames.push("../data/" + d.filename);

				return d.filename;
			});

	var q = queue(countCSVFiles);
	var i =0;

	filenames.forEach(function(t) {
		i += 1;
		q.defer(request, t);
	});

	q.awaitAll(ready);

	//Queued csv files ready
	function ready(error, results) {	 

	var messageOk ="csv load files, ok!";
	var messageNotOk = "csv load files, not ok!"; 

		results.forEach (logArrayElements);

		try
		{
	  		function logArrayElements(element, index, array) {  		
  				finalDataset = finalDataset.concat(array[index]);	
			};
  		}
  		catch (err)
  		{

  			console.error(messageNotOk);
  			return messageNotOk;
  		}
  		
  		console.info(messageOk);
	  	return messageOk;
	};	

	function request(url, callback) {
  		d3.csv(url, function(error, dataset){
  			
  			callback(null, dataset);
  		});
    };
});       