d3.select(window).on('load', init);


function init(){
    d3.select('table')
        .selectAll('td')
        .style('background-color',
            function(d) {
                if (this.innerText === "42")
                    return "lightgreen";
                else
                    return "none";
            })
}

// apply function to each element selected
function init_2(){
    d3.select('table')
        .selectAll('td')
        .each(function(e) {
                if (this.innerText === "42")
                    this.style.backgroundColor = "red";
            }
        );
}


function init_3(){
    d3.selectAll('th')
        .style('color', 'blue');
}

d3.select(window).on('load', fill_in_table);

function fill_in_table(){
    var hhdata = [
        {'name':'Arthur Dent', 'age':42, 'species':'Human'},
        {'name':'Ford Prefect', 'age':133, 'species':'Betelgeusian'},
        {'name':'Zaphod Beeblebrox', 'age':151, 'species':'Betelgeusian'}
    ];

d3.selectAll('#second_table')
    .append('tbody')
    .selectAll('tr')
    .data(hhdata)
    .enter() // with the data that we already have append to those data a tr element and stuff
    .append('tr')
    .html(function(d, i){ // the append is done for each column
        return '<td>' + d.name + '</td>' +
            '<td>' + d.age + '</td>' +
            '<td>' + d.species + '</td>';
    });
}

d3.select(window).on('load', show_list);

function show_list() {
    var my_data = [1,2,3,4,5,6,7,8,9,10];

    d3.select('ul')
        .selectAll('li')
        .data(my_data)
        .enter()
        .append('li')
        .text(function(d){
            return d
        })
}

d3.select(window).on('load', draw_points);


var coordinates = [[100, 237, 4], [217, 132, 5], [160, 110, 7], [106, 123, 8]]

function draw_points() {
    d3.select('#plotarea')
        .selectAll("circles")
        .data(coordinates)
        .enter()
        .append("circle")
        .attr("r", function(d){return""+d[2]+"px";})
        .attr("cx", function(d){return""+d[0]+"px";})
        .attr("cy", function(d){return""+d[1]+"px";})

}