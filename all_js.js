//Author: Nicole Jackson, 
//Date: 27/11/2018, 
//Desc: Takes a csv of dates and vals as converts to a heatmap calendar representation.

function calendarShow(prism_str, element, column){

    var prism = JSON.parse(prism_str);
    var str_date = [];	                     			            //Holds Date value - used for parsing date
    var date_var = "Date,Var\n";                      	            //csv string holding data in the form that time.js needs
    var min=9999, max=0, counter, count_blank=0;
    var first_data_pt = new Date(prism[0].data[1].value.slice(0, 4) + "-" + prism[0].data[1].value.slice(4, 6) + "-" + prism[0].data[1].value.slice(6));
    if(prism[0].length < column || column <= 0){
        alert("Please select a valid column to inspect.")
    }

    prism.forEach(function(rows){

        str_date = rows.data[1].value;
        
        if ((new RegExp("^([0-9]{8})$")).test(str_date)){			// Regex to determine if the value is a date with 8 chars (yyyymmdd)

            var year = str_date.slice(0, 4);                        //Year str
            var month = str_date.slice(4, 6);         				//Month str
            var day = str_date.slice(6);                            //Day str
            date_var += year + "-" + month + "-" + day + ",";       //Adds time (yyyy-mm-dd) to the csv str with tailing comma
            var int_year = parseInt(year);
            if( int_year < min ){ min = int_year; }
            else if( int_year > max ){ max = int_year; }
        }
        
        str_var = rows.data[4].value;                    			//Gets the varience value

        // if(str_var === "-100"){counter++;}
        // else if(str_var !== "-100"){counter = 0;}
        // if(counter >= 3){ str_var = ""; }

        //
        //Removing the years with no data

        var last_data_pt = new Date(year, 11, 31);
        var current_date = new Date(year, month-1, day);
                
        const utc1 = Date.UTC(first_data_pt.getFullYear(), first_data_pt.getMonth(), first_data_pt.getDate());
        const utc2 = Date.UTC(last_data_pt.getFullYear(), last_data_pt.getMonth(), last_data_pt.getDate());
        var data_days = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))+1;
        
        console.log("Year: ", new Date(year).getFullYear(), " firstDay: ", first_data_pt.getFullYear(), " Year !== firstDay: ", new Date(year).getFullYear() !== first_data_pt.getFullYear());
        console.log("first_data_pt " + first_data_pt + "  last_data_pt " + last_data_pt +  " days till year end: " + data_days);

        if(str_var === "" && new Date(year).getFullYear() === first_data_pt.getFullYear()){
            count_blank += 1;
            console.log(count_blank);
        }
        if(new Date(year).getFullYear() !== first_data_pt.getFullYear()){
            first_data_pt = current_date;
        }

        if(count_blank == data_days){
            count_blank = 0;
            min ++;
        }

        //End of Removing the years with no data
        //
        

        if(str_var === ""){ date_var += undefined + "\n"; }
        else{ date_var += Math.round(str_var) + "\n"; } 

        var color = rows.data[4].color;

    });

    var csv = d3.csv.parse(date_var, function(item) { return item; });	//Parses the var to csv format

    //console.log("Data: " + date_var);

    formCalendar(min, max, date_var, csv, element);
}


//Heatmap Calendar by Kathy Zhou source: http://bl.ocks.org/KathyZ/c2d4694c953419e0509b

function formCalendar(min, max, date_var, csv, element){

    var width = 960,
            height = 750,
            cellSize = 25; // cell size

    var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    var shift_up = cellSize * 3;

    var day = d3.time.format("%w"), // day of the week
        day_of_month = d3.time.format("%e") // day of the month
        day_of_year = d3.time.format("%j")
        week = d3.time.format("%U"), // week number of the year
        month = d3.time.format("%m"), // month number
        year = d3.time.format("%Y"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
        .domain([-.05, .05])
        .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

    var svg = d3.select(element).selectAll("svg")
        .data(d3.range(min, max+1))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")

    var rect = svg.selectAll(".day")
        .data( function(d) { 
            return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            var month_padding = 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
            return day(d) * cellSize + month_padding; 
        })
        .attr("y", function(d) { 
            var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return (week_diff*cellSize) + row_level*cellSize*8 - cellSize/2 - shift_up;
        })
        .datum(format);

    var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
            .data(function(d) { 
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("text")
            .text(monthTitle)
            .attr("x", function(d, i) {
            var month_padding = 1.2 * cellSize*7* ((month(d)-1) % (no_months_in_a_row));
            return month_padding;
            })
            .attr("y", function(d, i) {
            var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return (week_diff*cellSize) + row_level*cellSize*8 - cellSize - shift_up;
            })
            .attr("class", "month-title")
            .attr("d", monthTitle);

    var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the whatnot
            .data(function(d) { 
            return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("text")
            .text(yearTitle)
            .attr("x", function(d, i) { return width/2 - 100; })
            .attr("y", function(d, i) { return cellSize*5.5 - shift_up; })
            .attr("class", "year-title")
            .attr("d", yearTitle);


    //  Tooltip Object
    var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    var data = d3.nest()
    .key(function(d) {
        return d.Date;
    })
    .rollup(function(d) {
        return (d[0].Var/100);                              //Divides the data to make them a percentage.
    })
    .map(csv);

    rect.filter(function(d) {
        return d in data;
    })
    .attr("class", function(d) {
        return "day " + color((data[d])/40);				//Divides the data so heatmap colours aren't too extreme.
    })
    .select("title")
    .text(function(d) {
        return d + ": " + percent(data[d]);
    });


        //  Tooltip
        rect.on("mouseover", mouseover);
        rect.on("mouseout", mouseout);
        function mouseover(d) {
        tooltip.style("visibility", "visible");
        var percent_data = (data[d] !== undefined && isNaN(data[d]) === false ) ? percent(data[d]) : "No Data";
        var purchase_text = d + ": " + percent_data;

        tooltip.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
        tooltip.html(purchase_text)  
                    .style("left", (d3.event.pageX)+30 + "px")     
                    .style("top", (d3.event.pageY) + "px"); 
        }
        function mouseout (d) {
        tooltip.transition()        
                .duration(500)      
                .style("opacity", 0); 
        var $tooltip = $("#tooltip");
        $tooltip.empty();
        }

    function dayTitle (t0) {
        return t0.toString().split(" ")[2];
    }
    function monthTitle (t0) {
        return t0.toLocaleString("en-us", { month: "long" });
    }
    function yearTitle (t0) {
        return t0.toString().split(" ")[3];
    }
}