
d3.select(window).on('load', init);

function init() {
    d3.csv(
        'data.csv',

        function(d){
            d.frequency *=100.0;
            return d;
        },

        function(error, data) {
            if (error) throw error;

            d3.select('body')
                .append('ul')
                .selectAll('li')
                .data(data)
                .enter()
                .append('li')
                .text(function(d){
                    return d.letter+':'+
                        d.frequency;
                });
        });

    var scale = d3.scaleLinear()
        .domain([0,10])
        .range([0,100]);

    console.log(scale(5.));

    draw_svg();
    color_circles();
    padding_circles();
}



function draw_svg() {
        var mydata = [[100, 237, 4],
            [217, 132, 5],
            [160, 110, 7],
            [106, 123, 8]];

        var svg = d3.select('svg');


        var width = +svg.node().getBoundingClientRect().width;
        var height = +svg.node().getBoundingClientRect().height;

        var xScale = d3.scaleLinear()
            .domain([0,
                d3.max(mydata,
                    function(d){
                        return d[0];
                    })])
            .range([0,width]);

        var yScale = d3.scaleLinear()
            .domain(d3.extent(mydata,
                function(d){
                    return d[1];
                }))
            .range([0,height]);

        var rScale = d3.scaleLinear()
            .domain(d3.extent(mydata,
                function(d){
                    return d[2];
                }))
            .range([5,25]);

        d3.select("#plotarea")
            .selectAll("circle")
            .data(mydata)
            .enter()
            .append("circle")
            .attr("r", function(d){
                return ""+rScale(d[2]);
            })
            .attr("cx", function(d){
                return ""+xScale(d[0])+"px";
            })
            .attr("cy", function(d){
                return ""+yScale(d[1])+"px";
            })
}

var mydata = [[100, 237, 4], [217, 132, 5], [160, 110, 7], [106, 123, 8]]

var colorScale =
    d3.scaleLinear()
        .domain(d3.extent(mydata,
            function(d){
                return d[2];}));

// Initialiation function. Called after body has loaded

function color_circles() {
    d3.select("#plotarea")
        .selectAll("circle")
        .data(mydata)
        .enter()
        .append("circle")
        .attr("r", function(d){return ""+d[2]+"px";})
        .style("fill", function(d){return d3.interpolateYlGn(colorScale(d[2]));})
        .attr("cx", function(d){return ""+d[0]+"px";})
        .attr("cy", function(d){return ""+d[1]+"px";})
}

function padding_circles() {

    var mydata = [[100, 237, 4],
        [217, 132, 5],
        [160, 110, 7],
        [106, 123, 8]];

    var svg = d3.select('svg');
    var width = +svg.node().getBoundingClientRect().width;
    var height = +svg.node().getBoundingClientRect().height;
    var padding = 20;

    var xScale = d3.scaleLinear()
        .domain([0,
            d3.max(mydata,
                function(d){
                    return d[0];
                })])
        .range([padding, width - padding]);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(mydata,
            function(d){
                return d[1];
            }))
        .range([height - padding, padding]);


    d3.select("#padding")
        .selectAll("circle")
        .data(mydata)
        .enter()
        .append("circle")
        .attr("r", "10px")
        .attr("cx", function(d){
            return ""+xScale(d[0])+"px";
        })
        .attr("cy", function(d){
            return ""+yScale(d[1])+"px";
        })

    // var xAxis = d3.axisBottom(xScale)   // Constructed using a scale

    // Define axis objects explicitly before use
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    d3.select("#padding")
        .append('g')
        .attr('transform', 'translate(0,' + (height - padding) + ')')
        .attr('class', 'axis x')
        .call(xAxis);

    d3.select("#padding")
        .append('g')
        .attr('transform', 'translate('+padding+', 0)')
        .attr('class', 'axis y')
        .call(yAxis);

}