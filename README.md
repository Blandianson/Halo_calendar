# Halo_calendar

The Heatmap calendar takes a json of dates, percentage values, and color values and maps them to a calendar using colour and colour intensity to represent the values.

## Getting Started

These instructions are applicable only to users of the Halo Business Intelligency Web Application.

Select a view from the Halo Web App interface to add the pane to and then add a pane. 
From the dropdown menu in the top right of the pane select **Edit** and for the column of interest change the **RenderStyle** to **KPI** then in **KPI properties** > **Style** > change to **Background Color scales**.
Then select the spanner icon from the bottom right once the data has loaded.
This is the Pane Edit interface. Paste the following code into the HTML text area:


------HTML------
```
<!DOCTYPE html>
    <head>   
    
        <link rel="stylesheet" type="text/css" href="http://localhost/halo/Public/halobi.app.kpiCalendar.css">
        <script src="http://d3js.org/d3.v3.js"></script>
        <script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
	
    </head>
    <body>
    
        <div id="chart" class="clearfix"></div>
	
    </body>
</html>
```

------HTML END------


and between the App Script tags in the Javascript text area paste:


------SCRIPT------

```
$.getScript("http://localhost/halo/Public/halobi.app.kpiCalendar.js",function(){
    var columnMeasureValue = 4; 		//change to the no of the column of interest (usually 4)
    calendarShow(JSON.stringify(prism.pane.rows), "#chart", columnMeasureValue);
});
```

------SCRIPT END------


Script must be run in the same file as the json data being passed to the calendarShow function (prism).

Click the **Run** button in the above the HTML text area, and click the blue **Done** button in the bottom left.

DOn't forget to save the view - click the floppy-disk icon in the toolbar top right.


## Prerequisites

- Halo BI v18 or above.

- Dataset with Day-Level granularity.

- Dataset with the hierachy of:

```
var prism = "pane": {
		"rows": [ { 
			"data": [

				{
					"value": "not used",
					"id": "0"
				},
				{
					"value": "20160102"           //must have
				},
				{
					"value": "1054"
				},
				{
					"value": "1392"
				},
				{
					"value": "-24.2816091954023", //must have
					"color": "#FF0000"            //must have
				}
			],
			"selected": false
		},
```
## Installing

Once you click **Run** you should see a calendar populated with colours within the view.

Add other panes from the left hand menu to see the corresponding data in the calendar.


## Acknowledgements

Based heavily on the works of [Kathy Zhou](kathyzhou.com) and her [Calender View Heatmap](http://bl.ocks.org/KathyZ/c2d4694c953419e0509b).


## Authors

Nicole Jackson - Halo

