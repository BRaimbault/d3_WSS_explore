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
function WSS_Data_firstdraw(serie1,serie2,time_conversion,year) 
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

function WSS_Data_update(serie1,serie2,speed,year) 
	{
		var country = g.selectAll(".country");
		console.log(country);

		var temp;
		var serie = serie1 + "_" + serie2 + "_p";
		
		console.log(serie);
		
		year++;
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
				
			    year++;
			    
	    if (year <= end_year) 
	    { 
	//	country
	//		.transition()
	//	    .delay(1000) 
	//		.call(WSS_Data_update(serie1,serie2,speed,year));
	    }
		
	}

function WSS_Data_loading(error, world_topo, world_data) {
	
	WSS_topo = topojson.feature(world_topo, world_topo.objects.countries).features;
	var country = g.selectAll(".country").data(WSS_topo);
	WSS_data = world_data;
	
	console.log(speed);
	
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
	
	    //key constants 
	    var anim_start_year = 1990;
	    var end_year = 2012;
	    var year=anim_start_year;
	    //var base=100; //base for logarithmic conversions
	    //var start_delay = resuming? 0 : 1000;
	
	    //some features of time series to be calculated
	    var max_ts = -1;
	    var min_ts = 10000000000;
	
	
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
				return document.getElementById('name').innerHTML=name;
				})
			.on("mouseout", function(d, i) {
				tooltip
					.classed("hidden", true);
				return document.getElementById('name').innerHTML="";
			})
			.transition()
	    	.duration(100)
	    	.delay(100)
	    	.call(WSS_Data_update(serie1, serie2, speed, year));
	}

function update_map(trans,year)  //animate changes to house prices in each district - not standard D3 (see comment below *)
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
}


// First draw the map
function WSS_Data_draw(year,serie) {			
	}



/* function WSS_Data(option,time_conversion,start_year)  //time_conversion is no. milliseconds for 1 year
{
    var map_clicked = false;
   
   function update_WSS_table(year)
    {
	$('#td_WSS_price').text(number_format(WSS_data[year].price,0));
	var ts_unit = (option === 'earnings' || option === 'index')? 'x' : '';
	
	if (options[option].insert_ts) 
	{
	    var second_arg =  (option === 'earnings')? deflate(EW_data[year].earnings*52,year) : EW_data[1995].price;
	    $('#td_EW_ts_datum').text(number_format(options[option].set_ts_data(EW_data[year].price,second_arg),options[option].decimal_places)+ts_unit);
	}
	if (year > data_start_year) {$('#td_EW_RoC').text(number_format(options['RoC'].set_ts_data(EW_data[year].price,EW_data[year-1].price,year),1)+'%');}
    }

    //parameters and functions for different display options
    var options = 
	{
	    nominal: {
		title: 'England and Wales mean property prices by district, at nominal prices, 1995-2014',
		droplist_string: 'Nominal prices',
		min_start_year:1995,
		add_data_text: '',
		end_year:2014,
		adjust_price_data: function(x) {return parseFloat(x);},  //adjustments that need to be made to price data, e.g. for inflation
		set_ts_data: function(x) {return x;}, //the actual time series data to be displayed
		display_ts_data: function(x,base) {return log(x,base);}, //adjustments that need to be made for displaying data, e.g. using logarithmic scale 
		ticks: function(min_ts,max_ts) {return [min_ts,50000,100000,150000,200000,300000,500000,750000,1000000,max_ts].reverse();}, //ticks for key axis
		key_scale: function(range,domain,base) {return d3.scale.log().base(base).range(range).domain(domain);}, //scale for key axis
		key_labels: ['£','(logarithmic scale)'], //labels for the key
		decimal_places: 0, //decimal places for displaying values
		insert_ts: undefined   //name of time series to be inserted in table, if not already displayed by default
	    },
	    current: {
		title: 'England and Wales mean property prices by district, at current prices, 1995-2014',
		droplist_string: 'Current prices',
		add_data_text: "Adjusted for inflation using the Office for National Statistics' <a href='http://www.ons.gov.uk/ons/datasets-and-tables/data-selector.html?cdid=CDKO&dataset=mm23&table-id=3.6'>Consumer Prices Index</a>.",
		min_start_year:1995,
		end_year:2014,
		adjust_price_data: function(x,year) {return deflate(parseFloat(x),year);}, //adjust for inflation
		set_ts_data: function(x) {return x;},
		display_ts_data: function(x,base) { return log(x,base);}, 
		ticks: function(min_ts,max_ts) {return [min_ts,75000,100000,150000,200000,300000,500000,750000,1000000,max_ts].reverse();},
		key_scale: function(range,domain,base) {return d3.scale.log().base(base).range(range).domain(domain);},
		key_labels: ['2014 £','(logarithmic scale)'],
		decimal_places: 0,
		insert_ts: undefined
	    },
	    index: {
		title: 'England and Wales mean property prices by district 1995-2014, as a multiple of 1995 values',
		droplist_string: 'Compared with 1995',
		add_data_text: "Adjusted for inflation using the Office for National Statistics' <a href='http://www.ons.gov.uk/ons/datasets-and-tables/data-selector.html?cdid=CDKO&dataset=mm23&table-id=3.6'>Consumer Prices Index</a>.",
		min_start_year:1995,
		end_year:2014,
		adjust_price_data: function(x,year) {return deflate(parseFloat(x),year);}, //adjust for inflation
		set_ts_data: function(x,x_1995) {return x/x_1995;},
		display_ts_data: function(x) { return x;}, 
		ticks: function(min_ts,max_ts) {return [min_ts,1,2,3,max_ts].reverse();},
		key_scale: function(range,domain,base) {return d3.scale.linear().range(range).domain(domain);},
		key_labels: ['times 1995 level','(in real terms)'],
		decimal_places: 1,
		insert_ts: 'Multiple of 1995 value'
	    },
	    RoC: {
		title: 'Mean annual percentage increase in England and Wales property prices by district, 1996-2014',
		droplist_string: 'Annual percentage increase',
		add_data_text: "Adjusted for inflation using the Office for National Statistics' <a href='http://www.ons.gov.uk/ons/datasets-and-tables/data-selector.html?cdid=CDKO&dataset=mm23&table-id=3.6'>Consumer Prices Index</a>.",
		min_start_year:1996,
		end_year:2014,
		adjust_price_data: function(x,year) {return deflate(parseFloat(x),year);}, //adjust for inflation
		set_ts_data: function(x,x_m1,year) {return (year < data_start_year)? undefined : 100*(x-x_m1)/x_m1;},
		display_ts_data: function(x) {return x;}, 
		ticks: function(min_ts,max_ts) {return [min_ts,-20,0,20,max_ts].reverse();},
		key_scale: function(range,domain,base) {return d3.scale.linear().range(range).domain(domain);},
		key_labels: ['% annual increase','(in real terms)'],
		decimal_places: 1,
		insert_ts: undefined
	    },
	    earnings: {
		title: 'England and Wales mean property prices by district, as a multiple of mean local annual full-time earnings, 1997-2014',
		droplist_string: 'Compared with local earnings',
		add_data_text: "Adjusted for inflation using the Office for National Statistics' <a href='http://www.ons.gov.uk/ons/datasets-and-tables/data-selector.html?cdid=CDKO&dataset=mm23&table-id=3.6'>Consumer Prices Index</a>. Earnings figures from ONS <a href='http://www.ons.gov.uk/ons/rel/ashe/annual-survey-of-hours-and-earnings/index.html'>Annual Survey of Hours and Earnings</a>, Table 7, according to where employees <i>work</i> rather than reside. They reflect average full-time earnings for employees, as distinct from average income (which would encompass benefits, part-time earnings, self-employment and investment income).",
		min_start_year:1997,
		end_year:2014,
		adjust_price_data: function(x,year) {return deflate(parseFloat(x),year);}, //adjust for inflation
		set_ts_data: function(x,income) {return x/income;},
		display_ts_data: function(x) {return log(x,base);}, 
		ticks: function(min_ts,max_ts) {return [min_ts,2.5,5,7.5,10,20,max_ts].reverse();},
		key_scale: function(range,domain,base) {return d3.scale.log().base(base).range(range).domain(domain);},
		key_labels: ['Multiple of local earnings','(logarithmic scale)'],
		decimal_places: 1,
		insert_ts: 'Times mean FT earnings'
	    }
	};

    //manipulating elements already on HTML page
    var svg = d3.select('#displaybox');
    var svg_width = svg.attr('width');
    var tm_labelg = svg.append('g').attr('transform','translate('+(svg_width*0.85)+','+16+')').attr('class','rm_on_relaunch');	//labels and keys
    var keyg = svg.append('g').attr('transform','translate(0,'+0+')').attr('class','rm_on_relaunch');

    var selected_country;
    if ($('.selected_country').length === 1) 
    {
	selected_country = $('.selected_country').attr('id').replace('pgon','');
	map_clicked = true;
    }
    var resuming = $('#tm_label').length === 1;

    $('polygon').attr('class','anim_element').css('stroke-width',0.2); //this is placed here rather than with the D3 to resolve some user interaction sequence errors
    if (resuming && map_clicked) {$('#pgon'+selected_district).attr('class','anim_element selected_district').css('stroke-width',2);}
    $("#title").html(options[option].title);
    $("#add_data_text").html('');
    $("#add_data_text").html(options[option].add_data_text);
    $("option").remove();
    for (var op in options) {$("#select_series").append("<option value="+op+" "+(op === option? "selected" : "")+">"+options[op].droplist_string+"</option>")}
 
    //add option-dependent text to HTML page
    if (options[option].insert_ts) 
    {
	$('.time_series_name').text(options[option].insert_ts);
	if (option === 'earnings') {$('#td_EW_ts_name').text($('#td_EW_ts_name').text().replace(' local',''));}
    }

    //key constants 
    var data_start_year = 1995;
    var anim_start_year = start_year? (start_year > options[option].min_start_year? start_year : options[option].min_start_year) : options[option].min_start_year;
    var end_year = options[option].end_year;
    var base=100; //base for logarithmic conversions
    var start_delay = resuming? 0 : 1000;

    //some features of time series to be calculated
    var max_ts = -1;
    var min_ts = 10000000000;

    //some national data external to the CSV file
    var EW_data = {'1995':{price:68719,earnings:undefined},'1996':{price:72337,earnings:undefined},'1997':{price:79153,earnings:377.0},'1998':{price:85688,earnings:397.3},'1999':{price:96067,earnings:412.3},'2000':{price:107321,earnings:430.4},'2001':{price:118726,earnings:455.7},'2002':{price:137806,earnings:478.2},'2003':{price:155444,earnings:493.4},'2004':{price:178138,earnings:513.1},'2005':{price:189021,earnings:522.2},'2006':{price:203129,earnings:540.5},'2007':{price:218965,earnings:556.4},'2008':{price:216415,earnings:582.4},'2009':{price:212773,earnings:592.9},'2010':{price:235491,earnings:604.0},'2011':{price:231953,earnings:608.5},'2012':{price:237609,earnings:612.5},'2013':{price:246957,earnings:624.8},'2014':{price:258322,earnings:625.0}}; //England & Wales national average house prices for each year in nominal terms
    for (var y=data_start_year;y<=end_year;y++) { EW_data[y].price = options[option].adjust_price_data(EW_data[y].price,y); }
    update_EW_table(anim_start_year);

    d3.csv("House_Price_Summary.csv", function(d) { //read in csv file
	if (!d.name.match(/Scilly/))
	{
	    var record = {
		code: d.code, //district code
		name: d.name  //district name
	    };
	    for (var y=data_start_year;y<=end_year;y++) 	
	    { 
		record['price_'+y.toString()] = options[option].adjust_price_data(d['price_'+y.toString()],y);  //average house price for district and year, adjusted for inflation or not
		var second_arg =  (option === 'earnings')? deflate(d['weekly_earnings_'+y.toString()]*52,y) : record['price_'+((option === 'RoC')? y-1 : 1995).toString()];
		record[y] = options[option].set_ts_data(record['price_'+y.toString()],second_arg,y); //time series data point required for district and year, which may not be same as price (e.g., proportion of properties which are affordable)
		max_ts = (record[y] > max_ts)? record[y] : max_ts;  //find maximum value
		min_ts = (record[y] < min_ts)? record[y] : min_ts;  //find minimum value
	    } 
	}
	return record;

    }, function(error, rows) {

	//subfunctions needed in this block
	function polygon_color(poly,year)  //determine colour for polygon
	{
	    var id = $(poly).attr('id'); 
	    var code = id.replace('pgon',''); 
	    var data_exists = data[code] !== undefined; 
	    var ts_datum = (id.match(/E|W/) && data_exists)? data[code][year] : 0; 
	    return (ts_datum === 0)? 'none' : color_scale(options[option].display_ts_data(ts_datum,base));
	}

	function update_map(trans,year)  //animate changes to house prices in each district - not standard D3 (see comment below *)
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
	}

	function update_district_table(code,year) //update table giving stats for selected district
	{
	    $('#td_selected_name').text(data[code].name.replace(/_/g,' ')); 
	    $('#td_selected_price').text(number_format(data[code]['price_'+year.toString()],0));
	    var ts_unit = (option === 'earnings' || option === 'index')? 'x' : '';
	    if (options[option].insert_ts) {$('#td_selected_ts_datum').text(number_format(data[code][year],options[option].decimal_places).toString()+ts_unit);}
	    if (year > data_start_year) {$('#td_selected_RoC').text(number_format(options['RoC'].set_ts_data(data[code]['price_'+year.toString()],data[code]['price_'+(year-1).toString()],year),1)+'%');}
	}

	var data = {};  //main data: using this rather than rows because want an associative array
	for (var i=0;i<rows.length;i++)  //fill data and get maximum and minimum time series data observed
	{
	    data[rows[i].code] = {name: rows[i].name};  
	    for (var y=data_start_year;y<=end_year;y++) 
	    {
		data[rows[i].code]['price_'+y.toString()] = rows[i]['price_'+y.toString()];  //average house price for given district and year
		data[rows[i].code][y] = rows[i][y];  //time series data for given district and year
	    }
	}
	rows=[];
				         
	//define colour scale
	var Ncolors = $('stop').length;  //no. colours for key defined in SVG gradient map key (see HTML file)
	var domain = [];
	var colors = [];
	var display_max_ts = options[option].display_ts_data(max_ts,base);  //if using a logarithmic scale or other conversion, the max and min used for the display will be different to the underlying data
	var display_min_ts = options[option].display_ts_data(min_ts,base);
	for (var nc=0;nc<Ncolors;nc++) 
	{
	    domain[nc] = display_min_ts + (nc/(Ncolors-1))*(display_max_ts-display_min_ts);  
	    $('#offset'+(nc+1).toString()).attr('offset',(domain[nc]-display_min_ts)/(display_max_ts-display_min_ts)); //settings for svg gradient in HTML file
	    colors[nc] = $('#offset'+(nc+1).toString()).css('stop-color'); //colours to use are defined in HTML file
	}
	var color_scale = d3.scale.linear()
	    .domain(domain)
	    .range(colors.reverse());

	//fill and animate polygons  * NOTE * This is a non-standard way of using D3, I am aware of this. This is due to difficulty converting my initial shape file to topojson, which is why my geographical areas are defined as SVG polygons in the HTML file 
	var year=anim_start_year;
	var nation = svg.selectAll("polygon") 
	    .attr('fill',function()  { var id = $(this).attr('id'); return polygon_color(this,anim_start_year); }) //initial fill
	    .on('mousedown',function() {  
		$('.selected_district').css('stroke-width',0.2).attr('class','anim_element');     //change polygon and previously highlighted polygons
		$(this).css('stroke-width',2).attr('class','anim_element selected_district'); //adding class and styline class in .css file doesn't seem to work

		var id = $(this).attr('id');
		var code = id.replace('pgon','');
		var current_year = $('#tm_label').text(); //year currently being displayed when click happens

		update_district_table(code,current_year);  //put district-specific stats in table when district is clicked on

		selected_district = code;
		map_clicked = true;
	    })
	    .transition()
	    .duration(100)
	    .delay(100)
	    .call(update_map,year);


	//**************UPDATING TEXT WITH TIME****************
	tm_labelg.append('text')
	    .attr('id','tm_label')
	    .attr('class','anim_element textEW')
	    .text(function() {return resuming? '' : anim_start_year;})
	    .attr('x',0)
	    .attr('y',0)
	    .style('fill','grey')
//	    .style('font-size','12px')
	    .data(d3.range(anim_start_year,(end_year+1),1))
	    .enter()
	    .append('text')
	    .attr('class','anim_element textEW')
	    .transition()
	    .duration(10)
	    .delay(function(d) {return start_delay+time_conversion*(d-anim_start_year);})
	    .each("start",function(d) { 
		$('#tm_label').text(d);
		if (map_clicked) { update_district_table(selected_district,d); }
		update_EW_table(d);
	    });

	//KEY AXIS
	if (!resuming)
	{
	    var key_scale = options[option].key_scale([0,-$('#key').attr('height')],[min_ts,max_ts],base)
	    var axis = d3.svg.axis().scale(key_scale).orient("right").tickValues(options[option].ticks(min_ts,max_ts)).tickFormat(d3.format(',.'+options[option].decimal_places.toString()+'f'));
	    keyg.append('g').attr('transform','translate('+$('#key').attr('x')+35+','+(parseInt($('#key').attr('height'))+parseInt($('#key').attr('y')))+')').call(axis).attr('class','axisEW');
	    for (var kl=1;kl<=2;kl++) {$('#key_label'+kl).text(options[option].key_labels[kl-1]).attr('class','textEW');}
	}
    });
      
}

*/