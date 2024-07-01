import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { format, startOfYear, endOfYear, eachYearOfInterval, isSameYear } from "date-fns";
import { motion } from "framer-motion";

const AreaGraph2 = ({ height, width, dates, values, data }) => {
    const tooltipRef = useRef();
    const margin = { top: 20, right: 20, bottom: 15, left: 35 };
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState("");

    const isValidData = Array.isArray(data) && data.every(([x, y]) => Object.prototype.toString.call(x) === '[object Date]' && typeof y === 'number');
    const hasData = isValidData && data.length > 0;

    let xScale = d3.scaleTime()
        .domain(hasData ? [startOfYear(data.at(0)[0]), endOfYear(data.at(-1)[0])] : [new Date(), new Date()])
        .range([margin.left, width - margin.right]);

    let yScale = d3.scaleLinear()
        .domain(hasData ? d3.extent(data.map((d) => d[1])) : [0, 1])
        .range([height - margin.bottom, margin.top]);

    let line = d3.line()
        .x((d) => xScale(d[0]))
        .y((d) => yScale(d[1]));

    let result = hasData ? line(data) : null;

    const handleMouseMove = (event) => {
        if (!hasData) return;

        const { clientX, clientY } = event;
        const svgRect = event.target.getBoundingClientRect();
        const mouseX = clientX - svgRect.left;
        const mouseY = clientY - svgRect.top - margin.top;

        setXPos(mouseX);
        setYPos(mouseY);

        let nearestDataPoint = null;
        let minDistance = Infinity;
        data.forEach((d) => {
            const dist = Math.abs(xScale(d[0]) - mouseX);
            if (dist < minDistance) {
                minDistance = dist;
                nearestDataPoint = d;
            }
        });

        if (nearestDataPoint) {
            setXPos(xScale(nearestDataPoint[0]));
            setYPos(yScale(nearestDataPoint[1]));
            setTooltipContent(`Value at Close In ${format(nearestDataPoint[0], "MMM yyyy")}: ${nearestDataPoint[1]}`);
            setTooltipVisible(true);
        }

        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    return (
        <>
            <svg
                className="mb-2"
                viewBox={`0 0 ${width} ${height + 15}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* X-Axis minor axis and tick labels */}
                {hasData && eachYearOfInterval({ start: startOfYear(data.at(0)[0]), end: endOfYear(data.at(-1)[0]) }).map((year) => (
                    <g
                        transform={`translate(${xScale(year)},${height - margin.bottom})`}
                        className="fill-current"
                        key={year}
                    >
                        <line
                            y1={0}
                            y2={margin.top - height + 10}
                            className="stroke-gray-400 stroke-[0.5] stroke-dasharray-[2,4]"
                        />
                        {!(year.getYear() === data.at(0)[0].getYear() || year.getYear() === data.at(-1)[0].getYear() || year.getYear().toString().endsWith('0')) && (
                            <text
                                x={((xScale(endOfYear(year)) - xScale(year)) / 2)}
                                y={10}
                                textAnchor='middle'
                                className="fill-current text-sm sm:text-sm md:text-sm lg:text-base"
                            >
                                {format(year, "yy")}
                            </text>
                        )}
                    </g>
                ))}

                {/* X-Axis Shading */}
                {hasData && eachYearOfInterval({ start: startOfYear(data.at(0)[0]), end: endOfYear(data.at(-1)[0]) }).map((year, i) => (
                    <g
                        transform={`translate(${xScale(year)},${14})`}
                        className="fill-current"
                        key={year}
                    >
                        {i % 2 === 1 && (
                            <rect
                                width={xScale(endOfYear(year)) - xScale(year)}
                                height={height - margin.bottom - 14}
                                className="fill-[#F0F4FF] pointer-events-none"
                            />
                        )}
                    </g>
                ))}

                {/* Y-axis */}
                {yScale.ticks(5).map((points) => (
                    <g
                        transform={`translate(0,${yScale(points)})`}
                        className="text-gray-400"
                        key={points}
                    >
                        <line
                            x1={margin.left}
                            x2={width - margin.right}
                            className="stroke-gray-400 stroke-[0.5] stroke-dasharray-[2,4]"
                        />
                        <text
                            alignmentBaseline="middle"
                            x={0}
                            className="text-base sm:text-base md:text-lg lg:text-xl fill-gray-500"
                        >
                            {points}
                        </text>
                    </g>
                ))}

                {/* X-axis */}
                {hasData && xScale.ticks(4).concat(startOfYear(data.at(0)[0])).concat(startOfYear(data.at(-1)[0])).map((date) => (
                    <g
                        transform={`translate(${xScale(date)},${height - 5})`}
                        className="fill-current"
                        key={date}
                    >
                        <line
                            y1={height - margin.bottom}
                            y2={margin.top}
                            className="stroke-black stroke-[1] stroke-dasharray-[2,4]"
                        />
                        <text
                            x={0}
                            y={1}
                            transform={`rotate(50 ${8},${3})`}
                            className="fill-current text-sm sm:text-sm md:text-base lg:text-xl"
                        >
                            {format(date, "yyyy")}
                        </text>
                    </g>
                ))}

                {/* Line */}
                {hasData && (
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 6, delay: 1.5, type: "spring" }}
                        d={result}
                        fill="none"
                        stroke="currentColor"
                    />
                )}

                {/* Crosshairs */}
                {hasData && (
                    <g id="crosshairs" className="pointer-events-none">
                        <line x1={margin.left} x2={width - margin.right} y1={yPos} y2={yPos} className="stroke-gray-400 stroke-[1] stroke-dasharray-[4]" />
                        <line x1={xPos} x2={xPos} y1={margin.top} y2={height - margin.bottom} className="stroke-gray-400 stroke-[1] stroke-dasharray-[4]" />
                    </g>
                )}

                {/* Circles */}
                {hasData && data.map((d, i) => (
                    <motion.circle
                        initial={{ cy: height - margin.bottom, scale: 0 }}
                        animate={{ cy: yScale(d[1]), scale: 1 }}
                        transition={{ type: "spring", duration: 1, delay: 0.006 * i }}
                        key={d[0]}
                        r="1"
                        cx={xScale(d[0])}
                        cy={yScale(d[1])}
                        className="fill-current stroke-[0.5px]"
                        stroke={eachYearOfInterval({ start: startOfYear(data.at(0)[0]), end: endOfYear(data.at(-1)[0]) }).findIndex(y => isSameYear(y, d[0])) % 2 === 1 ? '#F0F4FF' : 'white'}
                    />
                ))}
            </svg>
            {tooltipVisible && (
                <motion.div
                    className="absolute p-1 text-base sm:text-base md:text-xl lg:text-2xl text-blue-500 border-solid border-1 border-blue-900 bg-white rounded pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 0.9 }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.5 }}
                    style={{ top: yPos, left: xPos }}
                    ref={tooltipRef}
                >
                    {tooltipContent}
                </motion.div>
            )}
        </>
    );
};

export default AreaGraph2;
