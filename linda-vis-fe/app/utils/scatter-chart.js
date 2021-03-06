import util from "./util";
import exportVis from "./export-visualization";

/* global dimple */
/* global $ */
var scatterchart = function() {
    var seriesHeaders = [];
    var data = [];

    function draw(configuration, visualisationContainerID) {
        console.log("### INITIALIZE VISUALISATION - COLUMN CHART");

        var container = $('#' + visualisationContainerID);
        container.empty();

        var xAxis = configuration['Horizontal Axis'];
        var yAxis = configuration['Vertical Axis'];
        var group = configuration['Groups'];

        if (!(configuration.dataModule && configuration.datasourceLocation && xAxis && yAxis)) {
            return $.Deferred().resolve().promise();
        }

        if ((xAxis.length === 0) || (yAxis.length === 0)) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;
        var graph = configuration.datasourceGraph;
        var gridlines = configuration.Gridlines;
        var tooltip = configuration.Tooltip;
        var hLabel = configuration["Horizontal Label"];
        var vLabel = configuration["Vertical Label"];

        var selection = {
            dimension: [],
            multidimension: xAxis.concat(yAxis).concat(group),
            gridlines: gridlines,
            tooltip: tooltip,
            hLabel: hLabel,
            vLabel: vLabel
        };

        console.log("VISUALIZATION SELECTION FOR COLUMN CHART:");
        console.dir(selection);

        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, graph, selection).then(function(inputData) {
            console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART - INPUT DATA");
            console.dir(inputData);
            seriesHeaders = inputData[0];
            data = util.createRows(inputData);
            for(var i = 0; i < data.length; i++){
               data[i]["id"] = "id"+i;
            }
            
            console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART - OUTPUT DATA");
            console.dir(data);

            var chart = new dimple.chart(svg, data);

            var xAxisName = seriesHeaders[0];
            var yAxisName = seriesHeaders[1];

            var groupAxisName;
            if (group.length > 0) {
                groupAxisName = seriesHeaders[2];
            }

            var x = chart.addMeasureAxis("x", xAxisName);
            var y = chart.addMeasureAxis("y", yAxisName);

            var series = ["id"];

            if (groupAxisName) {
                series.push(groupAxisName);
            }
            
           
            
            console.log("SERIES:");
            console.dir(series);

            chart.addSeries(series, dimple.plot.bubble);
            chart.addLegend("50%", "10%", 500, 20, "right");
            
             //ticks
            x.ticks = selection.gridlines;
            y.ticks = selection.gridlines;
            //titles
            if (selection.hLabel ==="" || selection.hLabel === "Label"){
                selection.hLabel = seriesHeaders[0]; 
            }
            if (selection.vLabel ==="" || selection.vLabel === "Label"){
                selection.vLabel = seriesHeaders[1];
            }
            x.title = selection.hLabel;
            y.title = selection.vLabel;
            //tooltip
            if (selection.tooltip === false){
                chart.addSeries(series, dimple.plot.bubble).addEventHandler("mouseover",function(){});
            }
            
            chart.draw();
        });
    }

    function export_as_PNG() {
        return exportVis.export_PNG();
    }

    function export_as_SVG() {
        return exportVis.export_SVG();
    }

    function get_SVG() {
        return exportVis.get_SVG();
    }

    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw
    };
}();

export default scatterchart;
