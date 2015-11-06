var stepped = 0, chunks = 0, rows = 0;
var start, end;
var parser;
var pauseChecked = false;
var printStepChecked = false;
var data;

$(function()
{
	$('#submit-parse').click(function()
	{
		stepped = 0;
		chunks = 0;
		rows = 0;

		var txt = $('#input').val();
		var localChunkSize = $('#localChunkSize').val();
		var remoteChunkSize = $('#remoteChunkSize').val();
		var files = $('#files')[0].files;
		var config = buildConfig();

		// NOTE: Chunk size does not get reset if changed and then set back to empty/default value
		if (localChunkSize)
			Papa.LocalChunkSize = localChunkSize;
		if (remoteChunkSize)
			Papa.RemoteChunkSize = remoteChunkSize;

		pauseChecked = $('#step-pause').prop('checked');
		printStepChecked = $('#print-steps').prop('checked');


		if (files.length > 0)
		{
			if (!$('#stream').prop('checked') && !$('#chunk').prop('checked'))
			{
				for (var i = 0; i < files.length; i++)
				{
					if (files[i].size > 1024 * 1024 * 10)
					{
						alert("A file you've selected is larger than 10 MB; please choose to stream or chunk the input to prevent the browser from crashing.");
						return;
					}
				}
			}

			start = performance.now();
			
			$('#files').parse({
				config: config,
				before: function(file, inputElem)
				{
					console.log("Parsing file:", file);
				},
				complete: function()
				{
					console.log("Done with all files.");
					setTable(data);
				}
			});
		}
		else
		{
			start = performance.now();
			var results = Papa.parse(txt, config);
			console.log("Synchronous parse results:", results);
		}
	});

	$('#submit-unparse').click(function()
	{
		var input = $('#input').val();
		var delim = $('#delimiter').val();

		var results = Papa.unparse(input, {
			delimiter: delim
		});

		console.log("Unparse complete!");
		console.log("--------------------------------------");
		console.log(results);
		console.log("--------------------------------------");
	});

	$('#insert-tab').click(function()
	{
		$('#delimiter').val('\t');
	});
});

function setTable(data)
{
	var duplicates = [];
	var rawData = data[0];
	var header = d3.select("#resultTable")
		.append("thead")
		.append("tr");
		
	for(var i = 0; i<rawData.data[0].length; i++){
		header.append("th")
			.text(rawData.data[0][i]);
	}
	
	var tBody = d3.select("#resultTable")
		.append("tbody");
		
	for(var i = 1; i<rawData.data.length; i++){
		
		var tr = tBody.append("tr");
		for(var j = 0; j<rawData.data[i].length; j++){
			tr.append("td")
				.text(rawData.data[i][j]);
		}
	}
	
	//User Table
	var headerUsers = d3.select("#userTable")
		.append("thead")
		.append("tr")
		.append("th")
		.text(rawData.data[0][0]); 	//Users
		
	var tBodyUsers = d3.select("#userTable")
		.append("tbody");
		
	for(var i = 1; i<rawData.data.length; i++){
		var value = rawData.data[i][0];
		
		if(duplicates.length > 0 ){			
			if(!available(duplicates, value)){
				var tr = tBodyUsers.append("tr");
				tr.append("td")
					.text(rawData.data[i][0]);
					
				duplicates.push(rawData.data[i][0]);
			}
				
		}else{
			var tr = tBodyUsers.append("tr");
			tr.append("td")
				.text(rawData.data[i][0]);
				
			duplicates.push(rawData.data[i][0]);
		}
	}
	
	//Experiment Table
	var duplicates = [];
	var headerExp = d3.select("#experimentTable")
		.append("thead")
		.append("tr")
		.append("th")
		.text(rawData.data[0][1]);
		
	var tBodyExp = d3.select("#experimentTable")
		.append("tbody");
		
	for(var i = 1; i<rawData.data.length; i++){
		var value = rawData.data[i][1];
		
		if(duplicates.length > 0 ){			
			if(!available(duplicates, value)){
				var tr = tBodyExp.append("tr");
				tr.append("td")
					.text(rawData.data[i][1]);
					
				duplicates.push(rawData.data[i][1]);
			}
				
		}else{
			var tr = tBodyExp.append("tr");
			tr.append("td")
				.text(rawData.data[i][1]);
				
			duplicates.push(rawData.data[i][1]);
		}
	}
	
	//Trials Table
	var duplicates = [];
	var headerTrial = d3.select("#trialsTable")
		.append("thead")
		.append("tr")
		.append("th")
		.text(rawData.data[0][2]);
		
	var tBodyTrial = d3.select("#trialsTable")
		.append("tbody");
		
	for(var i = 1; i<rawData.data.length; i++){
		var value = rawData.data[i][2];
		
		if(duplicates.length > 0 ){			
			if(!available(duplicates, value)){
				var tr = tBodyTrial.append("tr");
				tr.append("td")
					.text(rawData.data[i][2]);
					
				duplicates.push(rawData.data[i][2]);
			}
				
		}else{
			var tr = tBodyTrial.append("tr");
			tr.append("td")
				.text(rawData.data[i][2]);
				
			duplicates.push(rawData.data[i][2]);
		}
	}
}

function available(array, value){
	for(var i = 0; i<array.length; i++){
		if(value === array[i])
			return true;
	}
	return false;
}

function buildConfig()
{
	return {
		delimiter: $('#delimiter').val(),
		newline: getLineEnding(),
		header: $('#header').prop('checked'),
		dynamicTyping: $('#dynamicTyping').prop('checked'),
		preview: parseInt($('#preview').val() || 0),
		step: $('#stream').prop('checked') ? stepFn : undefined,
		encoding: $('#encoding').val(),
		worker: $('#worker').prop('checked'),
		comments: $('#comments').val(),
		complete: completeFn,
		error: errorFn,
		download: $('#download').prop('checked'),
		fastMode: $('#fastmode').prop('checked'),
		skipEmptyLines: $('#skipEmptyLines').prop('checked'),
		chunk: $('#chunk').prop('checked') ? chunkFn : undefined,
		beforeFirstChunk: undefined,
	};

	function getLineEnding()
	{
		if ($('#newline-n').is(':checked'))
			return "\n";
		else if ($('#newline-r').is(':checked'))
			return "\r";
		else if ($('#newline-rn').is(':checked'))
			return "\r\n";
		else
			return "";
	}
}

function stepFn(results, parserHandle)
{
	stepped++;
	rows += results.data.length;

	parser = parserHandle;
	
	if (pauseChecked)
	{
		console.log(results, results.data[0]);
		parserHandle.pause();
		return;
	}
	
	if (printStepChecked)
		console.log(results, results.data[0]);
}

function chunkFn(results, streamer, file)
{
	if (!results)
		return;
	chunks++;
	rows += results.data.length;

	parser = streamer;

	if (printStepChecked)
		console.log("Chunk data:", results.data.length, results);

	if (pauseChecked)
	{
		console.log("Pausing; " + results.data.length + " rows in chunk; file:", file);
		streamer.pause();
		return;
	}
}

function errorFn(error, file)
{
	console.log("ERROR:", error, file);
}

function completeFn()
{
	end = performance.now();
	if (!$('#stream').prop('checked')
			&& !$('#chunk').prop('checked')
			&& arguments[0]
			&& arguments[0].data){
		rows = arguments[0].data.length;
		data = arguments;
	}
			
	console.log("Finished input (async). Time:", end-start, arguments);
	console.log("Rows:", rows, "Stepped:", stepped, "Chunks:", chunks);
}