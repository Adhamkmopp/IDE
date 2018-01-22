
d3.select(window).on('load', init);


function init() {
    d3.csv(
        'temperatureAnana_season.csv',
        function(error, data) {
            if (error) throw error;

            draw_svg(data)
        });

    d3.text("berlin.txt", function (error, d) {
            d = d.replace(/  +/g, ',');
            parsed = d3.csvParse(d);


            var newParse = d3.nest()
                .key(function (d) {
                    return d.YEAR;
                })
                .entries(parsed);
            parsed.pop();
            parsed.forEach(function (d, i) {

                d.JAN = +d.JAN;
                d.FEB = +d.FEB;
                d.MAR = +d.MAR;
                d.APR = +d.APR;
                d.MAY = +d.MAY;
                d.JUN = +d.JUN;
                d.JUL = +d.JUL;
                d.AUG = +d.AUG;
                d.SEP = +d.SEP;
                d.OCT = +d.OCT;
                d.NOV = +d.NOV;
                d.DEC = +d.DEC;
                delete (d["D-J-F"]);
                delete (d["M-A-M"]);
                delete (d["J-J-A"]);
                delete (d["S-O-N"]);
                delete (d.metANN);
                delete (d.YEAR)

            });

            berlinplot(parsed)
        }
    )

}

function draw_svg(data) {

    var svg = d3.select('#temperature_ana'),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;


    var x_scale = d3.scalePoint().rangeRound([0, width]).padding(0.1),
        y_scale = d3.scaleLinear().rangeRound([height, 0]);

    x_scale.domain(d3.set(data.map(function (d) {return d.Month;})).values());
    y_scale.domain([d3.min(data, function (d) {return d.Temperature;}), d3.max(data, function (d) {return d.Temperature;})]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // add text to the X axis
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_scale))
        .append("text")
        .attr("y", margin.bottom)
        .attr("x", width / 2)
        .attr("dx", "1em")

        .attr("text-anchor", "middle")
        .text("Months");

    // add text to the Y axis
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y_scale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Temperature");

    // add title to plot
    g.append("text")
        .style("font-family", "Lato, sans-serif")
        .attr("y", margin.top)
        .attr("x", (height / 2)+40)
        .text("Temperature changes in Antananarivo - Madagascar");

    var color3 = d3.scaleLinear()
        .domain([1889, 2017])
        .range(['#ac3bff', '#ff7110', '#7cff70'])
        .interpolate(d3.interpolateRgb); //interpolateHsl interpolateHcl interpolateRgb

    g.append("svg")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {return x_scale(d.Month);})
        .attr("cy", function (d) {return y_scale(d.Temperature);})
        .attr("fill", function (d) {
            return color3(d.Year)
        })
        .attr('opacity', 0.3)
        .attr("r", 2);


    var line = d3.line()
        .x(function (d) {
            return x_scale(d.Month);
        })
        .y(function (d) {
            return y_scale(d.Temperature);
        });

    var month_per_year = d3.nest()
        .key(function (d) {
            return d.Year;
        })
        .entries(data);

    var legend = svg.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "legend");

    for (i = 0; i < month_per_year.length; i++) {
        g.append("path")
            .datum(month_per_year[i].values)
            .attr("d", line)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("fill", "none")
            .attr("stroke", color3(i+1889))
            .attr("stroke-width", 0.5);
        legend.append("rect")3
            .attr("x", width - 32)
            .attr("y", 18 + i)
            .attr("width", 10)
            .attr("height", 1)
            .attr("fill", color3(i+1889));

    }
    var cop = ["1889", "1950", "2017"]
    for (i=0; i <  3; i++){
      legend.append("text")
      .style("font-family", "Lato, sans-serif")
      .style("font-size", 13)
      .attr("x", width - 20)
      .attr("y", 29 + i*54)
      .text(cop[i]);
    }

}

//Second visualization


function berlinplot(dataBer) {
    var svg = d3.select("#temperature_ber"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        w = +svg.attr("width") - margin.left - margin.right,
        h = +svg.attr("height") - margin.top - margin.bottom;
    svg = svg
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xmax = dataBer.length * 12;
    var xmin = 0;
    var ymaxCandidate = [];
    var yminCandidate = [];

    dataBer.forEach(function (d) {
        ymaxCandidate.push(d3.max(Object.values(d)));
        yminCandidate.push(d3.min(Object.values(d)))
    });

    var ymax = d3.max(ymaxCandidate);
    var ymin = d3.min(yminCandidate);

    var xScale = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([0, w]);

    var yScale = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([h, 0]);


    var allMonths = Object.keys(dataBer[0]);
    var colorsOfSeasons = ["dodgerblue", "cornflowerblue", "chartreuse", "springgreen", "greenyellow", "tomato", "red",
        "orangered", "wheat", "gold", "sandybrown", "deepskyblue"];


    var line = d3.line()
        .x(function (d) {
            return xScale(d.xx);
        })
        .y(function (d) {
            return yScale(d.yy);
        });

    for (j = 0; j < 12; j++) {
        var x = [];
        var y = [];
        svg.append("g")
            .selectAll("circle")
            .data(dataBer)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                x.push(i * 12 + j);
                return xScale(i * 12 + j)
            })
            .attr("cy", function (d, i) {
                y.push(d[allMonths[j]]);
                return yScale(d[allMonths[j]])
            })
            .attr("r", 2)
            .attr("fill", colorsOfSeasons[j]);
        var thisMonth = [];
        for (var k = 0; k < 101; k++) {
            thisMonth.push({xx: x[k], yy: y[k]})
        }

        svg.append("path")
            .datum(thisMonth)
            .attr("fill", "none")
            .attr("stroke", colorsOfSeasons[j])
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);


    }
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisRight(yScale).ticks(23);

    svg.append("g")
        .call(xAxis.tickFormat(function(d){
                return (Math.round(d /12 ) + 1916)
            }

        ))
        .attr("transform", "translate(0," + h + ")")
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")
        .append("text")
        .text("Years");



    svg.append("g")
        .call(yAxis);


    // add title to plot
    svg.append("text")
        .style("font-family", "Lato, sans-serif")
        .attr("y", margin.top)
        .attr("x", (h / 2))
        .text("Temperature changes in Berlin - Germany");


    var svg2 = d3.select("#berl_legend"),
        h2 = +svg2.attr("height");
        wid2 = 50;

    var legend2 = svg2.selectAll("g")
        .data(dataBer)
        .enter().append("g")
        .attr("class", "legend");

    for (i=0; i <  12; i++) legend2.append("rect")
        .attr("x", wid2 - 32)
        .attr("y", (i * (h2 / 13)))
        .attr("width", 10)
        .attr("height", h2 / 13)
        .attr("fill", colorsOfSeasons[i]);
    var cop2 = ['January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (i=0; i <  12; i++){
        legend2.append("text")
            .style("font-family", "Lato, sans-serif")
            .style("font-size", 13)
            .attr("x", wid2-12 )
            .attr("y", ((i+0.75) * (h2 / 13)))
            .text(cop2[i]);
    }

}

