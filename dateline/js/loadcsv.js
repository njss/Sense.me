
var t = d3.csv("all_files.csv", function(error, dataset){
	//d3.select("#datasetslist").html(

	d3.select("#datasetslist").selectAll("option")
		.data(dataset)
		.enter()
			.append("option")			
			.attr("value", function (d) {return d.filename;})
			.text(function(d) {return d.filename;})
});       