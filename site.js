// ** VARIABLES DECLARATION **

// Country selection
var map_clicked = false;

// Enables zoom
var zoom = d3.behavior.zoom().scaleExtent([1, 100]).on("zoom", move);

// Main declarations
var topo,
    projection,
    path,
    svg_map,
    g,
    height_map,
    width_map,
    tooltip1,
    tooltip2,
    WSS_topo,
    WSS_data,
    lookup,
    lookup_reg,
    svg_chart;

// Colorscales
var quantize = {
	Wat: d3.scale.quantize()
    		.domain([0, 100])
    		.range(d3.range(9).map(function(i) { return "qw" + i + "-9"; })),
    San: d3.scale.quantize()
    		.domain([0, 100])
    		.range(d3.range(9).map(function(i) { return "qs" + i + "-9"; }))
    };   

// ** FUNCTIONS DECLARATION **
// *  General Functions      *

// Map setup
function setup(width, height) {
	projection = d3.geo.mercator()
		.translate([0, 50])
		.scale(width / 2 / Math.PI);
	path = d3.geo.path().projection(projection);
	svg_map = d3.select("#container").append("svg")
		.attr("width", width)
		.attr("height", height).append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.call(zoom);
	g = svg_map.append("g");
	
	console.log("l50");
}


// If window resized
function redraw() {
		d3.selectAll('.tooltip1').remove();
		d3.selectAll('svg').remove();
		reset();
	  	WSS_Data_firstdraw();
	}

// If window resized	
var throttleTimer;
function throttle() {
	window.clearTimeout(throttleTimer);
	throttleTimer = window.setTimeout(function() {
		redraw();
	}, 200);
}

// Enables pan	
function move() {
	
		var t = d3.event.translate;
		var s = d3.event.scale;
		var h = height_map / 3;
		
		console.log(t);
		console.log(s);
		console.log(h);
	
		t[0] = Math.min(width_map / 2 * (s - 1), Math.max(width_map / 2 * (1 - s), t[0]));
		t[1] = Math.min(height_map / 2 * (s - 1) + h * s, Math.max(height_map / 2 * (1 - s) - h * s, t[1]));
	
		zoom.translate(t);
		g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
		
		console.log("l87");
	}

// *  Animation Functions      *	

function autoAdvance(){
	var current_year = document.getElementById('year').innerHTML;
	if(2012>current_year){
		current_year=parseInt(current_year)+1;
		document.getElementById('year').innerHTML=current_year;
		WSS_Data_update();
	}
}

// *  Click-map Functions      *

function clicked(d) {
  document.getElementById('td_selected_name').innerHTML= d.properties.name;
  d3.select(this.parentNode.appendChild(this)).transition().duration(0);
  var resetid = false;
  if (active.node() === this){resetid = true;}
  updateLineChart(d.id, resetid);
  if (resetid) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
  active_id = d.id;
	}

function clicked_dot(d) {
  	document.getElementById('year').innerHTML= d.key.getFullYear();
  	updateLineChart(active_id, false);
	WSS_Data_update();
	}

function reset() {
	active.classed("active", false);
  	active = d3.select(null);
  	active_id = null;
  	document.getElementById('td_selected_name').innerHTML="Select a country or click the curves";
 	}  		

// *  Drawing-map Functions      *
	
// First draw general
function WSS_Data_firstdraw() 
	{
	// Map size adapted to the window
	width_map = document.getElementById('container').offsetWidth - 20;
	height_map = width_map*2 / 3;
	
	// Tooltip1
	tooltip1 = d3.select("#container").append("div").attr("class", "tooltip1 hidden");

	setup(width_map, height_map);
		
	// Data loading
	queue()
		.defer(d3.json, "data/world_topo.json")
		.defer(d3.csv, "data/world_data.csv")
		.await(WSS_Data_loading);
	}

// Actually drw the mal from loaded data
function WSS_Data_loading(error, world_topo, world_data) {
	
	WSS_topo = topojson.feature(world_topo, world_topo.objects.countries).features;
	var country = g.selectAll(".country").data(WSS_topo);
	WSS_data = world_data;
	
	lookup = {};
	lookup_reg = {};
	for (var i = 0, len = WSS_data.length; i < len; i++) {
		if (typeof lookup[WSS_data[i].ID] == "undefined") {
			lookup[WSS_data[i].ID] = {};
			};
		if (typeof lookup[WSS_data[i].ID[WSS_data[i].Year]] == "undefined") {
			lookup[WSS_data[i].ID][WSS_data[i].Year] = {};
			};	
	   // lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_U_t'] = parseFloat(WSS_data[i].Pop_U_t);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_U_p'] = parseFloat(WSS_data[i].Pop_U_p);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_R_t'] = parseFloat(WSS_data[i].Pop_R_t);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_R_p'] = parseFloat(WSS_data[i].Pop_R_p);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_N_t'] = parseFloat(WSS_data[i].Pop_N_t);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_U_t'] = parseFloat(WSS_data[i].Wat_U_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_U_p'] = parseFloat(WSS_data[i].Wat_U_p);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_R_t'] = parseFloat(WSS_data[i].Wat_R_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_R_p'] = parseFloat(WSS_data[i].Wat_R_p);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_N_t'] = parseFloat(WSS_data[i].Wat_N_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_N_p'] = parseFloat(WSS_data[i].Wat_N_p);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['San_U_t'] = parseFloat(WSS_data[i].San_U_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_U_p'] = parseFloat(WSS_data[i].San_U_p);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['San_R_t'] = parseFloat(WSS_data[i].San_R_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_R_p'] = parseFloat(WSS_data[i].San_R_p);
		// lookup[WSS_data[i].ID][WSS_data[i].Year]['San_N_t'] = parseFloat(WSS_data[i].San_N_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_N_p'] = parseFloat(WSS_data[i].San_N_p);
		};
	
	for (var i = 0, len = unicef_reg.length; i < len; i++) {
		lookup_reg[unicef_reg[i].id] = unicef_reg[i].reg;
	}
		var temp1;
		var year = 1990;
		var serie = 'Wat_N_p';
		
		country.enter().insert("path")
			.attr("class", "country")
			.attr("d", path)
			.attr("class", function(d, i) {
				if(typeof lookup[d.id] == "undefined" || lookup[d.id][year][serie] == -9999) {
					temp1 = "";
				} else {
					temp1 = quantize['Wat'](lookup[d.id][year][serie]);
				}
				return "country " + temp1; });
					
		//ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip1 offset off mouse
		var offsetL = document.getElementById('container').offsetLeft + (width_map / 2) + 40;
		var offsetT = document.getElementById('container').offsetTop + (height_map / 2) + 20;
	
		//tooltip1s
		country
			.on("mousemove", function(d, i) {
				var mouse = d3.mouse(svg_map.node()).map(function(d) { return parseInt(d); });
				var name = d.properties.name;
				var value;
				if(typeof lookup[d.id] == "undefined" || lookup[d.id][year][serie] == -9999) {
					value = "NA";
				} else {
					value = lookup[d.id][year][serie].toFixed(1) + "%";
				}
				tooltip1
					.classed("hidden", false)
					.attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
					.html(name + ": " + value);
				//return document.getElementById('name').innerHTML="";
				})
			.on("mouseout", function(d, i) {
				tooltip1
					.classed("hidden", true);
				//return document.getElementById('name').innerHTML="";
				})
			.on("click", clicked);
			
		var legdx=72.5;
		var legdy=150;
		var legx=-width_map/2+10;
		var legy=height_map/2-10-legdy;
		
		var h = svg_map.append("g");
			
		h.append("rect")
			.attr("x", legx)
			.attr("y", legy)
			.attr("width", legdx)
			.attr("height", legdy)
			.attr("class", "legend")
			.attr("opacity","0.5");

		h.append("text")
			.attr("x",legx+2.5)
			.attr("y",legy+2.5+10)
			.text("Access to")
			.attr("font-size","10px")
			.style("font-weight","bold");
		h.append("text")
			.attr("x",legx+2.5)
			.attr("y",legy+2.5+20)
			.text("water")
			.attr("font-size","10px")
			.style("font-weight","bold")
			.attr("id","txt_serie1");
		h.append("text")
			.attr("x",legx+2.5)
			.attr("y",legy+2.5+30)
			.text("% of the pop.")
			.attr("font-size","10px")
			.attr("id","txt_serie2");
		h.append("text")
			.attr("x",legx+2.5)
			.attr("y",legy+2.5+20)
			.text("")
			.attr("font-size","10px")
			.attr("id","txt_serie2");
		
		var ofsy1 = 26.5;
		var ofsx1 = 15;
		
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+20)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "8-9")
			.attr("class","qw8-9");
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+30)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "7-9")
			.attr("class","qw7-9");
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+40)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "6-9")
			.attr("class","qw6-9");
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+50)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "5-9")
			.attr("class","qw5-9");
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+60)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "4-9")
			.attr("class","qw4-9");
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+70)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "3-9")
			.attr("class","qw3-9");
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+80)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "2-9")
			.attr("class","qw2-9");
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+90)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "1-9")
			.attr("class","qw1-9");
		h.append("rect")
			.attr("x", legx+ofsx1)
			.attr("y", legy+ofsy1+100)
			.attr("width", 10)
			.attr("height", 10)
			.attr("id", "0-9")
			.attr("class","qw0-9");
		
		var ofsx2 = 30;
		var ofsy2 = 40;
			
		h.append("text")
			.attr("x",legx+ofsx2)
			.attr("y",legy+10+ofsy2)
			.text("100%")
			.attr("font-size","10px");
		h.append("text")
			.attr("x",legx+ofsx2)
			.attr("y",legy+10+22.5+ofsy2)
			.text("75%")
			.attr("font-size","10px");
		h.append("text")
			.attr("x",legx+ofsx2)
			.attr("y",legy+10+45+ofsy2)
			.text("50%")
			.attr("font-size","10px");
		h.append("text")
			.attr("x",legx+ofsx2)
			.attr("y",legy+10+67.5+ofsy2)
			.text("25%")
			.attr("font-size","10px");
		h.append("text")
			.attr("x",legx+ofsx2)
			.attr("y",legy+10+90+ofsy2)
			.text("0%")
			.attr("font-size","10px");
		
		generateLineChart();			
	}

// Update the map (animation)
function WSS_Data_update() 
	{
		d3.selectAll('.tooltip1').remove();
		// Tooltip1
		tooltip1 = d3.select("#container").append("div").attr("class", "tooltip1 hidden");
		var country = g.selectAll(".country");
		var temp;
		var serie = serie1 + "_" + serie2 + "_p";
		
		var year = document.getElementById('year').innerHTML;
	
		//ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip1 offset off mouse
		var offsetL = document.getElementById('container').offsetLeft + (width_map / 2) + 40;
		var offsetT = document.getElementById('container').offsetTop + (height_map / 2) + 20;
		
		country
			.attr("class", "country")
			.attr("d", path)
			.attr("class", function(d, i) {

				if(typeof lookup[d.id] == "undefined" || lookup[d.id][year][serie] == -9999 || (lookup_reg[d.id] !== focus && focus !== "GLO") ) {
					temp = "";
				} else {
					temp = quantize[serie1](lookup[d.id][year][serie]);
				}
				return "country " + temp; });
		
		//tooltip1s
		country
			.on("mousemove", function(d, i) {
				var mouse = d3.mouse(svg_map.node()).map(function(d) { return parseInt(d); });
				var name = d.properties.name;
				var value;
				if(typeof lookup[d.id] == "undefined" || lookup[d.id][year][serie] == -9999) {
					value = "NA";
				} else {
					value = lookup[d.id][year][serie].toFixed(1) + "%";
				}
				tooltip1
					.classed("hidden", false)
					.attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
					.html(name + ": " + value);
				//return document.getElementById('name').innerHTML="";
				})
			.on("mouseout", function(d, i) {
				tooltip1
					.classed("hidden", true);
				//return document.getElementById('name').innerHTML="";
			});
		
		switch(serie1){
			case "Wat":
				if($("#0-9").attr("class") !== "qw0-9"){
					$('#txt_serie1')[0].innerHTML = "water";
					$('#0-9').attr("class","qw0-9");
					$('#1-9').attr("class","qw1-9");
					$('#2-9').attr("class","qw2-9");
					$('#3-9').attr("class","qw3-9");
					$('#4-9').attr("class","qw4-9");
					$('#5-9').attr("class","qw5-9");
					$('#6-9').attr("class","qw6-9");
					$('#7-9').attr("class","qw7-9");
					$('#8-9').attr("class","qw8-9");
															
				}
				break;
			case "San":
				if($("#0-9").attr("class") !== "qs0-9"){
					$('#txt_serie1')[0].innerHTML = "sanitation";
					$('#0-9').attr("class","qs0-9");
					$('#1-9').attr("class","qs1-9");
					$('#2-9').attr("class","qs2-9");
					$('#3-9').attr("class","qs3-9");
					$('#4-9').attr("class","qs4-9");
					$('#5-9').attr("class","qs5-9");
					$('#6-9').attr("class","qs6-9");
					$('#7-9').attr("class","qs7-9");
					$('#8-9').attr("class","qs8-9");				
				}
				break;
			}
			switch(serie2){
				case "N":
					$('#txt_serie2')[0].innerHTML = "% of the pop.";
					break;
				case "U":
					$('#txt_serie2')[0].innerHTML = "% of urbans";
					break;
				case "R":
					$('#txt_serie2')[0].innerHTML = "% of rurals";
					break;
				}

		
		// Country active still have active class 	
		active.classed("active", true);		
		
		//Red dot
		
		var margin_chart = {top: 20, right: 20, bottom: 25, left: 55},
			width_chart = document.getElementById('line_total').offsetWidth *8/10,//$("#line_total").width() - margin.left - margin.right,
			height_chart = width_chart*5/12;//$("#line_total").height() - margin.top - margin.bottom;
			
		var x = d3.time.scale()
			.range([0, width_chart]);
		var y = d3.scale.linear()
			.range([height_chart, 0]);
			
		var xAxis = d3.svg.axis()
			.scale(x)
			.ticks(d3.time.years, 2)
			.tickFormat(d3.time.format("%y"))
			.orient("bottom");
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.ticks(4)
			.tickFormat(d3.format("%"))
			.orient("left");
			
		x.domain([new Date(first_year,0,1),new Date(end_year,0,1)]);
		y.domain([0,1]);
			
		var line = d3.svg.line()
			.defined(function(d) { return d.value != null; })
			.x(function(d) {
				return x(d.key);
			})
			.y(function(d) { return y(d.value); });
		
		svg_chart.selectAll(".dot_g_red")
			.remove();
		svg_chart.selectAll(".dot_c_red")
			.remove();
			
		var table_g_red = [{"key": new Date(year,0,1), "value": lookup[9999][year][serie]/100}];
		svg_chart.selectAll(".dot_g_red")
	    	.data(table_g_red.filter(function(d) { return d.value; }))
	  	.enter().append("circle")
		    .attr("class", "dot_g_red")
		    .attr("cx", line.x())
		    .attr("cy", line.y())
		    .attr("r", 1.75);
		
		var table_g_redl = [{"key": new Date(year,0,1), "value": 0},
						{"key": new Date(year,0,1), "value": lookup[9999][year][serie]/100}];
	
		d3.selectAll(".chart_line3")
			.datum(table_g_redl)
			.attr("d", line);
		
		if (active_id !== null) {
			var	table_c_red = [{"key": new Date(year,0,1), "value": lookup[active_id][year][serie]/100}];
			svg_chart.selectAll(".dot_c_red")
		    	.data(table_g_red.filter(function(d) { return d.value; }))
		  	.enter().append("circle")
			    .attr("class", "dot_c_red")
			    .attr("cx", line.x())
			    .attr("cy", line.y())
			    .attr("r", 1.75);
		};
		
		/*	svg_chart.selectAll(".dot_g_red")
			.remove();
		svg_chart.selectAll(".dot_c_red")
			.remove();
		
		svg_chart.selectAll(".dot_g_red")
	    	.data(table_g_red.filter(function(d) { return d.value; }))
	  	.enter().append("circle")
		    .attr("class", "dot_g_red")
		    .attr("cx", line.x())
		    .attr("cy", line.y())
		    .attr("r", 2.5);*/
	}

// *  Drawing-Chart Functions      *

// First Chart
function generateLineChart(){
	
	//tooltip2
	tooltip2 = d3.select("#line_total").append("div").attr("class", "tooltip2 hidden");
	
	var serie = serie1 + "_" + serie2 + "_p";
	var year = document.getElementById('year').innerHTML;
	var margin_chart = {top: 20, right: 20, bottom: 35, left: 55},
		width_chart = document.getElementById('line_total').offsetWidth *8/10,//$("#line_total").width() - margin.left - margin.right,
		height_chart = width_chart*5/12;//$("#line_total").height() - margin.top - margin.bottom;
		
	var x = d3.time.scale()
		.range([0, width_chart]);
	var y = d3.scale.linear()
		.range([height_chart, 0]);
		
	var xAxis = d3.svg.axis()
		.scale(x)
		.ticks(d3.time.years, 2)
		.tickFormat(d3.time.format("%y"))
		.orient("bottom");
		
	var yAxis = d3.svg.axis()
		.scale(y)
		.ticks(4)
		.tickFormat(d3.format("%"))
		.orient("left");
	
	var line = d3.svg.line()
		.defined(function(d) { return d.value != null; })
		.x(function(d) {
			return x(d.key);
		})
		.y(function(d) { return y(d.value); });
		
	
	// function for the y grid lines
	function make_y_axis() {
	  return d3.svg.axis()
		.scale(y)
		.ticks(4)
		.orient("left");
	}
	
	svg_chart = d3.select("#line_total").append("svg")
		.attr("width", width_chart + margin_chart.left + margin_chart.right)
		.attr("height", height_chart + margin_chart.top + margin_chart.bottom)
		.append("g")
		.attr("transform", "translate(" + margin_chart.left + "," + margin_chart.top + ")");	
	
	console.log("l602");
		
	x.domain([new Date(first_year,0,1),new Date(end_year,0,1)]);
	y.domain([0,1]);
	
	// Draw the y Grid lines
    svg_chart.append("g")            
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width_chart, 0, 0)
            .tickFormat("")
       		);
	
	svg_chart.append("g")
		.attr("class", "xaxis axis")
		.attr("transform", "translate(0," + height_chart + ")")
		.call(xAxis);
	svg_chart.append("g")
		.attr("class", "yaxis axis")
		.call(yAxis);
	
	console.log("l623");
	
	var g = svg_chart.append("g");
	g.append("text")
			.text("Years")
			.attr("x", width_chart/2 - 20)
			.attr("y", height_chart + margin_chart.bottom)
			.attr("font-size","12px")
			.style("font-weight","bold");;
	g.append("text")
		.attr("x", 40)
		.attr("y", height_chart - 60)
		.attr("dy", ".71em")
		.text("Global [g]");
	g.append("rect")
		.attr("x", 25)
		.attr("y", height_chart - 60)
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill","#ccc");
	g.append("text")
		.attr("x", 40)
		.attr("y", height_chart - 40)
		.attr("dy", ".71em")
		.text("Region [r]");
	g.append("rect")
		.attr("x", 25)
		.attr("y", height_chart - 40)
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", "#4c4c4c");
	g.append("text")
		.attr("x", 40)
		.attr("y", height_chart - 20)
		.attr("dy", ".71em")
		.text("Country [c]");
	g.append("rect")
		.attr("x", 25)
		.attr("y", height_chart - 20)
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", "orange");
	
	var table_global=[];
	
	for(var i = first_year, end = end_year; i < end+1; i++) {
		table_global.push({"key": new Date(i,0,1), "value": lookup["9999"][i][serie]/100});
	};
	
	svg_chart.append("path")
		.datum(table_global)
		.attr("class", "chart_line")
		.attr("d", line)
		.attr("fill","none")
		.attr("stroke","#ccc")
		.attr("stroke-width","2px");
	
	svg_chart.append("path")
		.datum(table_global)
		.attr("class", "chart_line4")
		.attr("d", line)
		.attr("fill","none")
		.attr("stroke","#4c4c4c")
		.attr("stroke-width","0px");
		
	svg_chart.append("path")
		.datum(table_global)
		.attr("class", "chart_line2")
		.attr("d", line)
		.attr("fill","none")
		.attr("stroke","orange")
		.attr("stroke-width","0px");
	
	//ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip2 offset off mouse
	var offsetL = 40;
	var offsetT = 40;
	
	svg_chart.selectAll(".dot-global")
    	.data(table_global.filter(function(d) { return d.value; }))
  	.enter().append("circle")
	    .attr("class", "dot-global")
	    .attr("cx", line.x())
	    .attr("cy", line.y())
	    .attr("r", 2.5)
	    .on("click", clicked_dot)
	    .on("mousemove", function(d) {
				var mouse = d3.mouse(svg_chart.node()).map(function(d) { return parseInt(d); });
				var value = d.value * 100;
				tooltip2
					.classed("hidden", false)
					.attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
					.html(value.toFixed(1) + "% [g]");
				})
		.on("mouseout", function(d) {
				tooltip2
					.classed("hidden", true);
			});
	    
	var table_g_red = [{"key": new Date(year,0,1), "value": lookup[9999][year][serie]/100}];
	svg_chart.selectAll(".dot_g_red")
    	.data(table_g_red.filter(function(d) { return d.value; }))
  	.enter().append("circle")
	    .attr("class", "dot_g_red")
	    .attr("cx", line.x())
	    .attr("cy", line.y())
	    .attr("r", 1.75);
	
	var table_g_redl = [{"key": new Date(year,0,1), "value": 0},
						{"key": new Date(year,0,1), "value": lookup[9999][year][serie]/100}];
	svg_chart.append("path")
		.datum(table_g_redl)
		.attr("class", "chart_line3")
		.attr("d", line)
		.attr("fill","none")
		.attr("stroke","red")
		.attr("stroke-width","0.5px");
}

// Update Chart
function updateLineChart(countryid,resetid){
	d3.selectAll('.tooltip2').remove();
		// Tooltip2
	tooltip2 = d3.select("#line_total").append("div").attr("class", "tooltip2 hidden");
		//ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip2 offset off mouse
	var offsetL = 40;
	var offsetT = 40;

	if(focus == "GLO"){
		d3.selectAll(".chart_line4")
			.attr("stroke-width","0px");
		svg_chart.selectAll(".dot-region")
		.remove();			
	}

	if(resetid){
		d3.selectAll(".chart_line2")
			.attr("stroke-width","0px");
		svg_chart.selectAll(".dot-country")
			.remove();
		svg_chart.selectAll(".dot_c_red")
			.remove();
	}else{
	var serie = serie1 + "_" + serie2 + "_p";
	var year = document.getElementById('year').innerHTML;	
		
	var margin_chart = {top: 20, right: 20, bottom: 25, left: 55},
		width_chart = document.getElementById('line_total').offsetWidth *8/10,//$("#line_total").width() - margin.left - margin.right,
		height_chart = width_chart*5/12;//$("#line_total").height() - margin.top - margin.bottom;
		
	var x = d3.time.scale()
		.range([0, width_chart]);
	var y = d3.scale.linear()
		.range([height_chart, 0]);
		
	var xAxis = d3.svg.axis()
		.scale(x)
		.ticks(d3.time.years, 2)
		.tickFormat(d3.time.format("%y"))
		.orient("bottom");
		
	var yAxis = d3.svg.axis()
		.scale(y)
		.ticks(4)
		.tickFormat(d3.format("%"))
		.orient("left");
		
	x.domain([new Date(first_year,0,1),new Date(end_year,0,1)]);
	y.domain([0,1]);
	
	var table_country=[];
	var table_global=[];
	var table_region=[];
	
	
	for(var i = first_year, end = end_year; i < end+1; i++) {
		if(countryid !== null){
			if(lookup[countryid][i][serie] !== -9999){
				table_country.push({"key": new Date(i,0,1), "value": lookup[countryid][i][serie]/100});
			}else{
				table_country.push({"key": new Date(i,0,1), "value": null});
			}
		}
		if(lookup[9999][i][serie] !== -9999){
			table_global.push({"key": new Date(i,0,1), "value": lookup[9999][i][serie]/100});
		}else{
			table_global.push({"key": new Date(i,0,1), "value": null});
		}
		if(focus !== "GLO"){
			if(lookup[focus_id][i][serie] !== -9999){
				table_region.push({"key": new Date(i,0,1), "value": lookup[focus_id][i][serie]/100});
			}else{
				table_region.push({"key": new Date(i,0,1), "value": null});
			}
		}
	};
		
	var line = d3.svg.line()
		.defined(function(d) { return d.value != null; })
		.x(function(d) {
			return x(d.key);
		})
		.y(function(d) { return y(d.value); });

	d3.selectAll(".yaxis")
		.call(yAxis);
	d3.selectAll(".xaxis")
		.call(xAxis);

	d3.selectAll(".chart_line")
		.datum(table_global)
		.attr("d", line);
		
	d3.selectAll(".chart_line4")
		.datum(table_region)
		.attr("d", line)
		.attr("stroke-width","2px");
			
	d3.selectAll(".chart_line2")
		.datum(table_country)
		.attr("d", line)
		.attr("stroke-width","2px");
	
	svg_chart.selectAll(".dot-global")
		.remove();
	svg_chart.selectAll(".dot-region")
		.remove();
	svg_chart.selectAll(".dot-country")
		.remove();
		
	svg_chart.selectAll(".dot-global")
    	.data(table_global.filter(function(d) { return d.value; }))
  	.enter().append("circle")
	    .attr("class", "dot-global")
	    .attr("cx", line.x())
	    .attr("cy", line.y())
	    .attr("r", 2.5)
	    .on("click", clicked_dot)
	    .on("mousemove", function(d) {
			var mouse = d3.mouse(svg_chart.node()).map(function(d) { return parseInt(d); });
			var value = d.value * 100;
			tooltip2
				.classed("hidden", false)
				.attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
				.html(value.toFixed(1) + "% [g]");
			})
		.on("mouseout", function(d) {
				tooltip2
					.classed("hidden", true);
			});

	svg_chart.selectAll(".dot-region")
    	.data(table_region.filter(function(d) { return d.value; }))
  	.enter().append("circle")
	    .attr("class", "dot-region")
	    .attr("cx", line.x())
	    .attr("cy", line.y())
	    .attr("r", 2.5)
   	    .on("click", clicked_dot)
	    .on("mousemove", function(d) {
			var mouse = d3.mouse(svg_chart.node()).map(function(d) { return parseInt(d); });
			var value = d.value * 100;
			tooltip2
				.classed("hidden", false)
				.attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
				.html(value.toFixed(1) + "% [r]");
			})
		.on("mouseout", function(d) {
				tooltip2
					.classed("hidden", true);
			});
	
	svg_chart.selectAll(".dot-country")
    	.data(table_country.filter(function(d) { return d.value; }))
  	.enter().append("circle")
	    .attr("class", "dot-country")
	    .attr("cx", line.x())
	    .attr("cy", line.y())
	    .attr("r", 2.5)
   	    .on("click", clicked_dot)
	    .on("mousemove", function(d) {
			var mouse = d3.mouse(svg_chart.node()).map(function(d) { return parseInt(d); });
			var value = d.value * 100;
			tooltip2
				.classed("hidden", false)
				.attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
				.html(value.toFixed(1) + "% [c]");
			})
		.on("mouseout", function(d) {
				tooltip2
					.classed("hidden", true);
			});
	    
	svg_chart.selectAll(".dot_g_red")
		.remove();
	svg_chart.selectAll(".dot_c_red")
		.remove();
			
	var table_g_red = [{"key": new Date(year,0,1), "value": lookup[9999][year][serie]/100}];
	svg_chart.selectAll(".dot_g_red")
    	.data(table_g_red.filter(function(d) { return d.value; }))
  	.enter().append("circle")
	    .attr("class", "dot_g_red")
	    .attr("cx", line.x())
	    .attr("cy", line.y())
	    .attr("r", 1.75);
	 
	var table_g_redl = [{"key": new Date(year,0,1), "value": 0},
						{"key": new Date(year,0,1), "value": lookup[9999][year][serie]/100}];
	
	d3.selectAll(".chart_line3")
		.datum(table_g_redl)
		.attr("d", line);
	
	if (active_id !== null) {
		var	table_c_red = [{"key": new Date(year,0,1), "value": lookup[active_id][year][serie]/100}];
		svg_chart.selectAll(".dot_c_red")
	    	.data(table_g_red.filter(function(d) { return d.value; }))
	  	.enter().append("circle")
		    .attr("class", "dot_c_red")
		    .attr("cx", line.x())
		    .attr("cy", line.y())
		    .attr("r", 1.75);
		};
	}
}


function zoom_focus() {

	var zoom_table = {
		"GLO": {"t": [0, 0],"s":  1,"h":height_map / 3},
		"IND": {"t": [-6, 52],"s":  1,"h":height_map / 3},
		"CEE": {"t": [-316, 259],"s":  4.5,"h":height_map / 3},
		"EAP": {"t": [-586, -13],"s":  2.75,"h":height_map / 3},
		"SA": {"t": [-660, -30],"s":  5,"h":height_map / 3},
		"MENA": {"t": [-183, -14],"s":  4.5,"h":height_map / 3},
		"ESA": {"t": [-195, -275],"s":  4,"h":height_map / 3},
		"WCA": {"t": [-54, -200],"s":  5.5,"h":height_map / 3},
		"LAC": {"t": [325, -180],"s":  2.25,"h":height_map / 3}
		};

	var t = zoom_table[focus].t;
	var s = zoom_table[focus].s;
	var h = zoom_table[focus].h;
	
	console.log(t);
	console.log(s);
	console.log(h);
	
	t[0] = Math.min(width_map / 2 * (s - 1), Math.max(width_map / 2 * (1 - s), t[0]));
	t[1] = Math.min(height_map / 2 * (s - 1) + h * s, Math.max(height_map / 2 * (1 - s) - h * s, t[1]));

	zoom.translate(t);
	g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
	
	console.log("l976");
}
