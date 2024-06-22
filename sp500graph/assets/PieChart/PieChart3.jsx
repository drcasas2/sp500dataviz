import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { format, startOfYear, endOfYear, eachYearOfInterval } from "date-fns";
import { motion } from "framer-motion";

const PieChart3 = ({ height, width, yearlySectorWeights, year }) => {
    const margin = { top: 40, right: 40, bottom: 40, left: 40 }

    const [data] = useState(yearlySectorWeights);

    const findYearData = yearlySectorWeights.find(entry => entry.Year === year);
    console.log(findYearData);

    let yearData = [];

    if (findYearData) {
        yearData = Object.entries(findYearData.Sector).map(([Sector, Value]) => ({ Sector, Value }));
    }

    if (!findYearData) return;

    const w = width;
    const h = height;
    const radius = Math.min(w, h);
    const colorScale = d3.scaleOrdinal(['#B8B8B8','#007CBE','#2748A5','#7086FF','#D7F3DF','#2A2B2E','#33B8FF','#99DBFF','#3961D0','#1B3374','#000F66','#031A6B']);
    const pie = d3.pie().value(d => d.Value);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    const arcs = pie(yearData);

    const labels = arcs.map((arc) => {
        const [x, y] = arcGenerator.centroid(arc).map(coord => coord * 2.5);
        return { x, y, Sector: arc.data.Sector, Value: arc.data.Value, color: colorScale(arc.index) };
    });

    const leftLabels = labels.filter(label => label.x < 0).sort((a, b) => a.y - b.y);
    const rightLabels = labels.filter(label => label.x >= 0).sort((a, b) => a.y - b.y);

    const textHeight = 20; // Height of each text line
    const leftLabelStartY = (h - leftLabels.length * textHeight) / 2 + margin.top;
    const rightLabelStartY = (h - rightLabels.length * textHeight) / 2 + margin.top;

    console.log(yearlySectorWeights);

    return (
        <>
            {findYearData ? (
                <div className="flex justify-center items-center w-auto mx-10">
                    <div className="flex flex-col items-end mr-3 flex-shrink-0 flex-grow-0 w-auto">
                        {leftLabels.map((label, i) => (
                            <div key={i} className="text-end" style={{ color: label.color, fontWeight: 'bold', fontSize: '10px' }}>
                                {label.Sector}: {label.Value}%
                            </div>
                        ))}
                    </div>
                    <div className="flex-shrink-3 flex-grow-0 mx-1 w-full h-auto">
                        <svg
                            className="fill-current overflow-visible py-0 m-0 block w-full h-auto"
                            width={w / 2}
                            height={h}
                            viewBox={`0 0 ${w + margin.right + margin.left} ${h + margin.top + margin.bottom}`}
                        >
                            <g transform={`translate(${(w + margin.left + margin.right) / 2}, ${(h + margin.top + margin.bottom) / 2})`}>
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
                    <div className="flex flex-col items-end ml-3 flex-shrink-0 flex-grow-0 w-auto">
                        {rightLabels.map((label, i) => (
                            <div key={i} className="text-start" style={{ color: label.color, fontWeight: 'bold', fontSize: '10px' }}>
                                {label.Sector}: {label.Value}%
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