// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 50},
width = 800 - margin.left - margin.right,
height = 350 - margin.top - margin.bottom;

// create the tooltip
var divTooltip = d3.select("#allan-graph1").append("div")
.attr("class", "toolTip")
.style('opacity', 0);

// append the svg object to the body of the page
var svg = d3.select("#allan-graph1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("../DataSets/Dataset1Sliced.csv", function(data) {
    var subgroups = data.columns;
    var groups = d3.map(data, function(d){return(d.ParEd)}).keys();

    // Add X axis
    var x = d3.scaleBand().domain(groups).range([0,width]).padding([0.1]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

    // Label for x axis
    svg.append("text")             
    .attr("transform","translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .style("text-anchor", "middle")
    .text("Parent Education")
    .style("fill", "white");

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 50]).range([height,0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Label for y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text("Subject Total");  

    // Another scale for subgroup position
    var xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05]);

    // color palette
    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#050F30", "#7eb0d5", "#B1D4E0", "#2E8BC0", "#0C2D48", "#145DA0"]);

    // Add zoom on the graph
    let zoom = d3.zoom()
    .scaleExtent([0.8,1.2])
    .translateExtent([[0, 0], [width - 300, height]])
    .on('zoom', handleZoom);

    function handleZoom(e) {
        d3.select('svg').attr('transform', d3.event.transform);
    }

    svg.call(zoom);

    // Show the bars
    svg.append("g")
    .selectAll("g")
    .data(data).enter().append("g")
    .attr("transform", function(d) { return "translate(" + x(d.ParEd) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr("x", function(d) { return xSubgroup(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function(d) { return height - y(d.value); })
    .attr("fill", function(d) { return color(d.key); })
    .on("mouseover", function(d){
        divTooltip.transition()
        .duration(200)
        .style("opacity", .9);
        var elements = document.querySelectorAll(':hover');
        l = elements.length
        l -=1
        elementData = elements[l].__data__;
        var activeBar = window.activeBar = elements[l];
        divTooltip.html(elementData.key + "<br>Score: " + elementData.value)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d){
        divTooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });

})