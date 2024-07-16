import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const PieChart3 = ({ height, width, yearlySectorWeights, year }) => {
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    const [data] = useState(yearlySectorWeights);

    const findYearData = yearlySectorWeights.find(entry => entry.Year === year);
    console.log(findYearData);

    let yearData = [];

    if (findYearData) {
        yearData = Object.entries(findYearData.Sector).map(([Sector, Value]) => ({ Sector, Value }));
    }

    if (!findYearData) return;

    const w = width;
    const h = height*3;
    const radius = Math.min(w, h)/2 - Math.max(margin.top, margin.bottom);
    const colorScale = d3.scaleOrdinal(['#B8B8B8', '#007CBE', '#2748A5', '#7086FF', '#D7F3DF', '#2A2B2E', '#33B8FF', '#99DBFF', '#3961D0', '#1B3374', '#000F66', '#031A6B']);
    const pie = d3.pie().value(d => d.Value);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    const arcs = pie(yearData);

    const labels = arcs.map((arc) => {
        const [x, y] = arcGenerator.centroid(arc).map(coord => coord * 2.5);
        return { x, y, Sector: arc.data.Sector, Value: arc.data.Value, color: colorScale(arc.index) };
    });

    const leftLabels = labels.filter(label => label.x < 0).sort((a, b) => a.y - b.y);
    const rightLabels = labels.filter(label => label.x >= 0).sort((a, b) => a.y - b.y);

    return (
        <>
            {findYearData ? (
                <div className="grid grid-cols-3 gap-0 mx-1 -mt-0 lg:-mt-4 md:-mt-4 sm:-mt-8 justify-center h-auto py-4">
                    <div className="inline-flex flex-col justify-start items-end mr-0 flex-shrink-0 w-auto h-auto my-auto">
                        {leftLabels.map((label, i) => (
                            <div key={i} className="text-right my-0 leading-3" style={{ color: label.color }}>
                                <span className="flex-nowrap text-sm my-0 sm:text-base md:text-lg lg:text-2xl font-bold leading-tight sm:leading-tight md:leading-normal">{label.Sector}: {label.Value}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="inline-flex mx-1 w-full h-full my-auto">
                        <svg
                            className="fill-current overflow-hidden my-auto mx-auto w-auto h-full align-middle content-center"
                            viewBox={`0 0 ${w} ${h}`}
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <g transform={`translate(${w / 2}, ${h/ 2})`}>
                                {arcs.map((arc, i) => (
                                    <motion.g
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
                                    </motion.g>
                                ))}
                            </g>
                        </svg>
                    </div>
                    <div className="inline-flex flex-col justify-start items-start ml-2 flex-shrink-0 w-auto my-auto">
                        {rightLabels.map((label, i) => (
                            <div key={i} className="text-left my-0 leading-3" style={{ color: label.color, fontWeight: 'bold' }}>
                                <span className=" flex-nowrap text-sm my-0 sm:text-base md:text-lg lg:text-2xl font-bold leading-3 sm:leading-tight md:leading-normal">{label.Sector}: {label.Value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <h1>No Sector Data Found for that Year...</h1>
            )}
        </>
    );
};

export default PieChart3;