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
        .range([0, graphWidth])
        .paddingInner(0.3)
        .paddingOuter(0.3);

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
    console.log('xScale(d.RoR)' + barData.map( (d, i) => `Key: ${i} - (${xScale(d.year)}, ${yScale(d.RoR)})`));
    // console.log('xScale.bandwidth(): ' + xScale.bandwidth())

    

    return (
        <>
            <svg
            viewBox={`0 0 ${width} ${height}`}
            className='border-solid border-slate-900 border-2'
            >
                {/* Setting the start drawing within the graph's margins, and ensuring data is available to display in the visualization */}
                {hasData && (
                <g transform={`translate(${margin.left},${margin.top})`}>
                        {/* Y-Axis Ticks and Text */}
                        {yScale.ticks().map((d, i) => (  //You need to use .ticks() in the yScale, because the y-axis data is not categorical, so some data can be displayed between the ticks. you can only directly map over the domain in the xScale, because the x-axis is considered categorical data in our data array.
                            <g key={i} transform={`translate(0, ${yScale(d)})`}>
                                <line x1={graphWidth} x2={ -8} className='stroke-slate-600 stroke-[0.5px] stroke-dasharray-2-4' />
                                <text
                                    x={-10}
                                    y={0}
                                    dy="0.32em"
                                    textAnchor="end"
                                    className='text-sm text-gray-600 fill-gray-600'
                                >
                                    {`${d}%`}
                                </text>
                            </g>
                        ))}
                        {/* Creating the Bars on the Bar Chart */}
                        {barData.map((d, i) => (
                            <g key = {i}>
                                <motion.rect
                                    x={xScale(d.year)}
                                    y={yScale(Math.max(0, d.RoR))}  // Ensure y is positive for negative values
                                    width={xScale.bandwidth()}
                                    height={Math.abs(yScale(d.RoR) - yScale(0))}  // Calculate height from zero line
                                    className="fill-sky-500"
                                    initial={{ cy: yScale(0), scale: 0 }}
                                    animate={{ cy: yScale(d.RoR), scale: 1 }}
                                    transition={{ type: "spring", duration: 1, delay: 0.006 * i }}
                                    key={i}
                                    r="1"
                                    cx={xScale(d.year)}
                                    cy={yScale(d.RoR)}
                                />
                                {/* I need to work on how to center the text within each of the bars in the bar chart without spreading out the text if the bar width gets wider as the screen gets wider */}
                                <g>
                                    <text
                                        className='text-[3px] mx-[4px] sm:text-[4px] lg:text-sm xl:text-lg stroke-sky-50 stroke-[0.5] sm:stroke-[0.8] backdrop-invert'
                                        x={xScale(d.year)}
                                        y={yScale(d.RoR)}  // Ensure y is positive for negative values
                                        dy = {yScale(d.RoR) >= 160 ? '-2' : '8'}
                                        textLength= {xScale.bandwidth()}
                                        lengthAdjust= 'spacing'
                                    >
                                    {`${Math.round(d.RoR * 10) / 10}%`}
                                    </text>
                                </g>
                            </g>
                        ))}
                        {/* X-Axis & X-Axis Ticks & Text */}
                        <g transform={`translate(0,${yScale(0)})`}>
                            <line x1={0} x2={graphWidth} className='stroke-slate-900' />
                            {xScale.domain().map((d, i) => (
                                <g key={i} transform={`translate(${xScale(d) + xScale.bandwidth() / 2},0)`}>
                                    <line y1="-3" y2="3" className="stroke-slate-800 stroke-[0.5px]" />
                                    <text
                                        y="10"
                                        textAnchor="middle"
                                        className='text-[5px] mx-[4px] sm:text-sm lg:text-lg xl:text-xl stroke-blue-800 stroke-[0.3] backdrop-invert'
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
                </g>
                )}
            </svg>
        </>
    );
};

export default BarChart;