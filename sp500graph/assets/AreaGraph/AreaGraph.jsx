import * as d3 from "d3";
import {useState, useEffect, useRef} from "react"
import styles from './AreaGraph.module.css';

const AreaGraph = ({dates, values}) => {
    const ref = useRef();

    const parseDate = d3.timeParse("%Y-%m-%d"); // %B is the  nomenclature used in the timeParse method in the d3 library that allows you to turn the months into the time format, and abbreviate/pull the month name from that newly formatted data.

    console.log(dates.map(date => parseDate(date)));
    useEffect(() => {

    const canvas = d3.select(ref.current)

    const svg = canvas.append("svg")
                .attr("width", 600)
                .attr("height", 600);

    const margin = {top:20, right: 200, bottom: 20, left: 50};
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    const mainCanvas = svg.append('g')
                    .attr('width', graphWidth)
                    .attr('height', graphHeight)
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    //Set the ranges and domains
    var x = d3.scaleTime()
                        .domain(d3.extent(dates.map(date => parseDate(date))))
                        .range([0, graphWidth])
                        //.padding(0.1);
                        //console.log(dates.slice(0).reverse().map(date=>parseDate(date)));


    var y = d3.scaleLinear()
                        .range([graphHeight, 0])
                        .domain([0, d3.max(values, (d) => d)]); //The domain sets the data that will be used for the axis in question. Since we're talking about the y axis, it's revenueData

    var areaChart = d3.area()  //This function connects the x values/scale with the y values.
                        .x(function (d, i) {
                        console.log("Area Chart Dates:", x(parseDate(dates[i])))
                        return x(parseDate(dates[i]))//Took the months array, turned it into a time format, and then only took the month data from that new formatted months data by using the function parseMonths, and then scaled it along the x axis using the function x() which scales the time format from minimum to maximum across the graphWidth
                        })
                        .y0(graphHeight)
                        .y1((d) => graphHeight - d) //since all DOMs start at upper left as (0,0), and down and to the right are positive values, you need to take the graph height and then subtract the d (which is revenueData) to get the points on the graph.
    
    //This code below created the original area graph. It's orange in the js, but we changed it to blue in the CSS file. CSS overides the JS styles.
    mainCanvas.append("path")
                .attr("fill", "orange")
                .attr("class", styles.area)
                .attr("d", areaChart(values));

    
    //I can't get the line graph or circles to work, so I commented them out for now. But this would be the starting code to add a line and circles to trace the area graph data
    //We want to create a line that goes along the area we created
    //First, We Define The Graph Line
    var lineData = values.map((d, i) => ({ date: parseDate(dates[i]), value: d }));
    
    var valueLine = d3.line()
                        .x(d => x(d.date))
                        .y(d => y(d.value))
                        .curve(d3.curveMonotoneX)
                        //console.log("Value Line Chart Dates:", x(d => d.date));

    //Next, We create the line we just defined in valueLine
    mainCanvas.append("path")
                        .datum(lineData)
                        .attr("class", styles.line)
                        .attr("d", valueLine); //"d" draws the line
    //Circles
    var circles = mainCanvas.selectAll("circle")
                        .data(values)
                        .enter()
                        .append("circle")
                        .attr("class", styles.circle)
                        .attr("cx", (d, i) => x(parseDate(dates[i])))
                        .attr("cy", (d) => y(d))
                        .attr("r", 5)
                        console.log("Circle Chart Dates:", (d, i) => x(parseDate(dates[i])));

    //Add x Axis
    var xAxis = d3.axisBottom(x)
                .ticks(8)
                .tickFormat((d, i) => i%2 === 0 ? d3.timeFormat("%m-%d-%Y")(d) : null); //Changes the 1900 at (0,0) to Jan. It is because you are changing the tick format of the x axis (the way the ticks (January, February, March, etc) in the x-axis are displayed), into the time format, so 0 now equals January according to the ticks on the axis too. The ticks in the data are now reading the time format, and are no longer reading the number format.
    
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

    }, [values]);

    return (
    <svg width="100vh"
    height="100vh" id="areagraph" ref={ref} />
)};

export default AreaGraph;
