import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
//import styles from './AreaGraph.module.css';
import useMeasure from "react-use-measure";
import { format, startOfYear, startOfMonth, startOfQuarter, endOfYear, endOfMonth, endOfQuarter, eachYearOfInterval, eachMonthOfInterval, eachQuarterOfInterval, isSameYear, isSameMonth, isSameQuarter } from "date-fns";
import { motion } from "framer-motion";

const PieChart = ({ height, width, yearlySectorWeights, year }) => {

    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    const [data] = useState(yearlySectorWeights);

    const svgRef = useRef();

    const findYearData = yearlySectorWeights.find(entry => entry.Year === year);
   //console.log(yearData);
    const yearData = Object.entries(findYearData.Sector).map(([Sector, Value]) => ({ Sector, Value })) //Takes each sector value in the Sector Object, and creates an array of its own Sector, Value objects
    console.log(yearData);
    //const sectorLength = yearData.map(entry => Object.keys(entry.Sector).length);
    //console.log(sectorLength[0]);

    useEffect(() => {
        //set up svg container
        const w = width;
        const h = height;
        const radius = Math.min(w, h) / 2;
        const svg = d3.select(svgRef.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`)
            .style('overflow', 'hidden')
            .style('margin-top', margin.top)
            .style('margin-left', 'auto')
            .style('margin-right', 'auto')
            .style("margin-bottom", margin.bottom);
            //.style('margin', 'auto');

            svg.selectAll("*").remove();
        //set up chart

        //console.log(yearData.map(d => Object.values(d.Sector)))
        //The below line of code invokes the pie method in d3, then tells d3 how to extract
        //the values you want to use in the pie chart by grabbing the values in the object's
        //embedded Sector object, and then (yearData) tells d3 what data you want to use
        //to perform the operation
        const pie = d3.pie().value(d => d.Value);
        console.log(pie);
        const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
        const arcs = pie(yearData);
        const color = d3.scaleOrdinal().range(d3.schemePaired);
        //set up svg data
        
        const arcGroup = svg
            .append("g")
            .attr("transform", `translate(${(w + margin.left + margin.right)/2}, ${(h + margin.top + margin.bottom)/2})`);

        arcGroup
            .selectAll("path")
            .data(arcs)
            .join('path')
            .attr('d', arcGenerator)
            .attr('fill', (d,i) => color(i))
            .style('opacity', 0.7);

        //set up annotation
        arcGroup
            .selectAll("text")
            .data(arcs)
            .join('text')
            .text(d => `${d.data.Sector}: ${d.data.Value}%`)
            .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
            .style('text-anchor', 'middle')
            .attr('class', 'text-xs');
    }, [data,year, width, height]);


    console.log(yearlySectorWeights);

    return (
    <>
        <svg
            className="pieChart"
            ref = {svgRef}
            // viewBox={`0 0 ${width} ${height}`}
            style={{ display: 'block', margin: '0 auto' }}
            // onMouseMove={handleMouseMove}
            // onMouseLeave = {handleMouseLeave}
        >
        </ svg>
    </>
);
};

export default PieChart;