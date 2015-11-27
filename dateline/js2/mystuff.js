	function checkLoading(){
		if(!filesReady){
				window.setTimeout(checkLoading, 100);
			} else{
				initList();
		}
	}
	
	function initList(){
		var duplicatesExperiment = [];
		
		for(var i = 0; i < finalDataset.length; i++){
			//Experiments
			if(duplicatesExperiment.length > 0 ){			
				if(!available(duplicatesExperiment, finalDataset[i].experiment)){
					duplicatesExperiment.push(finalDataset[i].experiment);
					
					d3.select("#explist")
						.append("option")			
						.attr("value", finalDataset[i].experiment)
						.on("click", function(d) {
							fillTrialsList(this.value);
						})
						.text(finalDataset[i].experiment);
				}
			}else{						
				duplicatesExperiment.push(finalDataset[i].experiment);
				
				d3.select("#explist")
					.append("option")			
					.attr("value", finalDataset[i].experiment)
					.on("click", function(d) {
						fillTrialsList(this.value);
					})
					.text(finalDataset[i].experiment);							
			}
		}
	}
	
	function fillTrialsList(value){
		var duplicatesTrials = [];
		d3.select("#triallist").selectAll("option").remove();
		d3.select("#userlist").selectAll("option").remove();
		
		for(var i = 0; i < finalDataset.length; i++){
			if(finalDataset[i].experiment === value){
				if(duplicatesTrials.length > 0 ){			
					if(!available(duplicatesTrials, finalDataset[i].trial)){
						duplicatesTrials.push(finalDataset[i].trial);
						
						d3.select("#triallist")
							.append("option")			
							.attr("value", finalDataset[i].trial)
							.on("click", function(d) {
								fillUsersList(value, this.value);
							})
							.text(finalDataset[i].trial);
					}
				}else{						
					duplicatesTrials.push(finalDataset[i].trial);
					
					d3.select("#triallist")
						.append("option")			
						.attr("value", finalDataset[i].trial)
						.on("click", function(d) {
							fillUsersList(value, this.value);
						})
						.text(finalDataset[i].trial);							
				}
			}
		}
	}
	
	function fillUsersList(valueExp, valueTrial){
		var duplicatesUser = [];
		d3.select("#userlist").selectAll("option").remove();
		
		for(var i = 0; i < finalDataset.length; i++){
			if(finalDataset[i].experiment === valueExp && finalDataset[i].trial === valueTrial){
				if(duplicatesUser.length > 0 ){			
					if(!available(duplicatesUser, finalDataset[i].userName)){
						duplicatesUser.push(finalDataset[i].userName);
						
						d3.select("#userlist")
							.append("option")			
							.attr("value", finalDataset[i].userName)
							.text(finalDataset[i].userName);
					}
				}else{						
					duplicatesUser.push(finalDataset[i].userName);
					
					d3.select("#userlist")
						.append("option")			
						.attr("value", finalDataset[i].userName)
						.text(finalDataset[i].userName);							
				}
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
	
	function getIndexAOI(array, value){
		for(var i = 0; i < array.length; i++){
			if(array[i].aoi === value){
				return i;
			}
		}
		return -1;
	}
	
	
	function createGroup(name){	
		var outerDiv = d3.select("#multi")
			.append("div")
			.attr("data-force","30")
			.attr("id", "groupDiv-" + name)
			.attr("class", "layer title")
			.style("margin-left", "5px")
			.style("margin-right", "5px")
			.style("margin-top", "10px")
			.style("width", "37%");
		
		outerDiv.append("div")
			.attr("class", "tile__name")
			.attr("id", "groupBox" + name)
			.text("Group " + name)
			.style("font-size", "14pt");

		outerDiv.append("ul")
			.attr("id", "group" + name)
			.attr("class", "tile__name");

		var el = document.getElementById('group' + name);
		var editableList = Sortable.create(el, { group: "omega",
			filter: '.js-remove',
		  onFilter: function (evt) {
			var el = editableList.closest(evt.item); // get dragged item
			el && el.parentNode.removeChild(el);
		  }
		});
	}
	
	function getSelectedItems(select){
		var selectedItems = new Array();
		var trials = d3.select("#" + select).selectAll("option")
		for(var i = 0; i < trials[0].length; i++){
			if(trials[0][i].selected){
				selectedItems.push(trials[0][i].value);
			}
		}
		return selectedItems;
	}
	
	
	function getData(data){
		var nodes = [];
		var links = [];
		var duplicatesAOIs = [];
		var lastLink = -1;

		for(var i = 0; i < data.length; i++){
			var aoi = data[i].aoi;
			var aoiInt = parseInt(aoi.substring(3));
			var duration = parseFloat(data[i].duration);
			
			//links
			if(i > 0){
				var randomVal = Math.floor((Math.random() * 3) + 1); 
				links.push({
					"source" : lastLink,
					"target" : aoiInt,
					"value" : randomVal
				});
			}		
			lastLink = aoiInt;
			
			
			//nodes
			if(duplicatesAOIs.length > 0 ){					
				if(!available(duplicatesAOIs, aoiInt)){
					var randomImage;
					if(aoiInt < 40){
						randomImage = Math.floor((Math.random() * 10) + 1)  + ".png";
					} else{
						if(aoiInt === 40) randomImage = "sketch";
						if(aoiInt === 41) randomImage = "setting";
						if(aoiInt === 42) randomImage = "offscreen";
					}
					var randomGroup = Math.floor((Math.random() * 3) + 1); 
					var randomValue = Math.floor((Math.random() * 3) + 1); 
					nodes.push({
						"name" : randomImage,
						"aoi" : aoiInt,
						"group" : randomGroup,
						"value" : randomValue,
						"duration" : duration
					});
					duplicatesAOIs.push(aoiInt);
				}else{
					// aggregate duration
					var dupIndex = getIndexAOI(nodes, aoiInt);
					nodes[dupIndex].duration = parseFloat(nodes[dupIndex].duration) + duration;
				}
			}else{
				var randomImage = Math.floor((Math.random() * 10) + 1);
				var randomGroup = Math.floor((Math.random() * 3) + 1); 
				var randomValue = Math.floor((Math.random() * 3) + 1); 
				nodes.push({
					"name" : randomImage + ".png",
					"aoi" : aoiInt,
					"group" : randomGroup,
					"value" : randomValue,
					"duration" : duration
				});
				duplicatesAOIs.push(aoiInt);
			}
		}
		var newData = {
			"nodes" : nodes,
			"links" : links
		};
		return newData;
	}

	function filterData(startTime, endTime){
		var newData = [];
		for(var i = 0; i < finalDataset.length; i++){
			var dateTime = finalDataset[i].datetime;
			var date = dateTime.substring(0, dateTime.indexOf(" "));
			var time = dateTime.substring(date.length+1, dateTime.indexOf(":")); //lastIndexOf(":")

			if(startTime < parseInt(time) && parseInt(time) < endTime){
				newData.push(finalDataset[i]);
			}
		}

		//if(newData.length !== finalDataset.length){
			var filteredArcData = getData(newData);

			//update viz
			var groups = d3.select("#multi").node();
			for(var i = 0; i < groups.childElementCount; i++){
				groupID = groups.children[i].id;
				groupName = groupID.substring(9);

				var items = d3.select("#userlist").selectAll("option");
				for(var j = 0; j < items[0].length; j++) {
					if (items[0][j].selected) {
						$("#visDiv_" + groupName + "_" + j).empty();
						drawArcDiagram2(filteredArcData, "visDiv_" + groupName + "_" + j);
					}
				}
			}
		//}
		return newData;
	}
	
	