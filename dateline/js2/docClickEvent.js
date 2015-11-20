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
			'<div id="groupWidget' + groupName + '"></div></li>', 16, 20, 10, 1]
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
						.text(items[0][i].value);

				}else{
					tabDiv.append("a")
						.attr("href", "#")
						.attr("data-tab", i+6)
						.attr("class", "tab") //login-window btn btn-default btn-md
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
					//var arcData = getData();
					//drawArcDiagram2(arcData, "visDiv_"+ groupName + "_" + i);
					//isFirst = false;

				}
				else {
					var newVisDiv = tabDiv.append("div")
                        .attr("class", "content")
                        .attr("id", "visDiv_"+ groupName + "_" + i)
                        .attr("data-content", i+6);
				}
			}
		}

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
