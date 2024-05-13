import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
//import styles from './AreaGraph.module.css';
import useMeasure from "react-use-measure";
import { format, startOfYear, startOfMonth, startOfQuarter, endOfYear, endOfMonth, endOfQuarter, eachYearOfInterval, eachMonthOfInterval, eachQuarterOfInterval, isSameYear, isSameMonth, isSameQuarter } from "date-fns";
import { motion } from "framer-motion";

const PieChart = ({ height, width, yearlySectorWeights, year }) => {

    const margin = { top: '300px', right: '1000px', bottom: '15px', left: '35px' }

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
        const radius = w/2;
        const svg = d3.select(svgRef.current)
            .attr('width', w)
            .attr('height', h)
            .style('overflow', 'visible')
            .style('margin-top', margin.top);
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
        svg.selectAll()
            .data(arcs)
            .join('path')
                .attr('d', arcGenerator)
                .attr('fill', (d,i) => {
                    console.log("Object.values(d.data.Sector): ", Object.values(d.data.Sector));
                    color(d.Sector);
                })
                .style('opacity', 0.7);
        //set up annotation
        svg.selectAll()
            .data(arcs)
            .join('text')
                .text(d => d.data.Sector)
                .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
                .style('text-anchor', 'middle');
    }, [data,year]);


    console.log(yearlySectorWeights);

    return (
    <>
        <svg
            className="pieChart"
            ref = {svgRef}
            viewBox={`0 0 ${width} ${height + 15}`}
            style={{ display: 'block', margin: 'auto' }}
            // onMouseMove={handleMouseMove}
            // onMouseLeave = {handleMouseLeave}
        >
        </ svg>
    </>
);
};

export default PieChart;