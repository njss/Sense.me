	$(document).ready(function() {

		$('a.login-window').click(function() {
			
			// Getting the variable's value from a link 
			var loginBox = $(this).attr('href');

			//Fade in the Popup and add close button
			$(loginBox).fadeIn(300);
			
			//Set the center alignment padding + border
			var popMargTop = ($(loginBox).height() + 24) / 2; 
			var popMargLeft = ($(loginBox).width() + 24) / 2; 
			
			$(loginBox).css({ 
				'margin-top' : -popMargTop,
				'margin-left' : -popMargLeft
			});
			
			// Add the mask to body
			$('body').append('<div id="mask"></div>');
			$('#mask').fadeIn(300);
			
			return false;
		});
		
		// When clicking on the button close or the mask layer the popup closed 
		$(document).on('click', 'a.close, #mask', function() {
            $('#mask , .login-popup').fadeOut(300 , function() {
                $('#mask').remove();
            });
		    return false;
		});
	});
	
	$('#btnSubmitItem').click(function(){
		var groupName = groupname.value;
		
		createGroup(groupName);
		var selectedExp = getSelectedItems("explist");
		var selectedTrial = getSelectedItems("triallist");
		var selectedUser = getSelectedItems("userlist");

		//gridster.add_widget('<li > <header>Group ' + groupName +
		//								'</header> <br> ' + selectedExp[0] + ' - ' + selectedTrial[0] +
		//								'<div id="groupWidget' + groupName + '"></li>', 16, 20, 10, 1);

		var widgets = [
			['<li> <header>Group ' + groupName +
			'</header> <br> ' + selectedExp[0] + ' - ' + selectedTrial[0] +
			'<div id="groupWidget' + groupName + '"></div></li>', 13, 20, 4, 10]
		];

		$.each(widgets, function(i, widget) {
			gridster.add_widget.apply(gridster, widget);
		});

		var newWidget = d3.select("#groupWidget" + groupName);
		var tabDiv = newWidget.append("div")
			.attr("class", "tabswrapper")
			.append("div")
			.attr("class", "tabsmain")
			.append("div")
			.attr("class", "tabs");

		var items = d3.select("#userlist").selectAll("option");
		for(var i = 0; i < items[0].length; i++){
			if(items[0][i].selected){
				var ulItem = d3.select("#group" + groupName)
					.style("width", "70%")
					.style("margin", "auto");
					
				ulItem.append("li")
					.style("color", "black")
					.style("padding-left", "5px")
					.style("padding-right", "5px")
					.style("text-align", "center")
					.style("display", "block")
					.append("span")
					.attr("class", "display")
					.text(items[0][i].value)
					.style("color", "black")
					.append("i")
					.attr("class", "js-remove")
					.style("color", "red")
					.style("float", "right")
					.text("X");
				
				if(i === 0){
					tabDiv.append("a")
						.attr("href", "#")
						.attr("data-tab", i+6)
						.attr("class", "tab active") //login-window btn btn-default btn-md
						//.on("click", function (d, i) {
						//	myClickHandler(this);
						//})
						.text(items[0][i].value);

				}else{
					tabDiv.append("a")
						.attr("href", "#")
						.attr("data-tab", i+6)
						.attr("class", "tab") //login-window btn btn-default btn-md
						//.on("click", function (d, i) {
						//	myClickHandler(this);
						//})
						.text(items[0][i].value);
				}
			}
		}

		// content below links!
		var isFirst = true;
		for(var i = 0; i < items[0].length; i++){
			if(items[0][i].selected) {
				if (isFirst) {
					var newVisDiv = tabDiv.append("div")
                        .attr("class", "content active")
                        .attr("id", "visDiv_"+ groupName + "_" + i)
                        .attr("data-content", i+6);
					var arcData = getData(finalDataset);
					drawArcDiagram2(arcData, "visDiv_"+ groupName + "_" + i);
					isFirst = false;
				}
				else {
					var newVisDiv = tabDiv.append("div")
						.attr("data-content", i+6)
                        .attr("class", "content")
                        .attr("id", "visDiv_"+ groupName + "_" + i);
					var arcData = getData(finalDataset);
					drawArcDiagram2(arcData, "visDiv_"+ groupName + "_" + i);
				}
			}
		}

		var widgets2 = [
			['<li> <header>Group ' + groupName + ' Overview' +
			'</header> <br> ' + selectedExp[0] + ' - ' + selectedTrial[0] +
			'<div id="groupWidget' + groupName + '_overview"></div></li>', 13, 8, 4, 11]
		];

		$.each(widgets2, function(i, widget) {
			gridster.add_widget.apply(gridster, widget);
		});

		var widget2 = d3.select("#groupWidget" + groupName + "_overview");
		var chartDiv2 = widget2.append("div")
				.attr("class", "wrapper")
				.append("div")
				.attr("class", "groupChart");

		chartDiv2.append("svg")
				.attr("id", "svgMatch2")
				.style("width", "600px")
				.style("height", "410px")
				.append("defs")
				.append("marker")
				.attr("id", "Triangle2")
				.attr("viewBox", "0 0 10 10")
				.attr("refX", "0")
				.attr("refY", "5")
				.attr("markerUnits", "strokeWidth")
				.attr("markerWidth", "4")
				.attr("markerHeight", "3")
				.attr("orient", "auto")
				.append("path")
				.attr("d", "M 0 0 L 10 5 L 0 10 z")
				.style("fill", "#000000");

		var checkbox = chartDiv2.append("div")
				.attr("id", "divCheckbox")
				.attr("class", "radio-div");

		checkbox.append("input")
				.attr("type", "checkbox")
				.attr("id", "check1");
		checkbox.append("label")
				.attr("for", "check1")
				.text("In");

		checkbox.append("input")
				.attr("type", "checkbox")
				.attr("id", "check2");
		checkbox.append("label")
				.attr("for", "check2")
				.text("Out");

		$(function() {
			//$( "#check1" ).button();
			//$( "#check2" ).button();
			$("#divCheckbox").buttonset();
		});


		var groupVisData = getData(finalDataset);
		drawGroupChart("groupChart", groupVisData);
		//d3.json('data/playergrid.json', function(err, data) {
		//	aoiPosData2 = data;
		//	if(!--remaining2) drawGroupChart("groupChart");
		//});
		//d3.json('data/matches.json', function(err, data) {
		//	matchData2 = data;
		//	if(!--remaining2) drawGroupChart("groupChart");
		//});

		$("#popupClose").click();
		$(function () {
			$('[data-tab]').on('click', function (e) {
				$(this)
						.addClass('active')
						.siblings('[data-tab]')
						.removeClass('active')
						.siblings('[data-content=' + $(this).data('tab') + ']')
						.addClass('active')
						.siblings('[data-content]')
						.removeClass('active');
				e.preventDefault();
			});
		});

		var select = d3.select(slcGroupToDelete);
		var optionSelect = select.node();
		if(optionSelect.childElementCount > 0 && optionSelect[0].value === "---"){
			optionSelect[0].remove();
		}

		select.append("option")
			.attr("value", groupName)
			.text(groupName);

        groupname.value = "";

		<!-- var visHeight = d3.select("#svgArc_visDiv0").node().style.height; -->
		<!-- var heightIndex = visHeight / 50; -->
		<!-- d3.select("#li_" + groupName).attr("data-sizey", ); -->

	});

	$("#btnDeleteGroup").click(function(){
        var e = document.getElementById("slcGroupToDelete");
        var groupName = e.options[e.selectedIndex].value;
        
        if(groupName !== "---"){
            //delete option
		    e.options[e.selectedIndex].remove()

            //delete group
			document.getElementById("groupDiv-" + groupName).remove();

            //delete widget
            var widgets = $('.gridster li');
            var rmIndex = -1;
            for(var i = 0; i < widgets.length; i++){
                if(widgets[i].id === ("li_" + groupName)){
                    rmIndex = i;
                }
            }
            gridster.remove_widget($('.gridster li').eq(rmIndex) );
        }
	});

	var dateSteps = [
		"05.11.2015",
		"06.11.2015",
		"07.11.2015",
		"08.11.2015",
		"09.11.2015",
		"10.11.2015",
		"11.11.2015",
		"12.11.2015",
		"13.11.2015",
		"14.11.2015",
		"15.11.2015",
		"16.11.2015",
		"17.11.2015",
		"18.11.2015",
		"19.11.2015",
		"20.11.2015"
	];

	$(function() {
		$( "#dateSlider" ).slider({
			range: true,
			min: 0,
			max: 15,
			values: [0, 15],
			slide: function( event, ui ) {
				$( "#valueDate" ).text(dateSteps[ui.values[0]] + " - " + dateSteps[ui.values[1]] );
			}
		});
	});

	var timeSteps = [
		"00",
		"01",
		"02",
		"03",
		"04",
		"05",
		"06",
		"07",
		"08",
		"09",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
		"20",
		"21",
		"22",
		"23",
		"24"
	];

	$(function() {
		$( "#timeSlider" ).slider({
			range: true,
			min: 0,
			max: 23,
			values: [0, 23],
			slide: function( event, ui ) {
				$( "#valueTime" ).text(timeSteps[ui.values[0]] + ":00 - " + timeSteps[ui.values[1]] +":00");
				filterData(parseInt(timeSteps[ui.values[0]]), parseInt(timeSteps[ui.values[1]]));
			}
		});
	});

	//function myClickHandler(e) {
	//	var groupName = e.offsetParent.parentNode.id;
	//	groupName = groupName.substring(11);	//groupWidget_
	//	var index = parseInt(e.text.substring(4));		//user_
	//	index = index-1;
    //
	//	var element = document.getElementById('gArc_visDiv_' + groupName + '_' + index);
	//	var divHeight = element.getBoundingClientRect().height + 30;
	//	d3.select("#svgArc_visDiv_"  + groupName + '_' + index).node().style.height = divHeight;
	//}
