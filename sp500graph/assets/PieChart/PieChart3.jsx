import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
//import styles from './AreaGraph.module.css';
import useMeasure from "react-use-measure";
import { format, startOfYear, startOfMonth, startOfQuarter, endOfYear, endOfMonth, endOfQuarter, eachYearOfInterval, eachMonthOfInterval, eachQuarterOfInterval, isSameYear, isSameMonth, isSameQuarter } from "date-fns";
import { motion } from "framer-motion";

const PieChart = ({ height, width, yearlySectorWeights, year }) => {

    const margin = { top: 40, right: 40, bottom: 40, left: 40 }

    const [data] = useState(yearlySectorWeights);

    const svgRef = useRef();

    const findYearData = yearlySectorWeights.find(entry => entry.Year === year);
   console.log(findYearData);

   let yearData = [];

   if (findYearData) {
        yearData = Object.entries(findYearData.Sector).map(([Sector, Value]) => ({ Sector, Value }));
   } //Takes each sector value in the Sector Object, and creates an array of its own Sector, Value objects
    
   console.log(yearData);
    //const sectorLength = yearData.map(entry => Object.keys(entry.Sector).length);
    //console.log(sectorLength[0]);
        if (!findYearData) return;
        //set up svg container
        const w = width;
        const h = height;
        const radius = Math.min(w, h) / 2;
        const colorScale = d3.scaleOrdinal(['#B8B8B8','#007CBE','#2748A5','#7086FF','#D7F3DF','#2A2B2E','#33B8FF','#99DBFF','#3961D0','#1B3374','#000F66','#031A6B']);
        // const svg = d3.select(svgRef.current)
        //     .attr('width', '100%')
        //     .attr('height', '100%')
        //     .attr('viewBox', `0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`)
        //     .style('overflow', 'hidden')
        //     .style('margin-top', margin.top)
        //     .style('margin-left', 'auto')
        //     .style('margin-right', 'auto')
        //     .style("margin-bottom", margin.bottom);
        //     //.style('margin', 'auto');

        //     svg.selectAll("*").remove();
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
        console.log(arcs);
        //set up svg data
        
        // const arcGroup = svg
        //     .append("g")
        //     .attr("transform", `translate(${(w + margin.left + margin.right)/2}, ${(h + margin.top + margin.bottom)/2})`);

        // arcGroup
        //     .selectAll("path")
        //     .data(arcs)
        //     .join('path')
        //     .attr('d', arcGenerator)
        //     .attr('fill', (d,i) => color(i))
        //     .style('opacity', 0.7);

        // //set up annotation
        // arcGroup
        //     .selectAll("text")
        //     .data(arcs)
        //     .join('text')
        //     .text(d => `${d.data.Sector}: ${d.data.Value}%`)
        //     .attr('transform', d => `translate(${arcGenerator.centroid(d)}), rotate(40 ${0},${0})`)
        //     .style('text-anchor', 'middle')
        //     .attr('class', 'text-xs');


    console.log(yearlySectorWeights);

    return (
    <>
        {findYearData ? (
                <svg
                    className="mx-auto my-0"
                    width='100%'
                    height='100%'
                    viewBox={`0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`}
                    style={{ display: 'block', margin: '0 auto' }}
                    // onMouseMove={handleMouseMove}
                    // onMouseLeave = {handleMouseLeave}
                >
                            {arcs.map((arc, i) => {
                                return (
                                    <motion.g
                                    transform = {`translate(${(w + margin.left + margin.right) / 2}, ${(h + margin.top + margin.bottom) / 2})`}
                                    className="fill-current" 
                                    key={arc.index}
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.2
                                            }
                                        }
                                    }}
                                    >
                                        <motion.path
                                            key={arc.index}
                                            d={arcGenerator(arc)}
                                            fill={colorScale(arc.index)}
                                            stroke="white"
                                            strokeWidth="3"
                                            initial={{
                                                opacity: 0,
                                                pathLength: 0
                                            }}
                                            animate={{
                                                opacity: 1,
                                                pathLength: 1
                                            }}
                                            transition={{
                                                duration: 1,
                                                delay: arc.index * 0.1,
                                            }}
                                        />
                                        <text
                                            transform={`translate(${arcGenerator.centroid(arc).map(coord => coord * 2.39)})`}
                                            textAnchor="middle"
                                            dy="0em"
                                            style={{ fontSize: '10px', fill: colorScale(arc.index), fontWeight: 'bold'}}
                                        >
                                            {arc.data.Sector}
                                        </text>
                                            <br />
                                        <text
                                            transform={`translate(${arcGenerator.centroid(arc).map(coord => coord * 2.39)})`}
                                            textAnchor="middle"
                                            dy="1.1em"
                                            style={{ fontSize: '10px', fontWeight: 'bold', fill: colorScale(arc.index) }}
                                        >
                                            {arc.data.Value}%
                                        </text>
                                        {console.log(arc)}
                                    </motion.g>
                            )})}
                </ svg>
            ) : (
                <h1>No Sector Data Found for that Year...</h1>
            )}
    </>
    );
};

export default PieChart;