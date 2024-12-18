import * as d3 from "d3";
import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import API from '../../utils/API.jsx';

const GaugeChart = ({
  height,
  width,
  currentPrice,
  previousClose,
  fiftyTwoWeekHigh,
  fiftyTwoWeekLow,
}) => {
  const [gaugeColor1, setGaugeColor1] = useState("none");
  const [gaugeColor2, setGaugeColor2] = useState("none");
  //const [fiftyTwoWeekHigh, setFiftyTwoWeekHigh] = useState(0);
  //const [fiftyTwoWeekLow, setFiftyTwoWeekLow] = useState(0);
  const [todaysOpen, setTodaysOpen] = useState(0);
  const [currentStockPrice, setCurrentStockPrice] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const svgRef = useRef(null);
  //[handlePathLength, setHandlePathLength] = useState(0);
  let scaledValue = 0;

  useEffect(() => {
    if (currentPrice && previousClose) {
      const change = ((currentPrice - previousClose) / previousClose) * 100;
      setPercentageChange(parseFloat(change || 0));
    }
  }, [currentPrice, previousClose]);
    
  

  // Takes a percentage change from 0% to 4% and converts it to an arcLength from 0 to 0.35 since the total pathLength is 0.7, the starting point is the midpoint of the arc.
  const convertPathLength = useCallback((x) => {
    if (percentageChange <= 4 && percentageChange >= -4) {
      const absPercentageChange = Math.abs(x);

      const minInput = 0;
      const maxInput = 4;
      const minOutput = 0;
      const maxOutput = 0.35;
      // Using the linear transformation formula
      scaledValue =
        minOutput +
        ((absPercentageChange - minInput) * (maxOutput - minOutput)) /
          (maxInput - minInput);
    } else {
      scaledValue = 0.35;
    }
    return scaledValue;
  },[]);

  useEffect(() => {
    convertPathLength(percentageChange);
  }, [percentageChange, currentPrice, convertPathLength]);

  // const handlePercentageChange = (percentageChange) => {

  //     if (percentageChange < 0 && percentageChange > -1.33333) {
  //         setGaugeColor2("url(#Red1)");
  //         setGaugeColor1("none");
  //     } else if (percentageChange <= -1.33333 && percentageChange > -2.666667) {
  //         setGaugeColor2("url(#Red2)");
  //         setGaugeColor1("none");
  //     } else if (percentageChange <= -2.666667 && percentageChange > -4) {
  //         setGaugeColor2("url(#Red3)");
  //         setGaugeColor1("none");
  //     } else if (percentageChange <= -4) {
  //         setGaugeColor2("url(#Red4)");
  //         setGaugeColor1("none");
  //     } else if (percentageChange >= 0 && percentageChange < 1.33333) {
  //         setGaugeColor2("none");
  //         setGaugeColor1("url(#Green1)");
  //     } else if (percentageChange >= 1.33333 && percentageChange < 2.666667) {
  //         setGaugeColor2("none");
  //         setGaugeColor1("url(#Green2)");
  //     } else if (percentageChange >= 2.666667 && percentageChange < 4) {
  //         setGaugeColor2("none");
  //         setGaugeColor1("url(#Green3)");
  //     } else if (percentageChange >= 4) {
  //         setGaugeColor2("none");
  //         setGaugeColor1("url(#Green4)");
  //     } else {
  //         setGaugeColor2("none");
  //         setGaugeColor1("none");
  //     }
  // }

  // Sets the color gradient profile of the gauge based on the percentageChange
  const handlePercentageChange = (percentageChange) => {
    if (percentageChange < 0 && percentageChange > -1.33333) {
      setGaugeColor2("url(#Red1)");
      setGaugeColor1("none");
    } else if (percentageChange <= -1.33333 && percentageChange > -2.666667) {
      setGaugeColor2("url(#Red2)");
      setGaugeColor1("none");
    } else if (percentageChange <= -2.666667 && percentageChange > -4) {
      setGaugeColor2("url(#Red3)");
      setGaugeColor1("none");
    } else if (percentageChange <= -4) {
      setGaugeColor2("url(#Red4)");
      setGaugeColor1("none");
    } else if (percentageChange >= 0 && percentageChange < 1.33333) {
      setGaugeColor2("none");
      setGaugeColor1("url(#Green1)");
    } else if (percentageChange >= 1.33333 && percentageChange < 2.666667) {
      setGaugeColor2("none");
      setGaugeColor1("url(#Green2)");
    } else if (percentageChange >= 2.666667 && percentageChange < 4) {
      setGaugeColor2("none");
      setGaugeColor1("url(#Green3)");
    } else if (percentageChange >= 4) {
      setGaugeColor2("none");
      setGaugeColor1("url(#Green4)");
    } else {
      setGaugeColor2("none");
      setGaugeColor1("none");
    }
  };

  // Sends the percentageChange variable to the handlePercentageChange function every time it's updated. This will update the color of the gauge when the percentageChange updates
  useEffect(() => {
    handlePercentageChange(percentageChange);
  }, [percentageChange]);

  //Calculations to determine the path to draw for a semicircle that tracks the background cirlce
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2.5; // Adjust based on the smallest dimension

  // Create a path for the "needle" to follow
  // Convert degrees to radians
  const degToRad = (deg) => (deg * Math.PI) / 180;

  // Define the start and end angles
  const startAngle = 144;
  const endAngle = startAngle + 360 * 0.7;

  //Breakpoints
  const breakpoints = [];
  const numTicks = 9;
  const breakpointDeg = (endAngle - startAngle) / (numTicks - 1);
  for (let i = 0; i < numTicks; i++) {
    breakpoints.push(breakpointDeg * i + startAngle);
  }
  console.log(`Breakpoints: ${breakpoints}`);

  // const breakpoints = [];
  // const numTicks = 9;
  // const breakpointDeg = (endAngle - startAngle) / numTicks;
  // for (let i = 0; i < numTicks; i++) {
  //     breakpoints.push({degrees: breakpointDeg * i}, {value: i-4});
  // }
  // console.log(`Breakpoints: ${JSON.stringify(breakpoints)}`);

  // Convert to radians
  const startRad = degToRad(startAngle);
  const endRad = degToRad(endAngle);

  // Calculate start and end points
  // const x1 = cx + radius * Math.cos(startRad);
  // const y1 = cy - radius * Math.sin(startRad);
  // const x2 = cx + radius * Math.cos(endRad);
  // const y2 = cy - radius * Math.sin(endRad);

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = 2 * cy - radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = 2 * cy - radius * Math.sin(endRad);

  // Define the path data for the circle arc
  const pathData = `
    M ${x1} ${y1}
    A ${radius} ${radius} 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${x2} ${y2}
    `;

  const radToDeg = (rad) => rad * (180 / Math.PI);

  // Scales the percentage change to the arcLength of the gauge and converts that arcLength to a degree value at the return statement.
  // The Ternary operator determines if the function should return a negative or positive degree value based on the negative or positive percentChange

  const convertToGauge = (percent) => {
    if (percent <= 4 && percent >= -4) {
      const absPercentageChange = Math.abs(percent);

      const minInput = 0;
      const maxInput = 4;
      const minOutput = 0;
      const maxOutput = 0.35;
      // Using the linear transformation formula
      scaledValue =
        minOutput +
        ((absPercentageChange - minInput) * (maxOutput - minOutput)) /
          (maxInput - minInput);
    } else {
      scaledValue = 0.35;
    }

    return percent >= 0
      ? scaledValue * (180 / Math.PI)
      : -(scaledValue * (180 / Math.PI));
  };

  return (
    <div className="">
      <motion.svg
        className=""
        height={height * 1.05}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <radialGradient id="Green1" r="0.8">
            <stop offset="50%" stopColor="#ccff33" />
            <stop offset="100%" stopColor="#ffee32" />
          </radialGradient>
          <radialGradient id="Green2" r="0.8">
            <stop offset="50%" stopColor="#9ef01a" />
            <stop offset="100%" stopColor="#edf2f4" />
          </radialGradient>
          <radialGradient id="Green3" r="0.8">
            <stop offset="50%" stopColor="#70e000" />
            <stop offset="100%" stopColor="#40916c" />
          </radialGradient>
          <radialGradient id="Green4" r="0.8">
            <stop offset="50%" stopColor="#29bf12" />
            <stop offset="100%" stopColor="#1b4332" />
          </radialGradient>
          <radialGradient id="Neutral" r="0.8">
            <stop offset="50%" stopColor="Gray" />
            <stop offset="100%" stopColor="#edf2f4" />
          </radialGradient>
          <radialGradient id="Red1" r="0.8">
            <stop offset="50%" stopColor="#ffd500" />
            <stop offset="100%" stopColor="#edf2f4" />
          </radialGradient>
          <radialGradient id="Red2" r="0.8">
            <stop offset="50%" stopColor="#ff8600" />
            <stop offset="100%" stopColor="#edf2f4" />
          </radialGradient>
          <radialGradient id="Red3" r="0.8">
            <stop offset="50%" stopColor="#ff4133" />
            <stop offset="100%" stopColor="#ffb3c1" />
          </radialGradient>
          <radialGradient id="Red4" r="0.8">
            <stop offset="50%" stopColor="#800f2f" />
            <stop offset="100%" stopColor="#ef2917" />
          </radialGradient>
          <radialGradient id="Background" r="0.9">
            <stop offset="50%" stopColor="#ecf8f8" />
            <stop offset="100%" stopColor="#eff7f6" />
          </radialGradient>
        </defs>
        <g>
          {/* Background Circle */}

          <g className="">
            <motion.circle
              initial={{ pathLength: 0.7, rotate: 144 }}
              animate={{ pathLength: 0.7 }}
              r={radius}
              cx={cx}
              cy={cy}
              strokeWidth={25}
              stroke="url(#Background)"
              opacity="0.4"
              fill="none"
              // transition={{
              //     type: 'spring',
              //     damping: 5,
              //     mass: 0.3,
              // duration: 1,
              // ease: "easeInOut",
              // repeat: Infinity,
              // repeatType: "loop",
              // repeatDelay: 2
              // }}
            />
            {/* <path
                            //transform={`translate(${cx/70}, ${cy/1.41}) rotate(7 ${cx/2} ${cy/2})`}
                            //transform={`translate(${-2 * radius - 48} ${radius-10})`}
                            //transform={`translate(${cx/2} ${radius})`}
                            strokeWidth="10"
                            stroke="black"
                            opacity="0.07"
                            fill="none"
                            id="motionPath"
                            d={pathData}
                        /> */}

            {/* Radial Gauge Values */}
            {breakpoints.map((breakpoint, i) => (
              <g
                key={i}
                //transform={`translate(${(Math.cos(degToRad(breakpoint))*(radius*1.3)) + cx}, ${(Math.sin(degToRad(breakpoint))*(radius*1.3)) + cy+5})`}
              >
                <line
                  x1={`${Math.cos(degToRad(breakpoint)) * (radius * 1.1) + cx}`}
                  y1={`${Math.sin(degToRad(breakpoint)) * (radius * 1.1) + cy}`}
                  x2={`${
                    Math.cos(degToRad(breakpoint)) * (radius * 1.18) + cx
                  }`}
                  y2={`${
                    Math.sin(degToRad(breakpoint)) * (radius * 1.18) + cy
                  }`}
                  className="stroke-sky-950 stroke-[0.5px]"
                />
                <text
                  textAnchor="middle"
                  fontSize="0.7rem"
                  fill="black"
                  className="align-middle justify-center"
                  x={`${Math.cos(degToRad(breakpoint)) * (radius * 1.3) + cx}`}
                  y={`${
                    Math.sin(degToRad(breakpoint)) * (radius * 1.25) + cy + 5
                  }`}
                  key={i}
                >
                  {i - 4}%
                </text>
                {i - 3.5 != 4.5 && (
                  <g>
                    <line
                      x1={`${
                        Math.cos(degToRad(breakpoint + breakpointDeg / 2)) *
                          (radius * 1.08) +
                        cx
                      }`}
                      y1={`${
                        Math.sin(degToRad(breakpoint + breakpointDeg / 2)) *
                          (radius * 1.08) +
                        cy
                      }`}
                      x2={`${
                        Math.cos(degToRad(breakpoint + breakpointDeg / 2)) *
                          (radius * 1.14) +
                        cx
                      }`}
                      y2={`${
                        Math.sin(degToRad(breakpoint + breakpointDeg / 2)) *
                          (radius * 1.14) +
                        cy
                      }`}
                      className="stroke-sky-900 stroke-[0.5px]"
                    />
                    <text
                      textAnchor="middle"
                      fontSize="0.4rem"
                      fill="black"
                      className="align-middle justify-center fill-sky-900"
                      x={`${
                        Math.cos(degToRad(breakpoint + breakpointDeg / 2)) *
                          (radius * 1.25) +
                        cx
                      }`}
                      y={`${
                        Math.sin(degToRad(breakpoint + breakpointDeg / 2)) *
                          (radius * 1.2) +
                        cy +
                        5
                      }`}
                    >
                      {/* {i-3.5}% */}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </g>
          {/* Positive Circle Half */}
          <motion.circle
            initial={{ pathLength: 0, rotate: 270 }}
            animate={{ pathLength: convertPathLength(percentageChange) }}
            r={radius}
            cx={cx}
            cy={cy}
            strokeWidth={25}
            stroke={gaugeColor1}
            fill="none"
            transition={{
              type: "spring",
              damping: 9,
              mass: 0.5,
              delay: 0.1,
              // duration: 1,
              // ease: "easeInOut",
              // repeat: Infinity,
              // repeatType: "loop",
              // repeatDelay: 2
            }}
          />

          {/* Negative Circle Half */}
          <g
            transform={`scale(-1, 1) translate(${-width}, ${0})`} //rotate(-0.005 ${cx} ${cy})
          >
            <motion.circle
              initial={{ pathLength: 0, rotate: 270 }}
              animate={{ pathLength: convertPathLength(percentageChange) }}
              r={radius}
              cx={cx}
              cy={cy}
              strokeWidth={25}
              stroke={gaugeColor2}
              fill="none"
              transition={{
                type: "spring",
                damping: 9,
                mass: 0.5,
                delay: 0.1,
                // repeat: Infinity,
                // repeatType: "loop",
                // repeatDelay: 2
              }}
            />
          </g>
          <g transform={`translate(${width / 2},${height / 2.1})`}>
            <text
              textAnchor="middle"
              fontSize="2.6rem"
              className=" fill-sky-950"
            >
              {currentPrice.toFixed(2)}
            </text>
            <text
              y="25"
              textAnchor="middle"
              fontSize="1.3rem"
              stroke={percentageChange <= 0 ? gaugeColor2 : gaugeColor1}
              fill={percentageChange <= 0 ? gaugeColor2 : gaugeColor1}
            >
              {percentageChange.toFixed(2)}%
            </text>
            <text
              y="48"
              textAnchor="middle"
              fontSize="1rem"
              stroke="black"
              fill="black"
              strokeWidth="0.3"
            >
              {typeof previousClose === "number"
                ? previousClose.toFixed(2)
                : "N/A"}
            </text>
            <text
              y="64"
              textAnchor="middle"
              fontSize="1rem"
              stroke={`url(#Green4)`}
              fill={`url(#Green4)`}
              strokeWidth="0.05"
            >
              {fiftyTwoWeekHigh !== null ? fiftyTwoWeekHigh.toFixed(2) : "N/A"}
            </text>
            <text
              y="80"
              textAnchor="middle"
              fontSize="1rem"
              stroke={`url(#Red4)`}
              fill={`url(#Red4)`}
              strokeWidth="0.05"
            >
              {fiftyTwoWeekLow !== null ? fiftyTwoWeekLow.toFixed(2) : "N/A"}
            </text>
          </g>
          {/* Rotating line */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{
              rotate: `${2 * Math.PI * convertToGauge(percentageChange)}deg`,
            }}
            transition={{
              type: "spring",
              damping: 8,
              mass: 0.3,
              // repeat: Infinity,
              // repeatType: "loop",
              // repeatDelay: 2
            }}
            style={{ originX: `${cx}px`, originY: `${cy}px` }} // Set transform origin to the center of the gauge
          >
            <motion.line
              x1={cx}
              y1={cy / 3.5}
              x2={cx}
              y2={cy - (radius + 15)}
              className="stroke-sky-900"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </motion.g>
        </g>
      </motion.svg>
    </div>
  );
};

export default GaugeChart;