d3.select(window).on('load', init);

function init() {

    var svg = d3.select('svg');
    var margin = {top: 100, right: 100, bottom: 100, left: 50};
    var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Create data
    var data = [[  0,   0],
        [ 50,  50],
        [100, -50],
        [150, 100],
        [200,-150]];

    // Create scales
    var x = d3.scaleLinear()
        .domain(d3.extent(data,
            function(d){
                return d[0];
            }))
        .range([0,width]);
    var y = d3.scaleLinear()
        .domain(d3.extent(data,
            function(d){
                return d[1];
            }))
        .range([0,height]);


    // Create area generator
    var area = d3.area()
        .x(function(d){return x(d[0]);})
        .y1(function(d){return y(d[1]);})
        .y0(function(d){return y(0);});

    // Create actual path element
    g.datum(data)
        .append('path')
        .attr('d', area)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "#ccc");

    // For reference, add points as well
    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function(d){return x(d[0]) + "px";})
        .attr('cy', function(d){return y(d[1]) + "px";})
        .attr('r', '5px')
        .attr('fill', 'black')
}