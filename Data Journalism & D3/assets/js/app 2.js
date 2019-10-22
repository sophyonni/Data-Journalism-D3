// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3 
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

var chartGroup = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .classed("chart", true);

var chosenYAxis = "healthcare";
function yScale(stateData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenYAxis]),
            d3.max(stateData, d => d[chosenYAxis])
        ])
        .range([height, 0]);
    return yLinearScale;
};

var chosenXAxis = "poverty";

function xScale(stateData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]),
            d3.max(stateData, d => d[chosenXAxis])
        ])
        .range([0, width]);
    
    return xLinearScale;
};

function renderXAxes(newXScale, XAxis) {
    var bottomAxis = d3.axisBottom(newXScale)
    XAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return XAxis;
}

function renderYAxes(newYScale, YAxis) {
    var leftAxis = d3.axisLeft(newYScale)
    YAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return YAxis;
};

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
                .duration(1000)
                .attr("cx", d => newXScale(d[chosenXAxis]))
                .attr("cy", d => newYScale(d[chosenYAxis]));
    
    return circlesGroup;
};
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    console.log("Success")
    textGroup.transition()
                .duration(1000)
                .attr("x", d => newXScale(d[chosenXAxis]))
                .attr("y", d => newYScale(d[chosenYAxis]));
    return textGroup;
};


function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty: ";
    } else if (chosenXAxis === "age") {
        var xlabel = "Age: ";
    } else if (chosenXAxis === "income"){
        var xlabel = "Household Income";
    }
    if (chosenYAxis === "healthcare") {
        var ylabel = "Healthcare: "
    } else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes: "
    } else if (chosenYAxis === "obesity") {
        var ylabel = "Obesity: "
    }

    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
        return (`${d.state} <hr> ${xlabel}: ${d[chosenXAxis]} ${ylabel}: ${d[chosenYAxis]}`)
    });
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return circlesGroup;
}
                



d3.csv("assets/data/data.csv").then(function(stateData) {
    // if (err) throw err;
    console.log(stateData)
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });

    var yLinearScale = yScale(stateData, chosenYAxis);
    var xLinearScale = xScale(stateData, chosenXAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var XAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis)
    var YAxis = chartGroup.append("g")
                .classed("y-axis", true)
                .call(leftAxis)
    
    var circlesGroup = chartGroup.selectAll("circle")
                        .data(stateData)
                        .enter()
                        .append("circle")
                        .attr("cx", d => xLinearScale(d[chosenXAxis]))
                        .attr("cy", d => yLinearScale(d[chosenYAxis]))
                        .attr("r", 15)
                        .attr("fill", "blue")
                        .attr("opacity", ".5");
                        
    var textGroup = chartGroup.selectAll("text")
                        .data(stateData)
                        .enter()
                        .append("text")
                        .attr("x",d => xLinearScale(d[chosenXAxis]))
                        .attr("y", d => yLinearScale(d[chosenYAxis]))
                        .text(d => d.abbr)
                        .classed("stateText", true)
                        

    var xlabelsGroup = chartGroup.append("g")
                        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var ylabelsGroup = chartGroup.append("g")
                        .classed("axis-text", true)
                        .attr("transform", "rotate(-90)")

    var povertyLabel = xlabelsGroup.append("text")
                        .attr("x", 0)
                        .attr("y", 20)
                        .attr("value", "poverty")
                        .classed("active", true)
                        .text("Poverty");
    var ageLabel = xlabelsGroup.append("text")
                        .attr("x", 0)
                        .attr("y", 40)
                        .attr("value", "age")
                        .classed("inactive", true)
                        .text("Age");
    var incomeLabel = xlabelsGroup.append("text")
                        .attr("x", 0)
                        .attr("y", 60)
                        .attr("value", "income")
                        .classed("inactive", true)
                        .text("Income");                     

    var healthcareLabel = ylabelsGroup.append("text")
                        
                        .attr("y", 0 - (margin.left / 1.75))
                        .attr("x", 0 - (height / 2))
                        .attr("dy", "1em")
                        .attr("value", "healthcare")
                        .classed("active", true)
                        .text("Healthcare"
                        )

    var smokesLabel = ylabelsGroup.append("text")
                    
                    .attr("y", 0 - (margin.left)/ 1.25)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .attr("value", "smokes")
                    .classed("inactive", true)
                    .text("Smokes"
                    )

    var obesityLabel = ylabelsGroup.append("text")
                
                .attr("y", 0 - (margin.left))
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("value", "obesity")
                .classed("inactive", true)
                .text("Obesity")
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup)

    xlabelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value != chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(stateData, chosenXAxis);
                XAxis = renderXAxes(xLinearScale, XAxis);
                circlesGroup =renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                textGroup = renderText(textGroup, circlesGroup)
                if (chosenXAxis === "poverty") {
                    povertyLabel
                    .classed("active", true)
                    .classed("inactive", false)
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true)
                    incomeLabel
                    .classed("active", false)
                    .classed("inactive", true)
                } else if (chosenXAxis === "age") {
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true)
                    ageLabel
                    .classed("active", true)
                    .classed("inactive", false)
                    incomeLabel
                    .classed("active", false)
                    .classed("inactive", true)
                } else if (chosenXAxis === "income"){
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true)
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true)
                    incomeLabel
                    .classed("active", true)
                    .classed("inactive", false)
                }
            }
        })
        ylabelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value != chosenYAxis) {
                chosenYAxis = value;
                yLinearScale = yScale(stateData, chosenYAxis);
                YAxis = renderYAxes(yLinearScale, YAxis);
                circlesGroup =renderCircles(circlesGroup, yLinearScale, chosenYAxis);
                circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
                textGroup = renderText(textGroup, circlesGroup)
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false)
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true)
                    incomeLabel
                    .classed("active", false)
                    .classed("inactive", true)
                } else if (chosenYAxis === "age") {
                    smokesLabel
                    .classed("active", false)
                    .classed("inactive", true)
                    ageLabel
                    .classed("active", true)
                    .classed("inactive", false)
                    incomeLabel
                    .classed("active", false)
                    .classed("inactive", true)
                } else if (chosenYAxis === "obestiy") {
                    obesityLabel
                    .classed("active", false)
                    .classed("inactive", true)
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true)
                    incomeLabel
                    .classed("active", true)
                    .classed("inactive", false)
                }
            }
        })
})