// You need to figure out why there is a big black box in front of your graph when you tried to add a tooltip

import * as d3 from "d3";
import { useEffect, useRef } from "react";
//import styles from './AreaGraph.module.css';
import useMeasure from "react-use-measure";
import { format, startOfYear, startOfMonth, startOfQuarter, endOfYear, endOfMonth, endOfQuarter, eachYearOfInterval, eachMonthOfInterval, eachQuarterOfInterval, isSameYear, isSameMonth, isSameQuarter } from "date-fns";
import { motion } from "framer-motion";

const AreaGraph2 = ({ height, width, dates, values, data }) => {
    // const tooltipRef = useRef(null);
    //let [reference, bounds] = useMeasure();
    
    const margin = { top: 20, right: 20, bottom: 15, left: 35 };
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    // const width= graphWidth + margin.left + margin.right;
    // const height= graphHeight + margin.top + margin.bottom;

    // console.log(data);
    // const data2 = Object.entries(data).map(([key, value]) => [key, value]);
    // console.log(`data2: ${data2}`);

    // Check if data is valid and not empty
    if (!Array.isArray(data) || data.length === 0) {
        return <div>No data available</div>;
    }

    // Check if data points are valid numbers
    const isValidData = data.every(([x, y]) => Object.prototype.toString.call(x) === '[object Date]' && typeof y === 'number');
    if (!isValidData) {
        return <div>Data contains invalid values</div>;
    }

    // // Check if data points are valid numbers
    // const isValidData = data.every(([x, y]) => typeof x === 'number'Object.prototype.toString.call(date) && typeof y === 'number');
    // if (!isValidData) {
    //     return <div>Data contains invalid values</div>;
    // }

    console.log(typeof(data[0][1]));
    console.log(data[0][0]);
    console.log(data[0][0] instanceof Date);
    console.log(data[data.length - 1][0])
    console.log(data[data.length - 1][0] instanceof Date)
    // const data3 = data2.map(([_, value]) => [value[0], value[1]]);
    // console.log(`data3: ${data3}`);

    let startYear = startOfYear(data.at(0)[0]);
    let endYear = endOfYear(data.at(-1)[0]);
    let years = eachYearOfInterval({ start: startYear, end: endYear});
    console.log(years);

    let xScale = d3.scaleTime()
            .domain([startYear, endYear]) // Passed in an array of the minimum and maximum dates in the passed in data
            //data[0][0], data[data.length - 1][0]
            //d3.extent(data.map((d) => d[0]))
            .range([margin.left, width-margin.right]);
            
    let yScale = d3.scaleLinear()
            .domain(d3.extent(data.map((d) => d[1])))
            .range([height-margin.bottom, margin.top]);

    let line = d3.line()
            .x((d) => xScale(d[0])) //Returns the x value of each point in the data, and wraps it in the xScale to scale the data across the graph
            .y((d)=> yScale(d[1]));

    let result = line(data);

    console.log(yScale.ticks());

    //data.map(d => console.log(years.findIndex(y => isSameYear(y, d[0])) % 2 === 1 ? "" : format(d[0], "yyyy")))

    return (
        <>
            <svg className="" viewBox={`0 0 ${width} ${height+15}`}>
                
                {/* X-Axis Shading */}
                {years.map((year, i) => (
                    <g
                        transform = {`translate(${xScale(year)},0)`} 
                        className="text-gray-400" 
                        key={year}
                    >
                        <line
                            //key={`line-${index}`}
                            y1={height -margin.bottom}
                            y2={margin.top - height}
                            stroke='#718096'
                            strokeWidth={0.5}
                            strokeDasharray="2,4"
                        />
                        {i % 2  === 1 && (
                            <rect
                                width={xScale(endOfYear(year)) - xScale(year)}
                                height={height - margin.bottom}
                                fill='#F0F4FF'
                                // fillOpacity='8%'
                            />
                        )}
                        {!(year.getYear() === data.at(0)[0].getYear() || year.getYear() === data.at(-1)[0].getYear() || year.getYear().toString().endsWith('0')) && (
                        <text
                           //key={`text-${index}`}
                        //    alignmentBaseline="middle"
                            x={((xScale(endOfYear(year)) - xScale(year))/2)}
                            y={height - 5}
                            textAnchor='middle'
                            style={{ fontSize: '10px', fill: '#718096' }}
                        >
                            {format(year, "yy")}
                        </text>
                        )}
                    </ g>
                ))}
                
                {/* Y-axis */}
                {yScale.ticks(5).map((points) => (
                    <g
                        transform = {`translate(0,${yScale(points)})`} 
                        className="text-gray-400" 
                        key={points}
                    >
                        <line
                            //key={`line-${index}`}
                            x1={margin.left}
                            x2={width - margin.right}
                            stroke='#718096'
                            strokeWidth={0.5}
                            strokeDasharray="2,4"
                        />
                        <text
                           //key={`text-${index}`}
                           alignmentBaseline="middle"
                            x={0}
                            style={{ fontSize: '10px', fill: '#718096' }}
                        >
                            {points}
                        </text>
                    </ g>
                ))}

                {/* X-axis */}
                {xScale.ticks(4).concat(startOfYear(data.at(0)[0])).concat(startOfYear(data.at(-1)[0])).map((date) => (
                    <g
                        transform = {`translate(${xScale(date)},${height - 5})`} 
                        className="text-gray-400" 
                        key={date}
                    >
                        <line
                            //key={`line-${index}`}
                            y1={height - margin.bottom}
                            y2={margin.top}
                            stroke='black'
                            strokeWidth={1}
                            strokeDasharray="2,4"
                        />
                        <text
                           //key={`text-${index}`}
                        //    alignmentBaseline="middle"
                            x={-6}
                            y={1}
                            transform={`rotate(50 ${0},${0})`}
                            style={{ fontSize: '12px', fill: '#718096' }}
                        >
                            {/* xScale(endOfYear(year)) - xScale(year) */}
                            {format(date, "yyyy")}
                        </text>
                    </ g>
                ))}
                {/* Line */}
                <motion.path
                    initial = {{ pathLength: 0 }}
                    animate = {{ pathLength: 1 }}
                    transition = {{ duration: 6, delay: 1.5, type: "spring" }}
                    d={result}
                    fill="none"
                    stroke="currentColor"
                />
                {/* Circles */}
                {data.map((d, i) => (
                    <motion.circle
                        initial = {{ cy: height - margin.bottom, scale: 0 }}
                        animate = {{ cy: yScale(d[1]), scale: 1 }}
                        transition = {{ type: "spring", duration: 1, delay: 0.006 * i }}
                        key={d[0]}
                        r="1"
                        cx={xScale(d[0])}
                        cy={yScale(d[1])}
                        fill="currentColor"
                        stroke={years.findIndex(y => isSameYear(y, d[0])) %2 == 1 ? '#F0F4FF' : 'white'}
                        // strokeOpacity={years.findIndex(y => isSameYear(y, d[0])) %2 == 1 ? '100%' : '100%'}
                        strokeWidth={0.5}
                    />
                ))}
            </svg>
        </>
    );
};


export default AreaGraph2;