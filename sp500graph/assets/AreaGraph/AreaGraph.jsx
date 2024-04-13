import * as d3 from "d3";
import { useEffect, useRef } from "react";
import styles from './AreaGraph.module.css';

const AreaGraph = ({ dates, values }) => {
    const ref = useRef();
    
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    useEffect(() => {
        const canvas = d3.select(ref.current);

        const parseDate = d3.timeParse("%Y-%m-%d");

        const svg = canvas.append("svg")
            .attr("width", 600)
            .attr("height", 600);

        const mainCanvas = svg.append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(dates.map(date => parseDate(date))))
            .range([0, graphWidth]);

        const y = d3.scaleLinear()
            .range([graphHeight, 0])
            .domain([0, d3.max(values, (d) => d)]);
            console.log(d3.max(values, (d) => d));

        const areaChart = d3.area()
            .x((d, i) => x(parseDate(dates[i])))
            .y0(graphHeight)
            .y1((d) => y(d));

        mainCanvas.append("path")
            .attr("fill", "orange")
            .attr("class", styles.area)
            .attr("d", areaChart(values));

        const lineData = values.map((d, i) => ({ value: d, date: parseDate(dates[i]) }));

        const valueLine = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);

        mainCanvas.append("path")
            .datum(lineData)
            .attr("class", styles.line)
            .attr("d", valueLine);

        mainCanvas.selectAll("circle")
            .data(values)
            .enter()
            .append("circle")
            .attr("class", styles.circle)
            .attr("cx", (d, i) => x(parseDate(dates[i])))
            .attr("cy", (d) => y(d))
            .attr("r", 5);

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
        <svg width={graphWidth + margin.left + margin.right} height={graphHeight + margin.top + margin.bottom} id="areagraph" ref={ref} />
    );
};

export default AreaGraph;