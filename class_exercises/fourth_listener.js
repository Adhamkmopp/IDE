d3.select(window).on('load', function() {

    var svg = d3.select('svg');
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .domain([0, 500])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([100, 400])
        .range([height, 0]);

    var circData = [
        {x: 80, y: 200, r: width / 20, text: "Small circle"},
        {x: 200, y: 250, r: width / 10, text: "Medium circle"},
        {x: 400, y: 300, r: width / 5, text: "Big circle"}
    ];

    var circles = svg
        .selectAll('circle')
        .data(circData)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return x(d.x);
        })
        .attr('cy', function (d) {
            return y(d.y);
        })
        .attr('r', function (d) {
            return d.r;
        })
        .on('mousemove', function (d) {
            d3.select('#event-text')
                .text(d.text);
        });

    d3.selectAll('li')
        .on('click', function (d, i) {
            d3.selectAll('circle')
                .style('fill', function(dc, ic){
                    if (i !== ic) return 'black';
                    else {
                        return 'blue'
                    }
                })
        });



    draw_new_circ();


});



function update(g, x, y, data) {

    // Join new data with old elements, if available
    // Join new data with old elements, if available
    var circles = g.selectAll('circle')
        .data(data)
        .attr('cx', function(d,i){return x(i);})
        .attr('cy', function(d){return y(d);});


    // Create new elements if needed
    circles
            .enter()
            .append('circle')
            .attr('cx', function(d,i){return x(i);})
            .attr('cy', function(d){return y(d);})
            .attr('r', function(d){return 5;})
            .attr('fill', 'red');
    circles
        .exit()
        .remove();

}

function draw_new_circ() {

    var svg = d3.select('svg');
    var margin = {top: 50, right: 50, bottom: 200, left: 50};
    var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([0, 20])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, 20])
        .range([height, 0]);

    var data = d3.range(10);

    var circles = g
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function(d,i){return x(i);})
        .attr('cy', function(d){return y(d);})
        .attr('r', function(d){return 5;});

    d3.select("#button1")
        .on("click", function(d, i) {
            data[4] += 0.5;
            update(g, x, y, data);

        });

    // add new elements
    d3.select("#button2")
        .on("click", function(d, i) {
            // adding two new values
            data.push(data.length);
            data.push(data.length);
            update(g, x, y, data);

        });

    d3.select("#button3")
        .on("click", function(d, i) {
            // removing one value
            data.pop();
            update(g, x, y, data);

        });

    d3.selectAll('circle')
        .on('mouseover', function(d){
            d3.select(this)
                .style('fill', 'blue')
        });

}


