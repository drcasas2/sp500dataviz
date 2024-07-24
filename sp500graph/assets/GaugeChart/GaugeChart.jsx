import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import NumInputField from '../NumInputField/NumInputField.jsx';

const GaugeChart = ({ height, width }) => {

    return (
        <>
            <motion.svg>
                <defs>
                    <radialGradient id="RadialGradient1">
                        <stop offset="50%" stop-color="cyan" />
                        <stop offset="100%" stop-color="green" />
                    </radialGradient>
                </defs>
                    <motion.circle
                    initial={{pathLength: 0}}
                    animate={{pathLength: 1.01}}
                    r="50"
                    cx="100"
                    cy="80"
                    strokeWidth={50}
                    stroke="url(#RadialGradient1)"
                    fill="none"
                    transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                        repeatDelay: 2
                    }}
                    >
                        
                    </motion.circle>
            </motion.svg>
        </>

    );
};

export default GaugeChart;