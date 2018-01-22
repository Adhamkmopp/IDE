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
        margin = {top: 10, right: 120, bottom: 10, left: 120},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.bottom - margin.top;


    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([height, width])
        .separation(function separation(a, b) {
            return a.parent === b.parent ? 0.2 : 0.1; //adds a space between siblings
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
    var link = g.selectAll(".link")
        .data(nodes.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
        if(("partners" in d.source.data) && (d.source.data.name !== "Donald Trump")){
        d.target.y = d.source.y}
         if (d.target.data.no_parent===true){
            //  checks if the target is the empty node. If it is, then it is to be made invisible
                return "M0,0L0,0"
            } else{
            // the block below pushes back the partners to be inline with their spouses as our tree structure has
                //delineated spouses as children ( put another way, we are pushing children nodes marked as partners back to the
                // same depth as their spouses while maintaining seperation via the "hidden" node
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


// This adds a small circle with the wikipedia logo that currently does absolutely nothing
    var original_radius = 15;

    node.append("circle")
        .attr("r", original_radius)
        .attr("stroke", function(d){
            if(d.data.is_family === 'wife'){
                return "pink"
            } else if(d.data.is_family === 'child'){
                return "darkblue"
            } else if(d.data.is_family === 'root'){
                return "black"
            } return "lightblue"
        })
        .on("mouseover", function(d) {
                // Highlights text and nodes and sets attributes (stroke, radius and position)
            d3.select(this) //selects the current circle, binds a transition function to it and its associated attributes
                .transition()
                .ease(d3.easeCubic)
                .attr("r", 12)
                .attr("stroke", "orange");

            d3.select(this.parentNode).select("text") // this.parentNode will select the "g" element that groups our circle+text (as defined
            // in the "node" variable above. We do this so we can select the associated text directly and modify it by binding a transition
            //function to it as we did for circles
                .transition()
                .attr("x", function(d) { return 60})
                .attr("y", function(d) { return -20});

            // sets the actual text and position and opacity to 0.9 *NO transitions this time. too many transitions end up
            //interrupting one another breaking the animation
            tooltips
                .style("opacity", .9)
                .style("left", d.y+120+"px")
                .style("top", d.x+40+"px" )
                .text(d.data.dob ? d.data.dob: "No info");
            })

        .on("mouseout", function(d) {
            //putting everything back to how it was
            d3.select(this)
                .transition()
                .ease(d3.easeCubic)
                .attr("stroke", "steelblue")
                .attr("r", original_radius);

            tooltips.style("opacity", 0.0);

            d3.select(this.parentNode).select("text")
                .transition()
                .attr("fill", "black")
                .attr("x", function(d) { return 20})
                .attr("y", function(d) { return 0})

        });



    node.append("image")
        .attr("xlink:href", function(d){
            if(d.data.sex === 'F'){
                return "female.png"
            } return "male.png"
        })
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 16)
        .attr("height", 16)
        .on("click", function(d){
            if (d.data.url){
                dblclick(d.data.url)
            }
        });

    node.append("text")
        .attr("dy", "-0.3em")
        .attr("dx", "-1.5em")
        .style("text-anchor", "end")
        .text(function(d) {return d.data.name;});

        //node.append("ellipse")
    //  .attr("ry", 15)
    //  .attr("rx", function(d){
    //      return compute_radius(d.data.name)
    //  });
//
    //      d3.selectAll("ellipse")
    //      .on("mouseover", function(d) {
    //          // Why is this not working..?
    //         d3.select(this).attr("opacity", "0.5");
    //          svg.append("text")
    //                  .attr("id", "tooltip")
    //                  .attr("x", d.y +230)
    //                  .attr("y", d.x +20)
    //                  .attr("text-anchor", "middle")
    //                  .attr("font-family", "sans-serif")
    //                  .attr("font-size", "11px")
    //                  .attr("font-weight", "bold")
    //                  .attr("fill", "black")
    //                  .text(d.data.dob ? d.data.dob:"No info");
    //      })
//       .on("mouseout", function() {
    //        d3.select("#tooltip").remove();
    //          d3.select(this).attr("opacity", 1.0);
    //      })
    //      .on("click", function(d){
    //          if (d.data.url){
    //              dblclick(d.data.url)
    //          }
    //      });


    function compute_radius(name){
        return (name.length*2)+30
    }

    function dblclick(url){
        window.open(url);
    }

}
