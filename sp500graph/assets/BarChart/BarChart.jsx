import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import NumInputField from '../NumInputField/NumInputField.jsx';

const BarChart = ({ height, width, barData, avgYearlyReturn, roRDataNumberOfYears }) => {
    const margin = { top: 20, right: 20, bottom: 15, left: 35 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    const isValidData = Array.isArray(barData) && barData.every(d => typeof d.year === 'string' && typeof d.RoR === 'number');
    const hasData = isValidData && barData.length > 0;

    // Gets the Initial Investment Value that was saved in local storage under the memory location 'initialInvestmentInput, or defaults to 0'
    const [initialInvestment, setInitialInvestment] = useState(
        localStorage.getItem('initialInvestmentInput') || 0
    );

    // Gets the Yearly Investment Value that was saved in local storage under the memory location 'yearlyInvestmentInput, or defaults to 0'
    const [yearlyInvestment, setYearlyInvestment] = useState(
        localStorage.getItem('yearlyInvestmentInput') || 0
    );

    const [annualROI, setAnnualROI] = useState({});

    // Gets the Initial Investment Value and Yearly Investment Value that the user previously inputted,
    // and saves it to local storage under the name 'yearlyInvestmentInput' or 'initialInvestmentInput'
    // so the number is saved in local memory if the page refreshes.
    // The local storage only updates if the states of either of the variables in the array below changes.
    useEffect(() => {
        localStorage.setItem('yearlyInvestmentInput', yearlyInvestment);
        localStorage.setItem('initialInvestmentInput', initialInvestment);
    }, [initialInvestment, yearlyInvestment]);

    useEffect(() => {
        if(hasData) {
            const calculateAnnualROI = (initialInvestment, yearlyInvestment) => {
                const calculatedYearlyReturn = barData.reduce((accumulator, currentBarData, currentIndex, array) => {
                    const previousValue = currentIndex > 0 ? Number(accumulator.iterationResults[currentIndex - 1].currentYearReturn) : Number(initialInvestment); // Use previous year's return if not the first year
                    const calculation = currentIndex > 0 ? ((Number(yearlyInvestment) + Number(previousValue)) * (1 + (currentBarData.RoR / 100))) : (Number(previousValue) * (1 + (currentBarData.RoR / 100))); // Calculate current year's return
                    console.log(currentBarData.RoR/100);
                    console.log(previousValue);
                    console.log(calculation);
                    accumulator.iterationResults.push({ year: currentBarData.year, currentYearReturn: calculation }); // Push the current calculation into an array
                    accumulator.finalValue = calculation; // Keep updating the finalValue
    
                    return accumulator; // Return the accumulator object
                },{
                    iterationResults: [],
                    finalValue: 0
                });
                return calculatedYearlyReturn;
            };
            setAnnualROI(calculateAnnualROI(initialInvestment, yearlyInvestment));
        }
    }, [initialInvestment, yearlyInvestment, barData]);
    

    console.log(barData);

    const handleInitialInvestment = (event) => {
        setInitialInvestment(event.target.value);
    };

    const handleYearlyInvestment = (event) => {
        setYearlyInvestment(event.target.value);
    };

    const handleHover = (event) => {
        
    }

    console.log(annualROI);

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
            <h2 className='text-center font-bold w-1/2 text-2xl mb-5 mx-auto px-0'>Average Annual Return</h2>
            <div className="absolute flex flex-col items-start mb-4 top-0">
                    <NumInputField label="Initial Investment (in USD)" value={initialInvestment} onInput={handleInitialInvestment} />
                    <NumInputField label="Yearly Investment (in USD)" value={yearlyInvestment} onInput={handleYearlyInvestment} />
            </div>
            <div className='absolute bg-slate-200 min-h-14 left-3/4 top-0 font-bold font-sans flex flex-column flex-wrap rounded divide-solid divide-y-2 divide-blue-700 w-4/12 h-16 px-auto mx-auto lg:flex-column lg:flex-nowrap lg:left-2/3 lg:mx-auto lg:w-4/12 lg:h-18 lg:divide-x-2 lg:divide-y-0 md:divide-x-0 md:divide-y-2 sm:h-16 sm:w-3/12 sm:left-3/4'>
                <h3 className="relative mx-auto min-w-14 px-3 py-0 my-auto text-left text-[0.63rem] text-center min-w-30 w-auto h-auto sm:min-w-[7.09rem] sm:mx-2 sm:px-1 lg:w-1/2 lg:py-0 lg:px-1 lg:text-[0.9rem] sm:text-[0.65rem] sm:pb-0 sm:pt-1 sm:px-1">Average Yearly Return For {roRDataNumberOfYears} Years</h3>
                <h3 className='relative text-nowrap text-center px-2 pl-4 my-auto w-auto text-[1.1rem] font-bold font-lato h-auto mx-auto sm:text-[1.15rem] lg:text-[1.9rem]'>{Math.round(avgYearlyReturn * 1000)/1000}%</h3>
            </div>
            <div className='absolute bg-slate-200 min-h-14 left-3/4 top-1/4 font-bold font-sans flex flex-column flex-wrap rounded divide-solid divide-y-2 divide-blue-700 w-4/12 h-16 px-auto mx-auto lg:flex-column lg:flex-nowrap lg:left-2/3 lg:mx-auto lg:w-4/12 lg:h-18 lg:divide-x-2 lg:divide-y-0 md:divide-x-0 md:divide-y-2 sm:h-16 sm:w-3/12 sm:left-3/4'>
                Your Final Return after {roRDataNumberOfYears} Years is {annualROI.finalValue}
            </div>
            <svg
            viewBox={`0 0 ${width} ${height}`}
            className='mt-36'
            >
                {/* Creates a linear color gradient on each of the bars */}
                <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#337CB9" />
                        <stop offset="100%" stopColor="#2F4A9E" />
                    </linearGradient>
                </defs>
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
                                        y={d.RoR >= 0 ? yScale(Math.max(0, d.RoR)) : height - margin.bottom - yScale(0)}  // Ensure y is positive for negative values
                                        width={xScale.bandwidth()}
                                        height={Math.abs(yScale(d.RoR) - yScale(0))}  // Calculate height from zero line
                                        className="stroke-blue-950 stroke-[0.5]"
                                        fill="url(#gradient)"
                                        initial={{ cy: yScale(0), scale: 0 }}
                                        animate={{ cy: yScale(d.RoR), scale: 1 }}
                                        transition={{ type: "spring", duration: 4, delay: 0.006 * i }}
                                        key={i}
                                        //r="1"
                                        //cx={xScale(d.year)}
                                        cy={yScale(d.RoR)}
                                    />
                                    {/* I need to work on how to center the text within each of the bars in the bar chart without spreading out the text if the bar width gets wider as the screen gets wider */}
                                    <g className=''>
                                        <text
                                            className='text-[3.5px] mx-[4px] sm:text-[10px] lg:text-lg xl:text-lg stroke-sky-50 fill-sky-50 stroke-[0.3] sm:stroke-[0.4] backdrop-invert'
                                            x={xScale(d.year) + xScale.bandwidth()/2}
                                            y={d.RoR >= 0 ? yScale(d.RoR) : yScale(Math.min(0, d.RoR))}  // Ensure y is positive for negative values
                                            dy = {d.RoR >= 0 ? (width <= '500px' ? '4px' : '10px') : '-4px'} //When the screen width is small, it adjusts the location of the text inside each of the bars.
                                            textAnchor="middle"
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
                                            className='text-[3.5px] mx-[5px] sm:text-[10px] lg:text-lg xl:text-xl stroke-blue-800 stroke-[0.3] backdrop-invert'
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