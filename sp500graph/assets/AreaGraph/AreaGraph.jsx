// You need to figure out why there is a big black box in front of your graph when you tried to add a tooltip

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import styles from './AreaGraph.module.css';
import useMeasure from "react-use-measure";
import { parseISO } from "date-fns";

const AreaGraph = ({ dates, values }) => {
    const ref = useRef();
    // const tooltipRef = useRef(null);
    let [reference, bounds] = useMeasure();
    
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    useEffect(() => {
        const canvas = d3.select(ref.current);

        // const parseDate = d3.timeParse("%Y-%m-%d");

        const svg = canvas.append("svg")
            .attr("width", 600)
            .attr("height", 600);

        const mainCanvas = svg.append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

            // //create tooltip div
            
            // const tooltip = d3.select("body")
            //     .append("div")
            //     .attr("class", "tooltip");

            // //Create a second tooltip div for raw date

            // const tooltipRawDate = d3.select("body")
            //     .append("div")
            //     .attr("class", "tooltip");

            //Create our gradient

        const x = d3.scaleTime()
            .domain(d3.extent(dates))
            .range([0, graphWidth]);

        const y = d3.scaleLinear()
            .range([graphHeight, 0])
            .domain([0, d3.max(values)]);
            console.log(d3.max(values));

        const areaChart = d3.area()
            .x((d, i) => x(dates[i]))
            .y0(graphHeight)
            .y1((d) => y(d));

        mainCanvas.append("path")
            .attr("fill", "orange")
            .attr("class", styles.area)
            .attr("d", areaChart(values));

        const lineData = values.map((d, i) => ({ value: d, date: dates[i] }));

        const valueLine = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);

        mainCanvas.append("path")
            .datum(lineData)
            .attr("class", styles.line)
            .attr("d", valueLine);

        //Draw circles along path for each data point

        // mainCanvas.selectAll("circle")
        //     .data(values)
        //     .enter()
        //     .append("circle")
        //     .attr("class", styles.circle)
        //     .attr("cx", (d, i) => x(parseDate(dates[i])))
        //     .attr("cy", (d) => y(d))
        //     .attr("r", 5);

        // Add mousemove event listener for tooltip
        // svg.on("mousemove", function(event) {
        //     const [xCoord] = d3.pointer(event, this);
        //     const bisectDate = d3.bisector(d => d.date).left;
        //     const x0 = x.invert(xCoord);
        //     const i = bisectDate(lineData, x0, 1);
        //     const d0 = lineData[i - 1];
        //     const d1 = lineData[i];
        //     const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        //     const xPos = x(d.date);
        //     const yPos = y(d.value);

        //     // Update tooltip position and content
        //     tooltipRef.current.style.display = "block";
        //     tooltipRef.current.style.left = `${xPos}px`;
        //     tooltipRef.current.style.top = `${yPos}px`;
        //     tooltipRef.current.innerHTML = `${d.value !== undefined ? d.value.toFixed(2) : 'N/A'}`;
        // });

    //     // Hide tooltip on mouseout
    //     svg.on("mouseout", () => {
    //         tooltipRef.current.style.display = "none";
    //     });

    //     // Add a circle element for tooltip

    //     const circle = svg.append("circle")
    //         .attr("r", 0)
    //         .attr("fill", "red")
    //         .style("stroke", "white")
    //         .attr("opacity", 0.7)
    //         .style("pointer-events", "none");

    //     // Add red lines extending from the circle to the date and value

    //     const tooltipLineX = svg.append("line")
    //     .attr("class", "tooltip-line")
    //     .attr("id", "tooltip-line-x")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1)
    //     .attr("stroke-dasharray", "2,2");
        
    //     const tooltipLineY = svg.append("line")
    //     .attr("class", "tooltip-line")
    //     .attr("id", "tooltip-line-y")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1)
    //     .attr("stroke-dasharray", "2,2");

    //     // Create a listening rectangle

    //     const listeningRect = svg.append("rect")
    //     .attr("width", graphWidth)
    //     .attr("height", graphHeight);

    //     // Create the mouse move function

    //     listeningRect.on("mousemove", function (event) {
    //         const [xCoord] = d3.pointer(event, this);
    //         const bisectDate = d3.bisector(d => d.dates).left;
    //         const x0 = x.invert(xCoord);
    //         const i = bisectDate(dates, x0, 1);
    //         const d0 = values[i-1];
    //         const d1 = dates[i];
    //         const d = x0 - d0.Date > d1.Date -x0 ? d1 : d0;
    //         const xPos = x(d.date);
    //         const yPos = y(d.value);

    //     // Update the circle position

    //     circle.attr("cx", xPos).attr("cy", yPos);

    //     // Add transition for the circle radius

    //     circle.transition()
    //     .duration(50)
    //     .attr("r", 5);

    //     tooltipLineX.style("display", "block").attr("x1", xPos).attr("x2", xPos).attr("y1", 0).attr("y2", graphHeight)
    //     tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos).attr("x1", 0).attr("x2", graphWidth)
        
    //     // add in our tooltip

    //     tooltip
    //     .style("display", "block")
    //     .style("left", `${graphWidth + 90}px`)
    //     .style("top", `${yPos + 68}px`)
    //     .html(`${d.value !== undefined ? d.value.toFixed(2) : 'N/A'}`);
    
    
    
    // });

        const xAxis = d3.axisBottom(x)
            .ticks(6)
            .tickFormat((d, i) => i % 2 === 0 ? d3.timeFormat("%m-%d-%Y")(d) : null);

        mainCanvas.append("g")
            .attr("transform", `translate(0, ${graphHeight})`)
            .call(xAxis);

        const yAxis = d3.axisLeft(y)
            .ticks(4)
            .tickPadding(10)
            .tickSize(12);

        mainCanvas.append("g")
            .call(yAxis);
    }, [dates, values]);

    return (
        <div className="relative h-full w-full" ref={reference}>
            <svg width={graphWidth + margin.left + margin.right} height={graphHeight + margin.top + margin.bottom} id="areagraph" ref={ref} />
            {/* <div ref={tooltipRef} className="tooltip" style={{ display: "none" }}></div> */}
        </div>
    );
};

export default AreaGraph;