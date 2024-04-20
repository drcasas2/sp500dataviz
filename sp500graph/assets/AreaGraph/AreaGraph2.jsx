// You need to figure out why there is a big black box in front of your graph when you tried to add a tooltip

import * as d3 from "d3";
import { useEffect, useRef } from "react";
//import styles from './AreaGraph.module.css';
import useMeasure from "react-use-measure";
import { format } from "date-fns";


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
    console.log(typeof(data[0][1]));
    console.log(data[0][0]);
    // const data3 = data2.map(([_, value]) => [value[0], value[1]]);
    // console.log(`data3: ${data3}`);
    const parseDate = d3.timeParse("%Y-%m-%d")

    let xScale = d3.scaleTime()
            .domain(d3.extent(data.map((d) => d[0])))
            .range([margin.left, width-margin.right]);
            
    let yScale = d3.scaleLinear()
            .domain(d3.extent(data.map((d) => d[1])))
            .range([height-margin.bottom, margin.top]);

    let line = d3.line()
            .x((d) => xScale(d[0])) //Returns the x value of each point in the data, and wraps it in the xScale to scale the data across the graph
            .y((d)=> yScale(d[1]));

    let result = line(data);

    console.log(yScale.ticks());

    return (
        <>
            <svg className="" viewBox={`0 0 ${width} ${height}`}>
                <path d={result} fill="none" stroke="currentColor"/>
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

                {xScale.ticks(8).map((date) => (
                    <g
                        transform = {`translate(${xScale(date)},${height - 5})`} 
                        className="text-gray-400" 
                        key={date}
                    >
                        <line
                            //key={`line-${index}`}
                            y1={height - 170}
                            y2={margin.bottom - height}
                            stroke='#718096'
                            strokeWidth={0.5}
                            strokeDasharray="2,4"
                        />
                        <text
                           //key={`text-${index}`}
                        //    alignmentBaseline="middle"
                            y={0}
                            style={{ fontSize: '8px', fill: '#718096' }}
                        >
                            {format(date, "yyyy")}
                        </text>
                    </ g>
                ))}
            </svg>
        </>
    );
};


export default AreaGraph2;