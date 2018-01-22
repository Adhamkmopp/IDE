d3.select(window).on('load', init);

function init() {
    var all_hands_arr = [];
    var pca_arr = [];

    d3.text("hands.csv", function (text) {
        d3.csvParseRows(text, function (d) {
            var hand_arr = [];
            d.forEach(function (t, i) {
                if (i + 56 < 112) {
                    hand_arr.push([+d[i], +d[i + 56]])
                }
            });
            all_hands_arr.push(hand_arr)
        });
        // draw_hands(all_hands_arr)
    });

    d3.text("hands_pca_colname.csv", function (error, text) {
        if (error) throw error;
        // create array with pc components for each hand

        d3.csvParseRows(text, function (d) {
            pca_arr.push(d);
        });

        draw_pca(pca_arr, all_hands_arr);
    });

    d3.select("#myCheckbox")
        .on("change", function(){
            if (d3.select("#myCheckbox").property("checked") === true){
                clear_all();
                draw_all_hand_on_hand(all_hands_arr)
            } else {
                clear_all();
                //draw_pca(pca_arr, all_hands_arr);
            }
        });

    function draw_hands(all_hands, i) {

        var svg = d3.select('#all_hands');
        var margin = {top: 50, right: 50, bottom: 150, left: 50};
        var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
        var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;


        var g = svg.select("#hands").append("g").attr("id", "group_geom")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var cake = all_hands[i];

        var x = d3.scaleLinear()
            .domain(d3.extent(cake,
                function (d) {
                    return +d[0];
                }))
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain(d3.extent(cake,
                function (d) {
                    return +d[1];
                }))
            .range([0, height]);

        var max = d3.max(cake, function (d) {
            return +d[1]
        });


        var line0 = d3.line()
            .x(function (d) {
                return x(d[0])
            })
            .y(function (d) {
                return y(d[1])
            })
            .curve(d3.curveCatmullRom);

        g.datum(cake)
            .append('path')
            .attr('d', line0)
            .attr("stroke", "grey")
            .attr("stroke-width", 1)
            .attr("fill", "wheat");

        g.selectAll('circle')
            .data(cake)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return x(+d[0]) + "px";
            })
            .attr('cy', function (d) {
                return y(+d[1]) + "px";
            })
            .attr('r', 2)
            .attr('fill', 'black')
    }

    function update(hands, i) {
        var svg = d3.select('#group_geom');

        var margin = {top: 50, right: 50, bottom: 150, left: 50};
        var width = 550 - margin.left - margin.right;
        var height = 600 - margin.top - margin.bottom;

        var cake = hands[i];
        var x = d3.scaleLinear()
            .domain(d3.extent(cake,
                function (d) {
                    return +d[0];
                }))
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain(d3.extent(cake,
                function (d) {
                    return +d[1];
                }))
            .range([0, height]);

        var max = d3.max(cake, function (d) {
            return +d[1]
        });

        var line0 = d3.line()
            .x(function (d) {
                return x(d[0])
            })
            .y(function (d) {
                return y(d[1])
            })
            .curve(d3.curveCatmullRom);

        svg.datum(cake)
            .transition()
            .duration(1000)
            .select('path')
            .attr('d', line0)
            .attr("stroke", "grey")
            .attr("stroke-width", 1)
            .attr("fill", "wheat");

        svg.selectAll('circle')
            .data(cake)
            .transition()
            .duration(1000)
            .attr('cx', function (d) {
                return x(+d[0]) + "px";
            })
            .attr('cy', function (d) {
                return y(+d[1]) + "px";
            })
            .attr('r', 2)
            .attr('fill', 'black')





    }

    function draw_pca(pca, hands, tog_stat) {

        var selection = Array.apply(null, {length: pca.length}).map(Function.call, Number);

        d3.select("#value1")
            .selectAll("option")
            .data(selection)
            .enter()
            .append("option")
            .attr("value", function (option) {
                return option;
            })
            .text(function (option) {
                return option;
            });

        d3.select("#value2")
            .selectAll("option")
            .data(selection)
            .enter()
            .append("option")
            .attr("value", function (option) {
                if (option===1){
                    d3.select(this).attr("selected", "selected");
                    return option
                } else
                return option;
            })
            .text(function (option) {
                return option;
            });

        val1 = 0;
        val2 = 1;

        d3.select("#button1")
            .on("click", function () {
                val1 = document.getElementById("value1").value;
                val2 = document.getElementById("value2").value;
                update_pca(val1, val2, pca, hands)

            });


        var svg = d3.select('#pca_plot');

        var margin = {top: 10, right: 20, bottom: 20, left: 30};
        var width = +svg.attr("width") - margin.left - margin.right;
        var height = +svg.attr("height") - margin.top - margin.bottom;
        var padding = 30;

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var cake = get_pca(val1, val2, pca);

        var x_scale = d3.scaleLinear()
            .domain(d3.extent(cake,
                function (d) {
                    return +d[0];
                }))
            .range([padding, width - padding]);

        var y_scale = d3.scaleLinear()
            .domain(d3.extent(cake,
                function (d) {
                    return +d[1];
                }))
            .range([height - padding, padding]);


        first = true;

        g.selectAll('circle')
            .data(cake)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return x_scale(+d[0]);
            })
            .attr('cy', function (d) {
                return y_scale(+d[1]);
            })
            .attr('r', 3)
            .attr('fill', 'black')
            .on("mouseover", function (d, i) {
                if (d3.select("#myCheckbox").property("checked") === false){
                    hand_function(i)
                } else {
                    hand_function(i);
                    d3.select("#H"+i)
                        .selectAll("path")
                        .transition()
                        .duration(500)
                        .attr("opacity", 1)

                }

            })

            .on("mouseout", function (d, i) {
                if(d3.select("#myCheckbox").property("checked") === false){
                    d3.select('#pca_container')
                        .selectAll(".tooltip")
                        .remove()
                } else {
                    d3.select('#pca_container')
                        .selectAll(".tooltip")
                        .remove();
                    d3.select("#H"+i)
                        .selectAll("path")
                        .transition()
                        .duration(500)
                        .attr("opacity", 0.1)
                }


            })

            .on("click", function (d, i) {
                if(d3.select("#myCheckbox").property("checked") === false){
                    if (first === true) {
                        draw_hands(hands, i);
                        first = false
                    } else {
                        update(hands, i)
                    }
                };


            });

        // add text to the X axis
        g.append("g")
            .attr('class', 'axisx')
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(d3.axisBottom(x_scale))
            .append("text")
            .style("font-family", "Lato, sans-serif")
            .attr("y", margin.bottom + 15)
            .attr("x", width / 2)
            .attr("dx", "1em")
            .attr("text-anchor", "middle")
            .text("PC1");

        // add text to the Y axis
        g.append("g")
            .attr('class', 'axisy')
            .call(d3.axisLeft(y_scale))
            .attr('transform', 'translate(' + padding + ', 0)')
            .append("text")
            .style("font-family", "Lato, sans-serif")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left - 10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("PC2");

        // add title to plot
        g.append("text")
            .style("font-family", "Lato, sans-serif")
            .attr("y", margin.top)
            .attr("x", (height ))
            .text("PCA plot");

        g.append("text")
            .style("font-family", "Lato, sans-serif")
            .attr("id", "xtitle")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top) + ")")
            .style("text-anchor", "middle")
            .text(function () {
                return "PC " + val1
            });

        g.append("text")
            .style("font-family", "Lato, sans-serif")
            .attr("id", "ytitle")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")

            .style("text-anchor", "middle")
            .text(function () {
                return "PC " + val2
            });


        function compute_slusters (pca_data){
            my_points=[];
            pca_data.forEach(function (value) {
                my_points.push([+value[0], +value[1]]);
            });
            clusters = clusterfck.kmeans(my_points, 5);
            return clusters;
        }
        clusters = compute_slusters(pca);

    }

    function get_pca(v1, v2, data) {
        return d3.zip(data[v1], data[v2]);
    }

    function update_pca(v1, v2, allpca, allhands) {

        var newcake = get_pca(v1, v2, allpca);
        var svg = d3.select('#pca_plot');
        var margin = {top: 10, right: 20, bottom: 20, left: 30};
        var width = +svg.attr("width") - margin.left - margin.right;
        var height = +svg.attr("height") - margin.top - margin.bottom;
        var padding = 30;

        var g = svg.select("g");

        var xscale = d3.scaleLinear()
            .domain(d3.extent(newcake,
                function (d) {
                    return +d[0];
                }))
            .range([padding, width - padding]);

        var yscale = d3.scaleLinear()
            .domain(d3.extent(newcake,
                function (d) {
                    return +d[1];
                }))
            .range([height - padding, padding]);

        g.selectAll('circle')
            .data(newcake)
            .on("click", function (d, i) {
                if (first === true) {
                    draw_hands(allhands, i);
                    first = false
                } else {
                    update(allhands, i)
                }
            })

            .transition()
            .duration(1000)
            .on("start", function () {
                d3.select(this)
                    .attr("fill", "rebeccapurple")
                    .attr("r", 5)
            })
            .attr('cx', function (d) {
                return xscale(+d[0]);
            })
            .attr('cy', function (d) {
                return yscale(+d[1]);
            })
            .attr('r', 3)
            .attr('fill', 'black');

        // add text to the X axis
        g.select(".axisx")
            .transition()
            .duration(1000)
            .call(d3.axisBottom(xscale));


        // add text to the Y axis
        g.select(".axisy")
            .transition()
            .duration(1000)
            .call(d3.axisLeft(yscale));

        g.select("#xtitle")
            .text(function () {
                return "PC " + v1
            });

        g.select("#ytitle")
            .text(function () {
                return "PC " + v2
            });
    }

    function hand_function (i){
        d3.select("#pca_container")
            .append("text")
            .attr("class", "tooltip")
            .style("left", (d3.event.pageX+10)+"px")
            .style("top", (d3.event.pageY+10)+"px" )
            .text("Hand " + i)
            .transition()
            .duration(1500)
            .attr("opacity", 100)

    }

    function clear_all(){
        d3.select("#group_geom")
            .remove();


    }

    function draw_all_hand_on_hand(all_hands){

        var svg = d3.select('#all_hands');
        var margin = {top: 50, right: 50, bottom: 150, left: 50};
        var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
        var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;


        var g = svg.select("#hands").append("g").attr("id", "group_geom")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var cake = all_hands;

        var x_max_min = [];
        var y_max_min =[];

        cake.forEach(function(d){
            d.forEach(function(t){
                x_max_min.push(t[0]);
            })
        });

        cake.forEach(function(d){
            d.forEach(function(t){
                y_max_min.push(t[1]);
            })
        });

        // this extent returns the min and max vals for all of the hands
        var x = d3.scaleLinear()
            .domain(d3.extent(x_max_min))
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain(d3.extent(y_max_min))
            .range([0, height]);


        cake.forEach(function(sweet_cake, i){

            g.append("g").attr("id", "H"+i);

            var line0 = d3.line()
                .x(function (d) {
                    return x(d[0])
                })
                .y(function (d) {
                    return y(d[1])
                })
                .curve(d3.curveCatmullRom);

            g.select("#H"+i)
                .datum(sweet_cake)
                .append('path')
                .attr('d', line0)
                .attr("stroke", "grey")
                .attr("stroke-width", 2)
                .attr("opacity", 0.1)
                .attr("fill", "none");

            g.select("#H"+i)
                .selectAll('circle')
                .data(sweet_cake)
                .enter()
                .append('circle')
                .attr('cx', function (d) {
                    return x(+d[0]) + "px";
                })
                .attr('cy', function (d) {
                    return y(+d[1]) + "px";
                })
                .attr('r', 0.5)
                .attr('fill', 'black')

        });

    }

}