d3.select(window).on('load', init);


function init(){

    d3.json("trump_family.json", function(error, graph) {
        if (error) throw error;
        draw_svg(graph);

    });
}

function draw_svg(data){
    var empty = { name: "", no_parent: true, hidden: true}; //empty node that will be deleted later
    // (used to properly add spaces between adjacent partner nodes)

    var svg = d3.select('#family_tree'),
        margin = {top: 10, right: 500, bottom: 10, left: 150},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.bottom - margin.top;


    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([height, width])
        .separation(function separation(a, b) {
            return a.parent === b.parent ? 0.1 : 0.1; //adds a space between siblings
        });

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(data, function(d) {
        if  ("partners" in d) {
            d.partners.push(empty) //if partners exits, then add the empty object. This is done in anticipation of overlap
            //issues when pushing the partner nodes BACK in line with their spouses
        }
        return (d.children || d.partners)}
    );

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // adds the links between the nodes
    g.selectAll(".link")
        .data(nodes.links())
        .enter().append("path")
        .style("stroke-width", 3)
        .attr("class", "link")
        .attr("d", function(d) {
            if(("partners" in d.source.data) && (d.source.data.name !== "Donald Trump")){
                d.target.y = d.source.y
            }
            if (d.target.data.no_parent===true){
                //  checks if the target is the empty node. If it is, then it is to be made invisible
                return "M0,0L0,0"
            } else {
                // Push back the partners to be inline with their spouses as our tree structure has
                // delineated spouses as children (in other words: we are pushing children nodes marked as partners back to the
                // same depth as their spouses while maintaining separation via the "hidden" node)
                return "M" + d.source.y + "," + d.source.x
                    + "H"  + d.source.y + "," +(d.source.y +(d.target.y-d.source.y)/2)
                    + "V" + d.target.x
                    // + "H" + (d.target.y-d.source.y)/2
                    + "H" + (d.source.y +(d.target.y-d.source.y)/2) + "," + d.target.y;
            }
        });


    var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append('g')
        .attr("class", function(d) {
            return "node" +
                (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")"; })
        .attr("display", function(d){ // check if the hidden attribute is set in the object to identify our (soon to be made by returning "none") hidden object
            if ("hidden" in d.data){
                return "none"
            }
            return ""
        });

    //places an empty text element (shaped as a tooltip) with 0 opacity under the div.fam_tree (apparently, appending
    // text inside the svg itself causes the svg style to override some of the CSS styles we need for borders and background
    // of the tooltip, so it has to be on the html body itself...)

    var tooltips = d3.select("#fam_tree").append("text") //the styles are in the CSS under div.tooltip
        .attr("class", "tooltip")
        .attr("opacity", 0);

    var original_radius = 16;

    //setting up an initial pattern that could POTENTIALLY befilled uniquely for each member of the family in the "fill" attribute of the circles
    // for now, we set male/female to each individual
    svg.append("defs")
        .attr("id", "mdef")
        .selectAll("pattern")
        .data(nodes.descendants())
        .enter()
        .append("pattern")
        .attr('id', function(d){return d.data.name.replace(/ /g,'')}) // regex here is because element IDs CANNOT have whitespace, so they are removed
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 30)
        .attr('width', 30)
        .append("image")
        .attr("x", 4)
        .attr("y", 4)
        .attr('height', function(d){
            if (d.data.name==='Donald Trump'){
                return 26
            } else return 23
        })
        .attr('width', function(d){
            if (d.data.name==='Donald Trump'){
                return 26
            } else return 23
        })

        .attr("x-link:href", function(d) { // images for gender are referenced here. We could instead assign unique images to each one of
            // these buffoons; a short gif is included for trump to illustrate this.
            if (d.data.name === "Donald Trump") {
                return "donald_trump.jpg"
            }
            if (d.data.sex === 'F') {
                return "female.png"
            } else {
                return "male.png"
            }
        });


    node.append("circle")
        .attr("r", original_radius)
        .attr("stroke", function(d){
            if(d.data.is_family === 'wife'){
                return "deeppink"
            } else if (d.data.is_family === 'child') {
                return "mediumblue"
            } else if (d.data.is_family === 'root') {
                return "black"
            } else if (d.data.is_family === 'grandchild'){
                return 'green'
            } else return "deepskyblue"
        })
        .style("fill", function(d){ // the style references the pattern that we set above by name
                return "url(#"+d.data.name.replace(/ /g,'')+")"})
            .on("mouseover", function(d) {
                    // Highlights text and nodes and sets attributes (stroke, radius and position)
                    d3.select(this) //selects the current circle, binds a transition function to it and its associated attributes
                        .transition()
                        .ease(d3.easeCubic)
                        .attr("r", original_radius+5)
                        .attr("stroke", "orange");
                    d3.select("#"+d.data.name.replace(/[\W_]/g,'')) // selects the pattern and image that will be resized
                        .transition()
                        .ease(d3.easeCubic)
                        .select("image")
                        .attr('height', 28)
                        .attr('width', 28)
                        .attr("x", 6)
                        .attr("y", 6);

                d3.select(this.parentNode)
                    .select("text") // this.parentNode will select the "g" element that groups our circle+text (as defined
                    // in the "node" variable above. We do this so we can select the associated text directly and modify it by binding a transition
                    //function to it as we did for circles
                        .transition()
                    .ease(d3.easeCubic)
                    .attr("x", 60)
                    .attr("y", -20);

                    // Set the actual text and position and opacity to 0.9
                    tooltips
                        .style("opacity", .9)
                        .style("left", d.y+180+"px")
                        .style("top", d.x+24+"px" )
                        .text(d.data.dob ? d.data.dob: "No info");
                })

                    .on("mouseout", function(d) {
                        // moving object to original positions
                        d3.select("#"+d.data.name.replace(/[\W_]/g,''))
                            .transition()
                            .ease(d3.easeCubic)
                            .select("image")
                            .attr('height', 23)
                            .attr('width', 23)
                            .attr("x", 4)
                            .attr("y", 4);

                        d3.select(this)
                            .transition()
                            .ease(d3.easeCubic)
                            .attr("stroke", function(d){
                                if(d.data.is_family === 'wife'){
                                    return "deeppink"
                                } else if(d.data.is_family === 'child'){
                                    return "mediumblue"
                                } else if(d.data.is_family === 'root'){
                                    return "black"
                                } return "deepskyblue"
                            })
                            .attr("r", original_radius);

                        d3.select(this.parentNode).select("text")
                            .transition()
                            .attr("fill", "black")
                            .attr("x", 0)
                            .attr("y", 0);
                        tooltips.style("opacity", 0.0);
                    })

                .on("click", function(d){
                    if (d.data.url){
                        dblclick(d.data.url)
                    }
                });

                // Adding the text names
                node.append("text")
                    .attr("dy", "-0.3em")
                    .attr("dx", "-1.5em")
                    .style("text-anchor", "end")
                    .text(function(d) {return d.data.name;});

                function dblclick(url){
                    window.open(url);
                }

    var legend = g.append("g")
        .attr("transform","translate(-1050,10)")
        .style("font-size","12px")
        .attr("class", "legend");

    var colors = ["black", "deeppink", "mediumblue", "deepskyblue", "green"];
    var legend_text = ["Donald Trump", "Donald's wife", "Donald's direct children", "Non-blood-relatives", "Grandchildren"];

    for (var i = 0; i < colors.length; i++) {
        legend.append("circle")
            .attr("r", 10)
            .attr("cx", width - 10)
            .attr("cy", 29  + i*35)
            .attr("fill", "none")
            .style("stroke", colors[i])
            .attr("stroke-width", 2);
    }

    legend.append("rect")
        .attr("x", 925)
        .attr("y", 10)
        .attr("width", 250)
        .attr("height", 180)
        .attr("fill", "none")
        .attr("stroke", "grey");

    for (i=0; i < legend_text.length; i++){
        legend.append("text")
            .style("font-family", "Lato, sans-serif")
            .style("font-size", 13)
            .attr("x", width+9)
            .attr("y", 34 + i*35)
            .text(legend_text[i]);
    }
}
