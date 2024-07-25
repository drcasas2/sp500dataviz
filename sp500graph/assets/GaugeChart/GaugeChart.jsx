import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import NumInputField from '../NumInputField/NumInputField.jsx';

const GaugeChart = ({ height, width, currentStockPrice, percentageChange }) => {

    const [gaugeColor1, setGaugeColor1] = useState("none");
    const [gaugeColor2, setGaugeColor2] = useState("none");
    //[handlePathLength, setHandlePathLength] = useState(0);
    let scaledValue = 0;
    const convertPathLength = (x) => {
            if (percentageChange <= 4 && percentageChange >= -4) {
                const absPercentageChange = Math.abs(x);

                const minInput = 0;
                const maxInput = 4;
                const minOutput = 0;
                const maxOutput = 0.35;
                // Using the linear transformation formula
                scaledValue = minOutput + ((absPercentageChange - minInput) * (maxOutput - minOutput) / (maxInput - minInput));
            }

            else {
                scaledValue = 0.35;
            }
        return scaledValue;
    };

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
    }
    useEffect(() => {
        handlePercentageChange(percentageChange);
    }, [percentageChange]);

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2.5; // Adjust based on the smallest dimension    

    return (
        <>
            <h2 className='text-center font-bold w-1/2 text-2xl my-2 mx-auto px-0'>Current Daily Change</h2>
            <motion.svg className='mt-0' viewBox={`0 0 ${width} ${height}`}>
                <defs>
                    <radialGradient id="Green1" r='0.8'>
                        <stop offset="50%" stop-color="#ccff33" />
                        <stop offset="100%" stop-color="#ffee32" />
                    </radialGradient>
                    <radialGradient id="Green2" r='0.8'>
                        <stop offset="50%" stop-color="#9ef01a" />
                        <stop offset="100%" stop-color="#edf2f4" />
                    </radialGradient>
                    <radialGradient id="Green3" r='0.8'>
                        <stop offset="50%" stop-color="#70e000" />
                        <stop offset="100%" stop-color="#40916c" />
                    </radialGradient>
                    <radialGradient id="Green4" r='0.8'>
                        <stop offset="50%" stop-color="#29bf12" />
                        <stop offset="100%" stop-color="#1b4332" />
                    </radialGradient>
                    <radialGradient id="Neutral" r='0.8'>
                        <stop offset="50%" stop-color="Gray" />
                        <stop offset="100%" stop-color="#edf2f4" />
                    </radialGradient>
                    <radialGradient id="Red1" r='0.8'>
                        <stop offset="50%" stop-color="#ffd500" />
                        <stop offset="100%" stop-color="#edf2f4" />
                    </radialGradient>
                    <radialGradient id="Red2" r='0.8'>
                        <stop offset="50%" stop-color="#ff8600" />
                        <stop offset="100%" stop-color="#edf2f4" />
                    </radialGradient>
                    <radialGradient id="Red3" r='0.8'>
                        <stop offset="50%" stop-color="#ff4133" />
                        <stop offset="100%" stop-color="#ffb3c1" />
                    </radialGradient>
                    <radialGradient id="Red4" r='0.8'>
                        <stop offset="50%" stop-color="#800f2f" />
                        <stop offset="100%" stop-color="#ef2917" />
                    </radialGradient>
                    <radialGradient id="Background" r='0.9'>
                        <stop offset="50%" stop-color="#ecf8f8" />
                        <stop offset="100%" stop-color="#eff7f6" />
                    </radialGradient>
                </defs>
                    <g>
                        <motion.circle
                            initial={{pathLength: 0.7, rotate: 145}}
                            animate={{pathLength: 0.7}}
                            r={radius}
                            cx={cx}
                            cy={cy}
                            strokeWidth={25}
                            stroke="url(#Background)"
                            opacity="0.4"
                            fill="none"
                            transition={{
                                type: 'spring',
                                damping: 5,
                                mass: 0.3,
                                // duration: 1,
                                // ease: "easeInOut",
                                // repeat: Infinity,
                                // repeatType: "loop",
                                // repeatDelay: 2
                            }}
                        />
                        <motion.circle
                            initial={{pathLength: 0, rotate: 270}}
                            animate={{pathLength: convertPathLength(percentageChange)}}
                            r={radius}
                            cx={cx}
                            cy={cy}
                            strokeWidth={25}
                            stroke={gaugeColor1}
                            fill="none"
                            transition={{
                                type: 'spring',
                                damping: 5,
                                mass: 0.3,
                                // duration: 1,
                                // ease: "easeInOut",
                                // repeat: Infinity,
                                // repeatType: "loop",
                                // repeatDelay: 2
                            }}
                        />
                        <g
                        transform={`scale(-1, 1) translate(${-width}, 0)`}
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
                                    type: 'spring',
                                    damping: 5,
                                    mass: 0.3,
                                    // repeat: Infinity,
                                    // repeatType: "loop",
                                    // repeatDelay: 2
                                }}
                            />
                        </g>
                        <g
                        transform={`translate(${width/2},${height/2.1})`}
                        >
                            <text textAnchor="middle" fontSize="2.6rem">
                                {currentStockPrice}
                            </text>
                            <text
                                y="25"
                                textAnchor="middle"
                                fontSize="1.3rem"
                                stroke={percentageChange <= 0 ? gaugeColor2 : gaugeColor1}
                                fill={percentageChange <= 0 ? gaugeColor2 : gaugeColor1}
                            >
                                {percentageChange}%
                            </text>
                        </g>
                    </g>
            </motion.svg>
        </>

    );
};

export default GaugeChart;