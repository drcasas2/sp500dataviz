import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const BarChart = ({ height, width, barData }) => {
    const margin = { top: 20, right: 20, bottom: 15, left: 35 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    const isValidData = Array.isArray(barData) && barData.every(d => typeof d.year === 'string' && typeof d.RoR === 'number');
    const hasData = isValidData && barData.length > 0;

    console.log(barData);

    // Creating the X-Axis Scale

    let xScale = d3.scaleBand()
        .domain(hasData ? barData.map(d => d.year) : [])
        .range([0, graphWidth]);

    console.log(d3.extent(barData, d => d.RoR))

    // Creating the Y-Axis Scale

    let yScale = d3.scaleLinear()
        .domain([hasData ? d3.min(barData, d => d.RoR) : 0, hasData ? d3.max(barData, d => d.RoR) : 0])
        .nice()
        .range([graphHeight, margin.top]);

    // console.log(d3.min(barData, d => d.RoR));
    // console.log(d3.max(barData, d => d.RoR));
    // console.log("yScale domain:", yScale.domain());
    // console.log("yScale range:", yScale.range());
    // console.log("yScale(0):", yScale(0));

    

    return (
        <>
            <svg
            viewBox={`0 0 ${width} ${height}`}
            className='border-solid border-slate-900 border-2'
            >
                {/* Setting the start drawing within the graph's margins, and ensuring data is available to display in the visualization */}
                {hasData && (
                <g transform={`translate(${margin.left},${margin.top})`}>
                        {/* X-Axis */}
                        <g transform={`translate(0,${yScale(0)})`}>
                            <line x1={0} x2={graphWidth} className='stroke-slate-900' />
                            {xScale.domain().map((d, i) => (
                                <g key={i} transform={`translate(${xScale(d) + xScale.bandwidth() / 2},0)`}>
                                    <line y2="6" stroke="black" />
                                    <text
                                        y="20"
                                        textAnchor="middle"
                                        className='text-sm mx-[4px] lg:text-lg xl:text-xl'
                                    >
                                        {d}
                                    </text>
                                </g>
                            ))}
                        </g>
                        {/* Y-Axis */}
                        <g transform={`translate(0, ${graphHeight})`}>
                            <line x1={0} x2={0} y1={0} y2={-graphHeight} className='stroke-slate-900'/>
                        </g>
                        {yScale.ticks().map((d, i) => (  //You need to use .ticks() in the yScale, because the y-axis data is not categorical, so some data can be displayed between the ticks. you can only directly map over the domain in the xScale, because the x-axis is considered categorical data in our data array.
                            <g key={i} transform={`translate(0, ${yScale(d)})`}>
                                <line x1={graphWidth} x2={ -8} className='stroke-slate-600 stroke-[0.5px] stroke-dasharray-2-4' />
                                <text
                                    x={-10}
                                    y={0}
                                    dy="0.32em"
                                    textAnchor="end"
                                    className='text-sm'
                                >
                                    {d}
                                </text>
                            </g>
                        ))}

                        {/* Trying to create the bars to draw on the graph. This is completely wrong so far, but I will work on this */}
                        {barData.map((d, i) => (
                            <g key={i} transform={`translate(${xScale(d.RoR) + xScale.bandwidth()}, ${yScale(d.year)})`}>
                                <rect>

                                </rect>
                            </g>
                        ))}
                </g>
                )}
            </svg>
        </>
    );
};

export default BarChart;