d3.select(window).on('load', init);

function init() {

    // Load map data
    d3.json('sfpd_districts.geojson', function(error, mapData) {
        if (error) throw error;
        map_features = mapData.features;
        d3.json('sf_crime.geojson', function (error, crime_data) {
            crime_features = crime_data.features;
            draw_map(map_features, crime_features);
        });
    });

}


function draw_map(districts, crimes) {

    var svg = d3.select('#sf_container');
    var margin = {top: 50, right: 50, bottom: 50, left: 100};
    var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var scale = d3.scaleLinear()
        .range([0, width])
        .domain([0,1000]);

    // Choose projection
    var projection = d3.geoMercator()
        .center([-122.433701, 37.767683])
        .scale(260000)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);


    var color = d3.scaleOrdinal()
        .domain([0, 9])
        .range(['#d6cbd3', '#eca1a6', '#bdcebe',
            '#ada397', '#d5e1df',  '#e3eaa7',
            '#86af49', '#034f84', '#92a8d1', '#ff903b']);

    g.append("g")
        .selectAll("path")
        .attr("class", "districts")
        .data(districts)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function (d, i) {
            return color(i);
        })
        .attr("stroke", "black")
        .attr("stroke-width", 0.1);

    g.selectAll(".districts")
        .data(districts)
        .enter().append("text")
        .attr("class", "c_font")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("x", -20)
        .attr("y", 5)
        .text(function(d) {
            return d.properties.district;
        });


    g.selectAll("circle")
        .data(crimes)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return projection(d.geometry.coordinates)[0];
        })
        .attr('cy', function (d) {
            return projection(d.geometry.coordinates)[1];
        })
        .attr('r', 1)
        .attr('fill', function (d) {
            if (d.properties.PdDistrict === "NORTHERN"){
                return 'red'
            } return 'black'

        })

}
