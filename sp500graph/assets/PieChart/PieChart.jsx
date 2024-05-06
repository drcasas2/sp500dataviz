import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
//import styles from './AreaGraph.module.css';
import useMeasure from "react-use-measure";
import { format, startOfYear, startOfMonth, startOfQuarter, endOfYear, endOfMonth, endOfQuarter, eachYearOfInterval, eachMonthOfInterval, eachQuarterOfInterval, isSameYear, isSameMonth, isSameQuarter } from "date-fns";
import { motion } from "framer-motion";

const PieChart = ({ height, width, yearlySectorWeights }) => {
    
    const pie = d3.pie();

    console.log(yearlySectorWeights);

return (
    <>
        <svg
            className=""
            viewBox={`0 0 ${width} ${height + 15}`}
            // onMouseMove={handleMouseMove}
            // onMouseLeave = {handleMouseLeave}
        >

        </ svg>
    </>
);
};

export default PieChart;