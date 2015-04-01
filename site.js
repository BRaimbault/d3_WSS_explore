var map_clicked = false;

// Enables zoom
var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", move);

// Main declarations
var topo,
    projection,
    path,
    svg,
    g,
    height,
    width,
    tooltip,
    WSS_topo,
    WSS_data,
    lookup;

// Colorscales
var quantize = {
	Wat: d3.scale.quantize()
    		.domain([0, 100])
    		.range(d3.range(9).map(function(i) { return "qw" + i + "-9"; })),
    San: d3.scale.quantize()
    		.domain([0, 100])
    		.range(d3.range(9).map(function(i) { return "qs" + i + "-9"; }))
    };   

// Map setup
function setup(width, height) {
	projection = d3.geo.mercator()
		.translate([0, 50])
		.scale(width / 2 / Math.PI);
	path = d3.geo.path().projection(projection);
	svg = d3.select("#container").append("svg")
		.attr("width", width)
		.attr("height", height).append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.call(zoom);
	g = svg.append("g");
}


// If window resized
function redraw() {
		width = document.getElementById('container').offsetWidth - 20;
		height = width / 2;
		d3.select('svg').remove();
		setup(width, height);
	  	draw(2012,'Wat_N_p');
	  	
	}

// Enables pan	
function move() {
	
		var t = d3.event.translate;
		var s = d3.event.scale;
		var h = height / 3;
	
		t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
		t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));
	
		zoom.translate(t);
		g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
	
	}	

// If window resized	
var throttleTimer;
function throttle() {
	window.clearTimeout(throttleTimer);
	throttleTimer = window.setTimeout(function() {
		redraw();
	}, 200);
}
	
// First draw general
function WSS_Data_firstdraw() 
	{
	
	// Map size adapted to the window
	width = document.getElementById('container').offsetWidth - 20;
	height = width*2 / 3;
	// Tooltip
	tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

	setup(width, height);
		
	// Data loading
	queue()
		.defer(d3.json, "data/world_topo.json")
		.defer(d3.csv, "data/world_data.csv")
		.await(WSS_Data_loading);
	
	}

function WSS_Data_update() 
	{
		var country = g.selectAll(".country");
		var temp;
		var serie = serie1 + "_" + serie2 + "_p";
		
		console.log(serie);
		
		var year = document.getElementById('year').innerHTML;
		
		
		country
			.attr("class", "country")
			.attr("d", path)
			.attr("class", function(d, i) {

				if(typeof lookup[d.id] == "undefined") {
					temp = "";
				} else {
					temp = quantize[serie1](lookup[d.id][year][serie]);
				}
				return "country " + temp; });		
	}

function WSS_Data_loading(error, world_topo, world_data) {
	
	WSS_topo = topojson.feature(world_topo, world_topo.objects.countries).features;
	var country = g.selectAll(".country").data(WSS_topo);
	WSS_data = world_data;
	
	lookup = {};
	for (var i = 0, len = WSS_data.length; i < len; i++) {
		if (typeof lookup[WSS_data[i].ID] == "undefined") {
			lookup[WSS_data[i].ID] = {};
			};
		if (typeof lookup[WSS_data[i].ID[WSS_data[i].Year]] == "undefined") {
			lookup[WSS_data[i].ID][WSS_data[i].Year] = {};
			};	
	    lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_U_t'] = parseFloat(WSS_data[i].Pop_U_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_U_p'] = parseFloat(WSS_data[i].Pop_U_p);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_R_t'] = parseFloat(WSS_data[i].Pop_R_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_R_p'] = parseFloat(WSS_data[i].Pop_R_p);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Pop_N_t'] = parseFloat(WSS_data[i].Pop_N_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_U_t'] = parseFloat(WSS_data[i].Wat_U_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_U_p'] = parseFloat(WSS_data[i].Wat_U_p);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_R_t'] = parseFloat(WSS_data[i].Wat_R_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_R_p'] = parseFloat(WSS_data[i].Wat_R_p);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_N_t'] = parseFloat(WSS_data[i].Wat_N_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['Wat_N_p'] = parseFloat(WSS_data[i].Wat_N_p);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_U_t'] = parseFloat(WSS_data[i].San_U_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_U_p'] = parseFloat(WSS_data[i].San_U_p);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_R_t'] = parseFloat(WSS_data[i].San_R_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_R_p'] = parseFloat(WSS_data[i].San_R_p);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_N_t'] = parseFloat(WSS_data[i].San_N_t);
		lookup[WSS_data[i].ID][WSS_data[i].Year]['San_N_p'] = parseFloat(WSS_data[i].San_N_p);
		};
		
		var temp;
		var year = 1990;
		var serie = 'Wat_N_p';
		
		country.enter().insert("path")
			.attr("class", "country")
			.attr("d", path)
			.attr("class", function(d, i) {

				if(typeof lookup[d.id] == "undefined") {
					temp = "";
				} else {
					temp = quantize['Wat'](lookup[d.id][year][serie]);
				}
				return "country " + temp; })
			.attr("title", function(d, i) {	return d.properties.name; });
	
		//ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip offset off mouse
		var offsetL = document.getElementById('container').offsetLeft + (width / 2) + 40;
		var offsetT = document.getElementById('container').offsetTop + (height / 2) + 20;
	
		//tooltips
		country
			.on("mousemove", function(d, i) {
				var mouse = d3.mouse(svg.node()).map(function(d) { return parseInt(d); });
				var name = d.properties.name;
				d3.select(this.parentNode.appendChild(this)).transition().duration(300);
				tooltip
					.classed("hidden", false)
					.attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
					.html(name);
				return document.getElementById('name').innerHTML="";
				})
			.on("mouseout", function(d, i) {
				tooltip
					.classed("hidden", true);
				return document.getElementById('name').innerHTML="";
			});
	}

/*function update_map(trans,year)  //animate changes to house prices in each district - not standard D3 (see comment below *)
{
    year++;
    if (year <= end_year) 
    { 
	trans.transition()
	    .duration(time_conversion)
	    .delay(start_delay+(year-anim_start_year)*time_conversion) 
	    .attr('fill',function()  { return polygon_color(this,year); }) //change colour of each polygon according to new average hosue price
	    .ease('linear')
	.call(update_map,year);
    }
}*/

function autoAdvance(){
	var current_year = document.getElementById('year').innerHTML;
	console.log(current_year);
	current_year=parseInt(current_year)+1;
	console.log(current_year);
	if(2013>current_year){
		document.getElementById('year').innerHTML=current_year;
		console.log(current_year);
		WSS_Data_update();
	}
}
