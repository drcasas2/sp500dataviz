import * as d3 from "d3";
import {useState, useEffect, useRef} from "react"
import styles from './AreaGraph.module.css';

const AreaGraph = ({months, revenueData, parseMonths, data}) => {
    const ref = useRef();

    useEffect(() => {

    if (data) {
        const dates = Object.keys(data['Monthly Adjusted Time Series']); // Get an array of dates
        const values = dates.map(date => data['Monthly Adjusted Time Series'][date]['5. adjusted close']); // Get an array of adjusted close values for each date
        console.log('Dates:', dates);
        console.log('Values:', values);
        // Continue with your D3.js chart creation using dates and values
    }

    const canvas = d3.select(ref.current)

    const svg = canvas.append("svg")
                .attr("width", 700)
                .attr("height", 650);

    const margin = {top:20, right: 20, bottom: 20, left: 50};
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    const mainCanvas = svg.append('g')
                    .attr('width', graphWidth)
                    .attr('height', graphHeight)
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //Set the ranges and domains
    var x = d3.scaleTime()
                        .domain(d3.extent(months, (d) => parseMonths(d))) //The domain sets the data that will be used for the axis in question. Since we're talking about the x axis, we are using months. d3.extent returns an array with the minimum and maximum values of an array you passed in. parseMonths(d) in this line of code takes in the months from the function, sets it equal to the varible "d", and then sends it to the parseMonths function above, where it takes each month and turns it into an abbreviated month designation. The d3.extent knows that January is minimum and December is maximum, because the parseMonths function above has a timeParse method that converts the months array of strings into a time format, so the method knows the min and max of the months in a year. And for the domain, you need to know what the minimum and maximum of the data is.
                        .range([0, graphWidth])


    var y = d3.scaleLinear()
                        .range([graphHeight, 0])
                        .domain([0, d3.max(revenueData, (d) => d)]) //The domain sets the data that will be used for the axis in question. Since we're talking about the y axis, it's revenueData

    var areaChart = d3.area()  //This function connects the x values/scale with the y values.
                        .x(function (d, i) {
                        console.log("dates", x(parseMonths(months[i])))
                        return x(parseMonths(months[i]))//Took the months array, turned it into a time format, and then only took the month data from that new formatted months data by using the function parseMonths, and then scaled it along the x axis using the function x() which scales the time format from minimum to maximum across the graphWidth
                        })
                        .y0(graphHeight)
                        .y1((d, i) => graphHeight - d) //since all DOMs start at upper left as (0,0), and down and to the right are positive values, you need to take the graph height and then subtrack the d (which is revenueData) to get the points on the graph.
    //We want to create a line that goes along the area we created
    //First, We Define The Graph Line
    var valueLine = d3.line()
                        .x(function(d, i) { return x(parseMonths(months[i]))})
                        .y(function(d, i) {return y(d)})

    //Next, We create the line we just defined in valueLine
    mainCanvas.append("path")
                        .data([revenueData])
                        .attr("class", styles.line)
                        .attr("d", valueLine) //"d" draws the line

    //This code below created the original area graph. It's orange in the js, but we changed it to blue in the CSS file. CSS overides the JS styles.
    mainCanvas.append("path")
                        .attr("fill", "orange")
                        .attr("class", styles.area)
                        .attr("d", areaChart(revenueData))
    //Circles
    var circles = mainCanvas.selectAll("circle")
                        .data(revenueData)
                        .enter()
                        .append("circle")
                        .attr("class", styles.circle)
                        .attr("cx", (d, i) => x(parseMonths(months[i])))
                        .attr("cy", (d) => y(d))
                        .attr("r", 5)

    //Add x Axis
    var xAxis = d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%b")); //Changes the 1900 at (0,0) to Jan. It is because you are changing the tick format of the x axis (the way the ticks (January, February, March, etc) in the x-axis are displayed), into the time format, so 0 now equals January according to the ticks on the axis too. The ticks in the data are now reading the time format, and are no longer reading the number format.
    mainCanvas.append("g")
                    .attr("transform", "translate(0, "+ graphHeight +")")
                    .call(xAxis)

    //Add y Axis
    var yAxis = d3.axisLeft(y)
                    .ticks(4) //Alters the number of ticks in the y axis.
                    .tickPadding(10)
                    .tickSize(12);
    mainCanvas.append("g")
                .call(yAxis);

    }, [data]);

    console.log("The data taken from AlphVantage is " + JSON.stringify(data));

    return (
    <svg width="100vw"
    height="100vh" id="areagraph" ref={ref} />
)};

export default AreaGraph;
