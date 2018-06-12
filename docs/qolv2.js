d3.select(window).on('load', init);

function init() {

    selected_year = null;
    selected_variable = null;

    d3.json("50m.json", function (error, mapData) {
        if (error) throw error;
        draw_map(mapData);

        d3.select("fieldset[name=years_selection]")
            .on("change", function() {
                selected_year = d3.select('input[name=year]:checked').node().value;

                if  (selected_variable != null && selected_year != null){
                    update_map(mapData, selected_year, selected_variable)
                }
            });


        d3.select("fieldset[name=variables_selection]")
            .on("change", function(){
                selected_variable = d3.select('input[name=variable]:checked').node().value;

                if  (selected_variable!=null && selected_year!=null){
                    update_map(mapData, selected_year, selected_variable)

                }
            });

        d3.csv("final.csv", function (data) {

            data.forEach(function (t) {
                t.Social_exclusion2007 = +t.Social_exclusion2007;
                t.Social_exclusion2011 = +t.Social_exclusion2011;
                t.MaleWHO2007 = +t.MaleWHO2007;
                t.FemaleWHO2007 = +t.FemaleWHO2007;
                t.MaleWHO2011 = +t.MaleWHO2011;
                t.FemaleWHO2011 = +t.FemaleWHO2011;
                t.a18to24WHO_2007 = +t.a18to24WHO_2007;
                t.a25to34WHO_2007 = +t.a25to34WHO_2007;
                t.a35to49WHO_2007 = +t.a35to49WHO_2007;
                t.a50to64WHO_2007 = +t.a50to64WHO_2007;
                t.a64WHO_2007 = +t.a64WHO_2007;
                t.a18to24WHO_2011 = +t.a18to24WHO_2011;
                t.a25to34WHO_2011 = +t.a25to34WHO_2011;
                t.a35to49WHO_2011 = +t.a35to49WHO_2011;
                t.a50to64WHO_2011 = +t.a50to64WHO_2011;
                t.a64WHO_2011 =  +t.a64WHO_2011
                t.Social_contact2011 = +t.Social_contact2011
            });
            draw_donuts(data);
            draw_exclusion_contact(data);
            draw_exclusion_deprivation(data);


            draw_who_gender_points(data);
            draw_who_age_points(data);


        });


    });


    colors = d3.schemePastel1;
    color = ["red","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84","red"];

    gencolor = d3.scaleOrdinal()
        .range(["red","#1d91c0"]);

    labels = {
        "Gender":["Male", "Female"],
        "Education":["None", "Primary", "Secondary", "Tertiary"],
        "Age": ["18-24", "25-34","35-49","50-64", "64+"]
        //"WHOIndex2007": ["Males","Females", "total", "18to24", "25to34","35to49","50to64", "64+"], 
        //"SocialContact2017":["total"], 
        //"Deprivation2007":["total"], 
        //"SocialExclusion2007":["total"], 
        //"Gender2011":["Male", "Female"], 
        //"Education2011":["None", "Primary", "Secondary", "Tertiary"], 
        //"Age2011": ["18-24", "25-34","35-49","50-64", "64+"] 
        //"WHOIndex2011": ["Males","Females", "total", "18to24", "25to34","35to49","50to64", "64+"], 
        //"SocialContact2011":["total"], 
        //"Deprivation2011":["total"], 
        //"SocialExclusion2011":["total"] 
    };

    function checker(overlaps){
        for(i=0;i<10;i++)
            overlaps.selectAll(".countryLabels")
                .each(function () {
                    var that = this,
                        a= this.getBoundingClientRect()
                    overlaps.selectAll(".countryLabels")
                        .each ( function () {
                            if (this != that){
                                b= this.getBoundingClientRect()
                                if (Math.abs(a.y - b.y) <= 10 & Math.abs(a.x - b.x) <= 20){
                                    d3.select(that).attr("dx", (Math.random()*(-i)))
                                    d3.select(this).attr("dx", (Math.random()*(i)))

                                    d3.select(this).attr("dy", (Math.random()*(i)))
                                    d3.select(that).attr("dy", (Math.random()*(-i)))

                                }
                            }
                        })
                } )
    }

    function arcTween(a) {
        /** This function will be used to keep track of the current angle, and return a new arc
         interpolation. Placed here to allow global access to draw_donuts and change_country functions
         */

        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    }

    function draw_donuts(data) {

        country_object ={};
        country_object["2007"] = {};
        country_object["2011"] ={};

        data.forEach(function (t) {
            curr_count = t.Countries;
            keys = Object.keys(country_object);
            country_object[keys[0]][curr_count] ={
                "Gender": [t["Males"+keys[0]], t["Females"+keys[0]]],
                "Education": [t["None"+keys[0]], t["Primary"+keys[0]], t["Secondary"+keys[0]], t["Tertiary"+keys[0]]],
                "Age": [t["a18to24_"+keys[0]],t["a25to34_"+keys[0]],t["a35to49_"+keys[0]],t["a50to64_"+keys[0]],t["a64_"+keys[0]]]
            };

            country_object["2011"][curr_count] ={
                "Gender": [t["Males"+keys[1]], t["Females"+keys[1]]],
                "Education": [t["None"+keys[1]], t["Primary"+keys[1]], t["Secondary"+keys[1]], t["Tertiary"+keys[1]]],
                "Age": [t["a18to24_"+keys[1]],t["a25to34_"+keys[1]],t["a35to49_"+keys[1]],t["a50to64_"+keys[1]],t["a64_"+keys[1]]]
            };
        });
        /* setting up the svg and tooltip */
        
        var svg = d3.select("#pie_container");
        var width = +svg.node().getBoundingClientRect().width
        var height = +svg.node().getBoundingClientRect().height
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

height = height - margin.top - margin.bottom;
width = width- margin.left - margin.right;

        svg.append("text")
            .attr("dy", ".0em")
            .attr("y", 20)
            .attr("x", width/2)
            .text("Austria")
            .attr("text-anchor", "middle");

        d3.select("body") // adds a placeholder tooltip we will select later on the donut 
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0.9);
        keys.forEach(function (year,i) {
            pie_outer_radius= 35;
            pie_inner_radius= 15;

            arc = d3.arc()
                .outerRadius(pie_outer_radius)
                .innerRadius(pie_inner_radius);

            labelArc = d3.arc()
                .outerRadius(pie_outer_radius +30)
                .innerRadius(pie_inner_radius +30);

            lineArc = d3.arc()
                .outerRadius(pie_outer_radius+15)
                .innerRadius(pie_inner_radius+15);

            //outerArc = d3.arc() 
            //  .innerRadius(pie_outer_radius) 
            //.outerRadius(pie_outer_radius + 2); 

            svg.append("text")
                .text(year)
                .attr("x",  margin.left/2)
                .attr("y",function (t) {
                    if(i==0){
                        return margin.top*2
                    } else{
                        return (height/2) + margin.top*2
                    }
                } ).attr("font-size", "1vw")
                .attr("text-decoration", "underline");


            //sets the start and end angles for all the values in a standard pie 
            d3.keys(country_object[year]["Austria"]).forEach( function (variablename, j) {
                var somepie = d3.pie()
                    .padAngle(0.03)
                    .value(function (d) {
                        return d;
                    })(country_object[year]["Austria"][variablename]);


                /*Setting up the donuts 1/3rd of the svg apart, and sets the second donut at a different 
                height in the middle of the svg*/
                var edu = svg.append("g")
                    .attr("id", "" + variablename + year+ "donut")
                    .attr("transform", function () {
                        if (j == 1 && year == 2007) {
                            return "translate(" + ((width-pie_outer_radius) * ((j + 1) / 3)) + "," + ( ((height-pie_outer_radius) / 6)+30) + ")"
                        } else if (year==2007){
                            return "translate(" + ((width-pie_outer_radius) * ((j + 1) / 3)) + "," + (((height) / 4)+100) + ")"
                        } else if (j == 1 && year == 2011) {
                            return "translate(" + ((width-pie_outer_radius) * ((j + 1) / 3)) + "," + (((height) / 2)+100) + ")"
                        } else {
                            return "translate(" + ((width-pie_outer_radius) * ((j + 1) / 3)) + "," + (((height) / 2)+150) + ")"
                        }
                    })
                    .selectAll("arc")
                    .data(somepie.sort(function (a, b) {
                        // sorting is important if we want variable pie sizes later but I don't believe we will need it 
                        return d3.ascending(a.value, b.value);
                    }))
                    .enter()
                    .append("g")
                    .attr("class", "arc");

                edu.append("path")
                    .attr("class", "donutArc")
                    .attr("d", arc)
                    .each(function(d) { d.pie_outer_radius = 50; })
                    .on("mouseover", function(d,i) {

                        d3.select(".tooltip")
                            .html(function () {
                                /* Returns corresponding percentages and variables names to be displayed inside the tooltip */
                                var name = labels[variablename][i];
                                return "<strong>"+name +"</strong>"+" : " + "<span style=\"color:red\">"+Math.abs(Math.round(
                                    ((d.startAngle - d.endAngle)/(Math.PI*2))*100))
                                    +"%" +"</span>"
                            })
                            .style("left", (d3.event.pageX + 15) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style("opacity", .9);
                    })
                    .on("mouseenter", function (d) {
                        d3.select(this)
                            .attr("stroke", "white")
                    })

                    .on('mouseout', function (d, i) {
                        d3.select(this).attr("stroke", "none")
                        d3.selectAll(".tooltip")
                            .transition()
                            .style("opacity", 0)
                    })

                    .style("fill", function (d, i) {
                        return color[i];
                    })
                    .each(function (d) {
                        this._current = d;
                    })
                    .transition()
                    .duration(750)
                    .attrTween('d', function (d,j) {
                        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);

                        return function (t) {
                            /*  var offset = (j)*5 
                              var arc = d3.arc() 
                                  .outerRadius(40) 
                                 .innerRadius(60 + offset); 
                              */ d.endAngle = i(t);

                            return arc(d)
                        }
                    });


                /* Appending corresponding variable names on slices. They are set on an arc centroid slightly bigger than 
                the original arc, and moved even further by 0.35em depending on their location. This was necessary to avoid text 
                overlaps without setting up complicated collision detection functions 
                 */
                edu.append("text")
                    .attr("transform", function(d) {
                        return "translate(" + labelArc.centroid(d) + ")"; })
                    .attr("dy", function (d) {
                        return labelArc.centroid(d)[1] <0? "-.35em" :".35em";
                    })
                    .attr("dx", function (d) {
                        return labelArc.centroid(d)[0] <0? "-.35em" :".35em";
                    })
                    .text(function(d) { return d.data.genre; })
                    .transition()
                    .delay(1000)
                    .text(function (d, i) {
                        return labels[variablename][i];
                    })
                    .attr("opacity", function (d) {
                        return +d.data == 0 ? 0 : 0.8;
                    });
                /* Adds a simple line to the variable name 
 
                */
                edu.append("path")
                    .attr("class", "lineToLabel")
                    .attr("d", function (d) {
                        return "M"+arc.centroid(d)[0]+","+arc.centroid(d)[1] +"L"+(lineArc.centroid(d)[0])+","+(lineArc.centroid(d)[1])
                    } );

                var donut_info = d3.select("#" + variablename + year+ "donut")
                    .append("g")
                    .attr("id", "" + variablename + year+ "info");

                donut_info.append("circle")
                    .attr("r", 22)
                    .attr("fill", "floralwhite")
                    .attr("opacity", "0.6");

                donut_info.append("text")
                    .text(variablename)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "9.0px")
                    .attr("dy", "-0.35em")
                    .attr("text-decoration", "underline")

            });

        });


    }

    function change(country, labels) {

        /**
         * This function updates the pies when a country is clicked in the map
         */
        keys=Object.keys(country_object);
        keys.forEach(function (year) {

            d3.keys(labels).forEach(function (category){


                var newpie = d3.pie()
                    .padAngle(0.03)
                    .value(function(d) {
                        return d; })(country_object[year][country][category]);

                path = d3.select("#"+category+year+"donut");

                path.selectAll(".donutArc")
                    .data(newpie.sort(function (a, b) {
                        /* sorting is important if we want variable pie sizes later but I don't believe we will need it*/
                        return d3.ascending(a.value, b.value);
                    }))
                    .transition()
                    .duration(500)
                    .attrTween("d", arcTween)
                ;

                path.selectAll(".donutArc")
                    .on("mouseover", function(d,i) {

                        d3.select(".tooltip")
                            .html(function () {
                                /* Returns corresponding percentages and variables names to be displayed inside the tooltip */
                                var name = labels[category][i];
                                return "<strong>"+name +"</strong>"+" : " + "<span style=\"color:red\">"+Math.abs(Math.round(
                                    ((d.startAngle - d.endAngle)/(Math.PI*2))*100))
                                    +"%" +"</span>"
                            })
                            .style("left", (d3.event.pageX + 15) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style("opacity", .9);
                    });


                path.selectAll("text")
                    .data(newpie)
                    .transition()
                    .duration(750)
                    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })

                    .attr("dy", function (d) {
                        return labelArc.centroid(d)[1] <0? "-.35em" :".35em";
                    })
                    .attr("dx", function (d) {
                        return labelArc.centroid(d)[0] <0? "-.35em" :".35em";
                    })

                    .attr("opacity", function(d){
                        return d.data == 0 ? 0:0.8;
                    })
                    .transition()
                    .delay(1000);

                path.selectAll(".lineToLabel")
                    .data(newpie)
                    .transition()
                    .duration(750)
                    .attr("opacity", function (d) {
                        if (d.data==0){
                            return "0"
                        }
                    })
                    .attr("d", function (d) {
                        return "M"+arc.centroid(d)[0]+","+arc.centroid(d)[1] +"L"+(lineArc.centroid(d)[0])+","+(lineArc.centroid(d)[1])
                    } );

                var country_check = country_object[year][country][category][0] +country_object[year][country][category][1];
                var donut_info = d3.select("#" + category + year+ "info")
                    .attr("id", "" + category + year+ "info");

                donut_info.selectAll("text")
                    .transition()
                    .text(function (t) {
                        if (country_check ==0){
                            return "No Data";
                        } else {
                            return category;
                        }
                    })
                    .attr("text-decoration", "underline");

                donut_info.selectAll("circle")
                    .attr("stroke", function (t) {
                        if (country_check ==0){
                            return "black";
                        } else {
                            return "none";
                        }
                    });

                var bb=[];
                d3.select("#"+category+year+"donut")
                    .selectAll("text")
                    .each(function (d,i) {
                        bb.push(this.getBBox())


                    });

                check = [];
                bb.forEach(function (d,i) {
                })

            })


        });

        d3.select("#Education2007donut")
            .selectAll("text")
            .each(function (t,j) {
                if (j==0){
                    d3.select(this)
                        .attr("y", "20")
                }

                if (j==3 && d3.select(this).attr("y")>0){
                    d3.select(this)
                        .attr("y", "-10")
                }
            });

        d3.select("#Education2011donut")
            .selectAll("text")
            .each(function (t,j) {
                if (j==0){
                    d3.select(this)
                        .attr("y", "20")
                }

                if (j==3 && d3.select(this).attr("y")>0){
                    d3.select(this)
                        .attr("y", "-10")
                }
            })



    }

    function display_name(country_name) {
        /**
         * this function displays the name of the clicked country in the
         * pie svg on the left
         */
        d3.select('#pie_container')
            .select("text")
            .text(country_name)
            .attr("text-anchor", "middle");
    }

    function draw_map(map_data) {

        /**
         * this function draws the map of the countries
         * adding tools for hovering, names, click
         */

        var polydata = topojson.feature(map_data, map_data.objects.countries).features;
        // var neighbors = topojson.neighbors(map_data.objects.countries.geometries); 
        var names = map_data.objects.countries.geometries;

        var svg = d3.select('#europe_container')
        var width = +svg.node().getBoundingClientRect().width
        var height = +svg.node().getBoundingClientRect().height
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

        height = height - margin.top - margin.bottom;
        width = width- margin.left - margin.right;
        var g = svg.append("g")
            .attr("class", "map")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Choose projection 
        var projection = d3.geoMercator()
            .scale(500)
            .center([42, 59]);


        var path = d3.geoPath()
            .projection(projection);

        g.append("g")
            .selectAll("path")
            .attr("class", "countries")
            .data(polydata)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function (d, i) {
                // if only year or variable is selected nothing happens 
                if(names[i].name){
                    return "grey"
                }
                else {
                    return "#d3d3d3"
                }

            })
            .attr("stroke", "black")
            .attr("stroke-width", 0.1)
            .on('mouseover', function(d, i){
                if(names[i].name) {
                    d3.select(this).style('opacity', 0.5);
                }
            })
            .on('mouseout', function (d, i) {
                if (names[i].name){
                    d3.select(this).style('opacity', 1);
                }

            })

            .on("click", function (d, i) {
                if(names[i].id === d.id){
                    change(names[i].name, labels);
                    display_name(names[i].name);
                }

            });

        // add name to country 
        g.selectAll(".countries")
            .data(polydata)
            .enter().append("text")
            .attr("class", "country_font")
            .attr("transform", function(d) {return "translate(" + path.centroid(d) + ")"; })
            .attr("x", -10)
            .attr("y", 0)
            .text(function (d, i) {
                if(names[i].id === d.id){
                    return names[i].name
                }
            });

        // color scale for existance of countries 
        var color_basic = d3.scaleOrdinal()
            .domain([0, 1])
            .range(['#d3d3d3', 'grey']);

        var defs_who = d3.select("#europe_container").append("defs")
            .attr("id", "def_who");

        var defs_soc_excl = d3.select("#europe_container").append("defs")
            .attr("id", "def_soc_excl");


    }

    function update_legend(color_scale, selected_variable){

        // Append a linearGradient element to the defs and give it a unique id 
        if(selected_variable === "Social_Exclusion"){
            linearGradient = d3.select("#def_soc_excl").append("linearGradient")
                .attr("id", "linear-gradient_soc");
        } else{
            linearGradient = d3.select("#def_who").append("linearGradient")
                .attr("id", "linear-gradient_who");
        }


        // Define scales for legend axes 
        var x_scale_soc_excl = d3.scaleLinear()
            .domain([1.5, 2.9])
            .range([20, 319]);

        var x_scale_who = d3.scaleLinear()
            .domain([49, 72])
            .range([20, 319]);

        // Define x-axes 
        var x_axis_who = d3.axisBottom()
            .ticks(5)
            .scale(x_scale_who);

        var x_axis_soc = d3.axisBottom()
            .ticks(5)
            .scale(x_scale_soc_excl);

        d3.select("#europe_container").append("g")
            .attr("class", "axis_map")
            .attr("transform", "translate(" + 110 + "," + 30 + ") ")
            .append("text")
            .attr("id", "legend_text")
            .attr("y", -9)
            .attr("x", -95)
            .attr("dx", "1em")
            .style("fill", "black")
            .attr("text-anchor", "start");


    }

    function update_map(map_data, year_selection, variable_selection) {

        var names = map_data.objects.countries.geometries;

        var color_se7 = d3.scaleSequential(d3.interpolateYlGn)
            .domain([1.5, 2.9])

        var color_who7 = d3.scaleSequential(d3.interpolateOrRd)
            .domain([41, 72])

        var color_who11 = d3.scaleSequential(d3.interpolateOrRd)
            .domain([54, 72])

        var names2007 =["Iceland", "Kosovo", "Serbia", "Montenegro"];

        map = d3.select("#europe_container")
            .select(".map")
            .selectAll("path")
            .attr("fill", function (d, i) {

                if((names2007.includes(names[i].name) && year_selection==="2007") || (names[i].name==="Norway" && year_selection==="2011")){
                    return "#d3d3d3";

                } else if (names[i].name && year_selection === "2007" && variable_selection === "WHO_Index") {
                    update_legend(color_who7, variable_selection);
                    return color_who7(names[i].who7);

                } else if (names[i].name && year_selection === "2011" && variable_selection === "WHO_Index") {
                    update_legend(color_who11, variable_selection);
                    return color_who11(names[i].who11);

                } else if (names[i].name && (year_selection === "2007" && variable_selection === "Social_Exclusion")) {
                    update_legend(color_se7, variable_selection);
                    return color_se7(names[i].se7);

                } else if (names[i].name && year_selection === "2011" && variable_selection === "Social_Exclusion") {
                    update_legend(color_se7, variable_selection);
                    return color_se7(names[i].se11);

                } else if (names[i].name && year_selection != null && variable_selection == null) {
                    return "grey"

                } else {
                    return "#d3d3d3"
                }
            })
    }

    function draw_exclusion_contact(dataset){

        dataset = dataset.sort(function (a,b) {
            return d3.descending(a.Social_exclusion2011, b.Social_exclusion2011); });

                
        var svg = d3.select("#social_exclusion");
        var viewbox= svg.attribute("viewBox").split(" ")
        var size = viewbox.slice(2)
        var width = size[0]
        var height = size[1]
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

        height = height - margin.top - margin.bottom;
        width = width- margin.left - margin.right;

        var x = d3.scaleLinear().
            rangeRound([0, width]),
            y = d3.scaleLinear()
                .rangeRound([height, 0]);

        var g = svg.append("g")
            .attr("id" , "soc_exc")
            .attr("width", width)
            .attr("height",height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




        x.domain([1.4,d3.max(dataset.map(function(d) {
            return d.Social_exclusion2011; }))]);
        y.domain([10,d3.max(dataset.map(function(d) {
            return d.Social_contact2011; }))])


        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(25))
            .selectAll(".tick")
            .select("text")
            .attr("transform", "translate(0," + 10 + ")")

            .attr("text-anchor", "middle");

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y))
            .selectAll(".tick")
            .select("text")
            .attr("transform", "translate(-10," + 0 + ")")
            .attr("text-anchor", "middle");


        // add text to the X axis
        g.append("g")
            .attr("class", "xlab")
            .attr("transform", "translate(0," + height + ")")
            .append("text")
            .attr("y", margin.bottom-70)
            .attr("x", width / 2)
            .attr("dx", "1em")
            .attr("text-anchor", "middle")
            .attr("font-size", "1vw")
            .text("Social Exclusion");


        // add text to the Y axis
        g.append("g")
            .attr("class", "ylab")
            .attr("transform", "translate(0," + height/2 + ")")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",  - margin.right)
            .attr("x", 0)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .attr("font-size", "1vw")
            .text("Social Contact");



        // add title to plot
        g.append("text")
            .attr("id", "title_text")
            .style("font-family", "Lato, sans-serif")
            .attr("y", margin.top)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "1.0vw")
            .text("Social Exclusion Correlated to Social Contact - Year 2007");


        g.append("g")
            .attr("class", "points")
            .selectAll(".points")
            .data(dataset, function (d) {
                return d.Countries
            })
            .enter()
            .append("circle")
            .attr("fill", "steelblue")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.Social_exclusion2011); })
            .attr("cy", function(d) { return y(+d.Social_contact2011); });


        g.select(".points")
            .selectAll("text")
            .data(dataset, function (d) {
                return d.Countries
            })
            .enter()
            .append("text")
            .attr("class", "countryLabels")
            .text(function (d) {
                return d.Countries
            }).attr("x", function(d) { return x(d.Social_exclusion2011); })
            .attr("y", function(d) { return y(+d.Social_contact2011); })
            .attr("opacity", 0.5)

            .on("mouseover", function () {
                d3.select(this)
                    .classed("highlighted", true)
            })
            .on("mouseout", function () {
                d3.select(this)
                    .classed("highlighted", false)


            });


checker(g)

    }

    function draw_exclusion_deprivation(dataset){

        dataset_depr = dataset.sort(function (a,b) {
            return d3.descending(a.Social_exclusion2007, b.Social_exclusion2007); });

        var svg = d3.select("#social_deprivation");
        var width = +svg.node().getBoundingClientRect().width
        var height = +svg.node().getBoundingClientRect().height
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

        height = height - margin.top - margin.bottom;
        width = width- margin.left - margin.right;

        var x = d3.scaleLinear().
            rangeRound([0, width]),
            y = d3.scaleLinear()
                .rangeRound([height, 0]);

        var g = svg.append("g")
            .attr("id" , "soc_dep")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        x.domain([1.4,d3.max(dataset_depr.map(function(d) {
            return d.Social_exclusion2007; }))]);
        y.domain(d3.extent(dataset_depr.map(function(d) {
            return d.Deprivation2007; })));

        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(25))
            .selectAll(".tick")
            .select("text")
            .attr("transform", "translate(0," + 10 + ")")

            .attr("text-anchor", "middle");

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y))
            .selectAll(".tick")
            .select("text")
            .attr("transform", "translate(-10," + 0 + ")")
            .attr("text-anchor", "middle");


        // add text to the X axis 
        g.append("g")
            .attr("class", "xlab")
            .attr("transform", "translate(0," + height + ")")
            .append("text")
            .attr("y", margin.bottom-70)
            .attr("x", width / 2)
            .attr("dx", "1em")
            .attr("text-anchor", "middle")
            .attr("font-size", "1vw")
            .text("Social Exclusion");


        // add text to the Y axis 
        g.append("g")
            .attr("class", "ylab")
            .attr("transform", "translate(0," + height/2 + ")")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",  - margin.right)
            .attr("x", 0)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .attr("font-size", "1vw")
            .text("Social Deprivation");


        // add title to plot 
        g.append("text")
            .attr("id", "title_text")
            .style("font-family", "Lato, sans-serif")
            .attr("y", margin.top)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "1.0vw")
            .text("Social Exclusion Correlated to Social Deprivation - year 2007");


        g.append("g")
            .attr("class", "points")
            .selectAll(".points")
            .data(dataset, function (d) {
                return d.Countries
            })
            .enter()
            .append("circle")
            .attr("fill", "steelblue")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.Social_exclusion2007); })
            .attr("cy", function(d) { return y(+d.Deprivation2007); });


        g.select(".points")
            .selectAll("text")
            .data(dataset, function (d) {
                return d.Countries
            })
            .enter()
            .append("text")
            .attr("class", "countryLabels")
            .text(function (d) {
                return d.Countries
            }).attr("x", function(d) { return x(d.Social_exclusion2007); })
            .attr("y", function(d) { return y(+d.Deprivation2007); })
            .attr("opacity", 0.5)

            .on("mouseover", function () {
                d3.select(this)
                    .classed("highlighted", true)
            })
            .on("mouseout", function () {
                d3.select(this)
                    .classed("highlighted", false)


            });



        d3.select(".soc_depr_barplots").select(".arrow.right")
            .on("click", function () {
                update_exclusion_deprivation(dataset_depr, "2011")
            });

        d3.select(".soc_depr_barplots").select(".arrow.left")
            .on("click",function () {
                update_exclusion_deprivation(dataset_depr, "2007")
            });

        checker(g)
    }


    function update_exclusion_deprivation(dataset, year) {

        dataset_updated = dataset.sort(function (a,b) {
            return d3.descending(a["Social_exclusion"+year], b["Social_exclusion"+year]); });

        var svg = d3.select("#social_deprivation");
        var width = +svg.node().getBoundingClientRect().width
        var height = +svg.node().getBoundingClientRect().height
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

        height = height - margin.top - margin.bottom;
        width = width- margin.left - margin.right;

        var x = d3.scaleLinear().rangeRound([0, width]),
            y = d3.scaleLinear().rangeRound([height, 0]);


        x.domain([1.4,d3.max(dataset_depr.map(function(d) {
            return d["Social_exclusion"+year] ; }))]);
        y.domain(d3.extent(dataset_depr.map(function(d) {
            return d["Deprivation"+year] ; })));


        var g = d3.select("#soc_dep");

        g.select(".y-axis")
            .call(d3.axisLeft(y));

        g.select(".x-axis")
            .transition()
            .duration(1500)
            .call(d3.axisBottom(x).ticks(25));

        // add title to plot 
        g.select("#title_text")
            .style("font-family", "Lato, sans-serif")
            .attr("y", margin.top)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            .text("Social Exclusion correlated to Social Deprivation - year "  +year);

        g.selectAll("circle")
            .data(dataset_updated)
            .transition()
            .duration(500)
            .delay(function(d, i) {
                return i / 30* 1000;
            }).on("start", function() {
            d3.select(this)
                .attr("fill", "magenta")
                .attr("r", 6);
        })
            .attr("cx", function(d) {
                return x(+d["Social_exclusion" +year] );
            })
            .attr("cy", function(d) { return y(d["Deprivation"+year]); })

            .on("end", function() {
            d3.select(this)
                .attr("r", 3.5)
                .attr("fill", "steelblue")
        });


        g.select(".points")
            .selectAll("text")
            .data(dataset, function (d) {
                return d.Countries
            })
            .text(function (d) {
                return d.Countries
            })
            .transition()
            .duration(500)
            .delay(function(d, i) {
                return i / 30* 1000;
            })
            .attr("x", function(d) { return x(+d["Social_exclusion"+year]); })
            .attr("y", function(d) { return y( d["Deprivation"+year]); })
            .attr("opacity", 0.5)

            .on("mouseover", function () {
                d3.select(this)
                    .classed("highlighted", true)
            })
            .on("mouseout", function () {
                d3.select(this)
                    .classed("highlighted", false)


            });



    }

    function draw_who_gender_points(dataset){


        var svg = d3.select("#WHO_points_gender")
        var width = +svg.node().getBoundingClientRect().width
        var height = +svg.node().getBoundingClientRect().height
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

        height = height - margin.top - margin.bottom;
        width = width- margin.left - margin.right;
        
        var g = svg.append("g")
            .attr("id", "WHOgender")
            .attr("width", width)
            .attr("height",height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.scalePoint().rangeRound([0, width]).padding(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["#955251", "#004B8D"]);


        dataset = dataset.sort(function (a,b) {
            return d3.descending(+a.Who2007, +b.Who2007); });

        var data = dataset.map(function (t) {
            return {
                Country:t.Countries,
                WHO: [t.MaleWHO2007,t.FemaleWHO2007]
            }
        })

        var keys = ["MaleWHO", "FemaleWHO"];

        x.domain(dataset.map(function (d) {return d.Countries;}));
        y.domain([0, 100]);
        z.domain(keys);


var data = dataset.map(function (t) {
    return  {Country : t.Countries, WHO:[t.MaleWHO2007,t.FemaleWHO2007]}
       // WHO = [t.MaleWHO2007,t.FemaleWHO2007]}
})

            g.selectAll("#WHOgender")
                .data(keys)
                .enter()
                .append("g")
                .attr("class", function (t) {
                    return t
                })

keys.forEach(function (t,i) {

    g.select("."+t)
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {return x(d.Country);})
        .attr("cy", function (d) {

            return y( d.WHO[i]);})
        .attr("fill", function(d) {return z(t); })
        .attr('opacity', 1)
        .attr("r", 5);
})


        // add title to X axis 
        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll(".tick")
            .select("text")
            .attr("transform", "translate("+ -12.0+ "," +43.0+") " +"rotate(-90)")
            .attr("text-anchor", "middle");

        g.append("text")
            .attr("y", height +margin.bottom+margin.top+margin.bottom)
            .attr("x", width / 2)
            .attr("dx", "1em")
            .attr("text-anchor", "middle")
            .text("Countries");

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        g.append("text")
            .attr("id", "ylab")
            .attr("transform", "rotate(-90)")
            .attr("y", 50-margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("WHO Mental Well-Being Index Averages, Year: 2007")
            .attr("font-size", "12px");

        // add title to plot 
        g.append("text")
            .attr("id", "title")
            .style("font-family", "Lato, sans-serif")
            .attr("y", margin.top)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            .text("WHO Mental Well-Being Index by Gender, Year: 2007");


        d3.select(".who_points_gender").select(".arrow.right")
            .on("click", function () {
                update_WHO_gender(dataset, "2011")

            });

        d3.select(".who_points_gender").select(".arrow.left")
            .on("click", function () {
                update_WHO_gender(dataset, "2007")

            });

        legend = svg.append("g")
            .attr("class", "legend" );

        legend.append('rect')
            .attr("x", width - margin.left-1)
            .attr("y", margin.top -27)
            .attr("width", 80)
            .attr("height", 40)
            .attr("fill", "white")
            .attr("background-color", "none");

        legend.append('rect')
            .attr("x", width - margin.left)
            .attr("y", margin.top)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill",  "steelblue");

        legend.append("text")
            .attr("x", width - margin.left +10)
            .attr("y", margin.top+10)
            .text("Female");

        legend.append('rect')
            .attr("x", width - margin.left)
            .attr("y", margin.top -20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill",  "#a05d56");

        legend.append("text")
            .attr("x", width - margin.left +10)
            .attr("y", margin.top -10)
            .text("Male")


    }

    function update_WHO_gender(dataset ,year){


        var data = dataset.map(function (t) {
            return  {Country : t.Countries, WHO:[t["MaleWHO"+year],t["FemaleWHO"+year]]}
            // WHO = [t.MaleWHO2007,t.FemaleWHO2007]}
        })

        var svg = d3.select("#WHO_points_gender")
        var width = +svg.node().getBoundingClientRect().width
        var height = +svg.node().getBoundingClientRect().height
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

        height = height - margin.top - margin.bottom;
        width = width- margin.left - margin.right;

        var g = svg.select("#WHOgender");

        var x = d3.scalePoint().rangeRound([0, width]).padding(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["#955251", "#004B8D"]);


        dataset = dataset.sort(function (a,b) {
            return d3.descending(+a["Who"+year], +b["Who"+year]); });


        var keys = ["MaleWHO", "FemaleWHO"];


        x.domain(dataset.map(function (d) {return d.Countries;}));
        y.domain([0, 100]);
        z.domain(keys);



        keys.forEach(function (t,i) {

            g.select("."+t)
                .selectAll("circle")
                .data(data)
                .transition()
                .duration(200)
                .attr("cx", 0)
                .attr("cy", height)
                .transition()
                .delay(function(d, i) {
                    return i / 100* 1000;
                })
                .ease(d3.easeLinear)
                .attr("cx", function (d) {return x(d.Country);})
                .attr("cy", function (d) {
                    return y(d.WHO[i]);})

        });


        g.select(".y-axis")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(d3.axisLeft(y));
        g.select(".x-axis")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(d3.axisBottom(x));

        // add title to plot 
        g.select("#ylab")
            .text("WHO Mental Well-Being Index Averages, Year: "+year);
        g.select("#title")
            .text("WHO Mental Well-Being Index by Gender, Year: "+year);


    }


    function draw_who_age_points(dataset){

        var svg = d3.select("#WHO_points_age")
        var width = +svg.node().getBoundingClientRect().width
        var height = +svg.node().getBoundingClientRect().height
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

        height = height - margin.top - margin.bottom;
        width = width- margin.left - margin.right;


        var g = svg.append("g")
            .attr("id", "WHOage")
            .attr("width", width)
            .attr("height",height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scalePoint().rangeRound([0, width]).padding(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["#fef0d9",
"#fdcc8a",
"#fc8d59",
"#e34a33",
"#b30000"]);


        x.domain(dataset.map(function (d) {return d.Countries;}));

        var data = dataset.map(function (t) {
            return {
                Country:t.Countries,
                WHO: [t.a18to24WHO_2007,t.a25to34WHO_2007,t.a35to49WHO_2007,t.a50to64WHO_2007,t.a64WHO_2007]
            }
        })


        var keys = ["a18to24WHO_", "a25to34WHO_","a35to49WHO_","a50to64WHO_","a64WHO_"];


        x.domain(dataset.map(function (d) {return d.Countries;}));
        y.domain([0, 120]);

        z.domain(keys);

        dataset = dataset.sort(function (a,b) {
            return d3.descending(+a["Who2007"], +b["Who2007"]); });

        var cake = []
        var cakes= []
        dataset.forEach(function (t) {

            cake.push({Country:t.Countries, group:"a18to24WHO_", val: t.a18to24WHO_2007})
            cake.push({Country:t.Countries, group:"a25to34WHO_", val: t.a25to34WHO_2007})
            cake.push({Country:t.Countries, group:"a35to49WHO_", val: t.a35to49WHO_2007})
            cake.push({Country:t.Countries, group:"a50to64WHO_", val: t.a50to64WHO_2007})
            cake.push({Country:t.Countries, group:"a64WHO_", val: t.a64WHO_2007})


            values = [
                [t.Countries, t.a25to34WHO_2007],
                [t.Countries, t.a18to24WHO_2007],
                [t.Countries, t.a35to49WHO_2007],
                [t.Countries, t.a50to64WHO_2007],
                [t.Countries, t.a64WHO_2007]
            ];

            cakes.push({Country:t.Countries, val:values})

            var maxmin = d3.extent(values, function (d) {
                return d[1]
            });

            twos = [[t.Countries, maxmin[0]], [t.Countries, maxmin[1]]];

            var line = d3.line()
                .x(function(d) {
                    return x(d[0]); })
                .y(function(d) { return y(d[1]); });

            svg.select("#WHOage")
                .append("g")
                .attr("class", function () {
                    if (t.Countries =="United Kingdom") {
                        return "agelineUK"
                    }  else if (t.Countries == "Czech Republic"){
                        return "agelineCR"
                    } else {
                        return "ageline" +t.Countries
                    }})
                .append("path")
                .attr("class", "line")
                .data([twos])
                .attr("d", line);

        });


keys.forEach(function (group,i) {
    g.append("g")
        .attr("class",group)
        .selectAll(".circles")
        .data(cakes, function (d,i) {
            return d.Country
        })
        .enter()
        .append("circle")
        .attr("cx", function (d) {

            return  x(d.Country);

        })
        .attr("cy", function (d) {
            return y( d.val[i][1]);})
        .attr("fill", function(d) {return z(group); })
        .attr('opacity', 1)
        .attr("r", 5);

})


        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll(".tick")
            .select("text")
            .attr("transform", "translate("+ -12.0+ "," +43.0+") " +"rotate(-90)")
            .attr("text-anchor", "middle");

        g.append("text")
            .attr("y", height +margin.bottom+margin.top+margin.bottom)
            .attr("x", width / 2)
            .attr("dx", "1em")
            .attr("text-anchor", "middle")
            .text("Countries");

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        g.append("text")
            .attr("id", "ylab")
            .attr("transform", "rotate(-90)")
            .attr("y", 50 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("WHO Mental Well-Being Averages")
            .attr("font-size", "12px");

        // add title to plot 
        g.append("text")
            .attr("id", "title")
            .style("font-family", "Lato, sans-serif")
            .attr("y", margin.top)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            .text("Mental Well-Being Index by Age Group, Year: 2007");


        d3.select(".who_points_age").select(".arrow.right")
            .on("click", function () {
                update_WHO_age(dataset, "2011")

            });

        d3.select(".who_points_age").select(".arrow.left")
            .on("click", function () {
                update_WHO_age(dataset, "2007")

            });


        legend = svg.append("g")
            .attr("class", "legend" );

        groups = ["18 to 24", "25 to 34", "35 to 49", "50 to 64", "64+"];

        keys.forEach(function (t,i) {
            legend.append('rect')
                .attr("x", width - margin.left-1)
                .attr("y", margin.top-12 +20*i)
                .attr("width", 64)
                .attr("height", 36)
                .attr("fill", "white")
                .attr("background-color", "none");

            legend.append('rect')
                .attr("x", width - margin.left)
                .attr("y", margin.top +20*i)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill",  z(t));


            legend.append("text")
                .attr("x", width - margin.left +12)
                .attr("y", margin.top +8+ +20*i)
                .attr("font-size", "12px")
                .text(groups[i])
        })

    }

    function update_WHO_age (dataset, year){
        var svg = d3.select("#WHO_points_age")
        var width = +svg.node().getBoundingClientRect().width
        var height = +svg.node().getBoundingClientRect().height
        var margin = {top: 0.05*height, right: 0.1*width, bottom:0.05*height, left: 0.1*width};

        height = height - margin.top - margin.bottom;
        width = width- margin.left - margin.right;

        var g = svg.select("#WHOage");

        var x = d3.scalePoint()
            .rangeRound([0, width])
            .padding(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        dataset = dataset.sort(function (a,b) {
            return d3.descending(+a["Who"+year], +b["Who"+year]); });

        var keys = ["a18to24WHO_", "a25to34WHO_","a35to49WHO_","a50to64WHO_","a64WHO_"];

        var data = dataset.map(function (t) {
            return {
                Country:t.Countries,
                WHO: [t["a18to24WHO_"+year],t["a25to34WHO_"+year],t["a35to49WHO_"+year],t["a50to64WHO_"+year],t["a64WHO_"+year]]
            }
        })

        x.domain(dataset.map(function (d) {return d.Countries;}));
        y.domain([0, 120]);


        var cake = []
var cakes =[]
        dataset.forEach(function (t) {

            cake.push({Country:t.Countries, group:"a18to24WHO_", val: t["a18to24WHO_"+year]})
            cake.push({Country:t.Countries, group:"a25to34WHO_", val: t["a25to34WHO_"+year]})
            cake.push({Country:t.Countries, group:"a35to49WHO_", val: t["a35to49WHO_"+year]})
            cake.push({Country:t.Countries, group:"a50to64WHO_", val: t["a50to64WHO_"+year]})
            cake.push({Country:t.Countries, group:"a64WHO_", val: t["a64WHO_"+year]})

            values = [
                [t.Countries, t["a18to24WHO_"+year]],
                [t.Countries, t["a25to34WHO_"+year]],
                [t.Countries, t["a35to49WHO_"+year]],
                [t.Countries, t["a50to64WHO_"+year]],
                [t.Countries, t["a64WHO_"+year]]
            ];

            cakes.push({Country:t.Countries, val:values})

            var maxmin = d3.extent(values, function (d) {
                return d[1]
            });

            var line = d3.line()
                .x(function(d) {
                    return x(d[0]); })
                .y(function(d) { return y(d[1]); });


            if (t.Countries =="United Kingdom") {
                var selector= ".agelineUK"
            }  else if (t.Countries == "Czech Republic"){
                var selector= ".agelineCR"
            } else {
                var selector= ".ageline" +t.Countries
            }

            twos = [maxmin[0], maxmin[1]];

            svg.select("#WHOage")
                .select(selector)
                .select("path")
                .data([twos], function () {
                    return
                })
                .transition()
                .duration(1100)
                .ease(d3.easeLinear)
                .attr("d", function (ggg) {
                    return 'M ' +x(t.Countries) +' '+y(ggg[0]) + ' V ' +y(ggg[1])+''
                })


        });

        g.select(".x-axis")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(d3.axisBottom(x));

        g.select("#ylab")
            .text("Mental Well-Being Index Averages, Year: " +year);

        g.select("#title")
            .text("Mental Well-Being Index by Age Group, Year: "+year);


        keys.forEach(function (group,i) {
            g.select("."+group)
                .selectAll("circle")
                .data(cakes, function (d) {
                    return d.Country
                })
                .transition()
                .duration(200)
                .delay(function(d, i) {
                    return ((i+1) / 30)* 1000;
                })
                .ease(d3.easeLinear)
                .attr("cx", function (d) {

                    return  x(d.Country);

                })
                .attr("cy", function (d) {
                    return y( d.val[i][1]);})


        })

    }

}
 
