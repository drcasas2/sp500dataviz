import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
//import styles from './AreaGraph.module.css';
import useMeasure from "react-use-measure";
import { format, startOfYear, startOfMonth, startOfQuarter, endOfYear, endOfMonth, endOfQuarter, eachYearOfInterval, eachMonthOfInterval, eachQuarterOfInterval, isSameYear, isSameMonth, isSameQuarter } from "date-fns";
import { motion } from "framer-motion";

const PieChart = ({ height, width, yearlySectorWeights, year }) => {
    const svgRef = useRef();

    const svg = d3.select(svgRef.current)

    console.log(year);

    useEffect(() => {

        // Filter data for the year 2001
        const yearData = yearlySectorWeights.find(entry => entry.Year === year);
        if (yearData) {
            const pie = d3.pie().sort(null).value(d => d.value);
            const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2);
      
            const arcs = pie(Object.entries(yearData.Sector).map(([sector, value]) => ({ sector, value })));

            svg.selectAll("*").remove(); // Clear previous drawings
      
            const arcGroup = svg
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`)
            
            arcGroup
                .selectAll("path")
                .data(arcs)
                .enter()
                .append("path")
                .attr("fill", (d, i) => d3.schemeCategory10[i])
                .attr("d", arc)
                .append("title")
                .text(d => `${d.data.sector}: ${d.data.value}%`);

            // Add labels
            arcGroup
                .selectAll("text")
                .data(arcs)
                .enter()
                .append("text")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text(d => `${d.data.sector}: ${d.data.value}%`);
        //const sectorsData = Object.entries(yearData.Sector);

        // Create a pie layout
        //const pie = d3.pie().value(d => d[1]);

        // Generate pie angles
        //const angles = pie(sectorsData);

            // const pie = d3.pie()
            //     .sort(null)
            //     .value(yearlySectorWeights => yearlySectorWeights["Sector"]["Information Technology"])

            // const angles = pie(yearlySectorWeights)

            // console.log(angles)

        }
    },
        [year, yearlySectorWeights, height, width]
    )

    console.log(yearlySectorWeights);

return (
    <>
        <svg
            className="pieChart"
            ref = {svgRef}
            viewBox={`0 0 ${width} ${height + 15}`}
            // onMouseMove={handleMouseMove}
            // onMouseLeave = {handleMouseLeave}
        >
        </ svg>
    </>
);
};

export default PieChart;