import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import NumInputField from '../NumInputField/NumInputField.jsx';

const BarChart = ({ height, width, barData, avgYearlyReturn, roRDataNumberOfYears }) => {
    const tooltipRef = useRef();
    const margin = { top: 20, right: 20, bottom: 15, left: 35 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    const isValidData = Array.isArray(barData) && barData.every(d => typeof d.year === 'string' && typeof d.RoR === 'number');
    const hasData = isValidData && barData.length > 0;
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState("");

    // Gets the Initial Investment Value that was saved in local storage under the memory location 'initialInvestmentInput, or defaults to 0'
    const [initialInvestment, setInitialInvestment] = useState(
        localStorage.getItem('initialInvestmentInput') || 0
    );

    // Gets the Yearly Investment Value that was saved in local storage under the memory location 'yearlyInvestmentInput, or defaults to 0'
    const [yearlyInvestment, setYearlyInvestment] = useState(
        localStorage.getItem('yearlyInvestmentInput') || 0
    );

    const [annualROI, setAnnualROI] = useState({});
    const [hidden, setHidden] = useState(true);

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

                // Format currentYearReturn values
                calculatedYearlyReturn.iterationResults = calculatedYearlyReturn.iterationResults.map(iterationResult => ({
                    ...iterationResult,
                    currentYearReturnFormatted: iterationResult.currentYearReturn.toLocaleString()
                }));

                console.log(calculatedYearlyReturn);

                return calculatedYearlyReturn;
            };
            setAnnualROI(calculateAnnualROI(initialInvestment, yearlyInvestment));
        }
    }, [initialInvestment, yearlyInvestment, barData]);
    

    //console.log(barData);
    //console.log(annualROI.iterationResults);

    const handleInitialInvestment = (event) => {
        setInitialInvestment(event.target.value);
    };

    const handleYearlyInvestment = (event) => {
        setYearlyInvestment(event.target.value);
    };

    //console.log(annualROI);
    //console.log(barData);

    // Creating the X-Axis Scale

    let xScale = d3.scaleBand()
        .domain(hasData ? barData.map(d => d.year) : [])
        .range([0, graphWidth])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    //console.log(d3.extent(barData, d => d.RoR))

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
    //console.log('xScale(d.RoR)' + barData.map( (d, i) => `Key: ${i} - (${xScale(d.year)}, ${yScale(d.RoR)})`));
    // console.log('xScale.bandwidth(): ' + xScale.bandwidth())

    const handleMouseMove = (event) => {
        if (!hasData) return;

        const { clientX, clientY } = event;
        const svgRect = event.target.getBoundingClientRect();
        const mouseX = clientX - svgRect.left - margin.left - margin.right;
        const mouseY = clientY - svgRect.top - margin.top;

        setXPos(mouseX);
        setYPos(mouseY);

        let nearestDataPoint = null;
        let minDistance = Infinity;

        annualROI.iterationResults.forEach((d) => {
            const dist = Math.abs(xScale(d.year) + (xScale.bandwidth()/2) - mouseX);
            console.log(`svgRect : ${svgRect.left}, clientX : ${clientX} , d.year : ${d.year}, xScale(d.year) : ${xScale(d.year)}, xScale.bandwidth() : ${xScale.bandwidth()}`);
            if (dist < minDistance) {
                minDistance = dist;
                nearestDataPoint = d;
            }
        });

        if (nearestDataPoint) {
            setXPos((xScale(nearestDataPoint.year) - xScale.bandwidth()/2 + margin.left));
            //setYPos(yScale(nearestDataPoint[1]));
            setTooltipContent(`Your RoR in ${nearestDataPoint.year}: ${nearestDataPoint.currentYearReturnFormatted}`);
            setTooltipVisible(true);
            console.log(nearestDataPoint);
        }

        console.log(tooltipContent)
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    const finalValueWCommas = annualROI?.finalValue ? annualROI.finalValue.toLocaleString() : 'N/A';

    return (
        <>
            <div className="flex flex-col">
                <h2 className='text-center font-bold w-1/2 text-2xl mb-5 mx-auto px-0'>Average Annual Return</h2>
                <div className="flex flex-nowrap my-2 justify-between h-auto w-auto">
                    <div className="flex flex-col items-center px-1 mx-1 w-auto float-start justify-center w-1/2">
                            <NumInputField className="relative" label="Initial Investment (in USD)" value={initialInvestment} onInput={handleInitialInvestment} />
                            <NumInputField className="relative" label="Yearly Investment (in USD)" value={yearlyInvestment} onInput={handleYearlyInvestment} />
                    </div>
                    <div className="flex flex-col items-end justify-between px-1 my-1 h-auto w-auto">
                        <div className='bg-slate-200 min-h-14 font-bold font-sans flex flex-column flex-wrap rounded divide-solid divide-y-2 divide-blue-700 w-auto h-auto px-auto mx-0 my-2 sm:h-16 sm:w-3/4 sm:px-0 md:divide-x-0 md:divide-y-2 md:w-3/4 md:text-[0.9rem] md:justify-center lg:flex-column lg:flex-nowrap lg:mx-0 lg:w-2/3 lg:h-18 lg:divide-x-2 lg:divide-y-0'>
                            <h3 className="mx-auto px-auto py-2 my-auto text-[0.63rem] text-center items-center w-auto h-auto sm:min-w-[7.09rem] sm:mx-2 sm:px-1 sm:text-[0.65rem] sm:pb-0 sm:pt-1 sm:px-0 md:w-auto md:text-[0.73rem] md:px-auto lg:w-1/3 lg:py-0 lg:px-1 lg:text-[0.9rem]">Average Yearly Return For {roRDataNumberOfYears} Years</h3>
                            <h3 className='text-nowrap text-center px-auto my-auto w-auto text-[1.1rem] font-bold font-lato h-auto mx-auto sm:text-[1.15rem] sm:text-center lg:text-[1.9rem] lg:pl-4'>{Math.round(avgYearlyReturn * 1000)/1000}%</h3>
                        </div>
                        <div className='text-[0.63rem] bg-slate-200 min-h-14 font-bold font-sans flex flex-wrap rounded w-auto h-auto px-2 py-auto mx-0 my-2 items-center justify-center text-center sm:h-auto sm:w-3/4 sm:text-[0.7rem] sm:top-[4.5rem] md:w-3/4 md:text-[0.9rem] lg:flex-column lg:flex-nowrap lg:mx-0 lg:w-2/3 lg:h-18 lg:text-center lg:px-auto lg:text-[1rem]'>
                            Your Final Return after {roRDataNumberOfYears} Years is ${finalValueWCommas}
                        </div>
                    </div>
                </div>
                <svg
                viewBox={`0 0 ${width} ${height}`}
                className='my-0'
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
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
                                            className="stroke-blue-950 stroke-[0.5] pointer-events-none"
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
                                                className='text-[3.5px] mx-[4px] sm:text-[4px] lg:text-lg xl:text-lg stroke-sky-50 fill-sky-50 stroke-[0.3] sm:stroke-[0.4] backdrop-invert'
                                                x={xScale(d.year) + xScale.bandwidth()/2}
                                                y={d.RoR >= 0 ? yScale(d.RoR) : yScale(Math.min(0, d.RoR))}  // Ensure y is positive for negative values
                                                dy = {d.RoR >= 0 ? (width <= '500px' ? '4px' : '10px') : '-4px'} //When the screen width is small, it adjusts the location of the text inside each of the bars.
                                                textAnchor="middle"
                                            >
                                            {`${Math.round(d.RoR * 10) / 10}%`}
                                            </text>
                                        </g>
                                        {/* <rect
                                            onMouseEnter={() => {
                                                console.log('MouseEnter Detected')
                                                setHidden(false)
                                            }}
                                            onMouseLeave={() => setHidden(true)}
                                            className={hidden ? "hidden" : "visible fill-slate-400"}
                                            x={xScale(d.year)}
                                            y={d.RoR >= 0 ? yScale(Math.max(0, d.RoR)) : height - margin.bottom - yScale(0)}
                                            width={xScale.bandwidth()}
                                            height={Math.abs(yScale(height - 0))}
                                        /> */}
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
                                                className='text-[3.5px] mx-[5px] sm:text-[6.3px] lg:text-lg xl:text-xl stroke-blue-800 stroke-[0.3] backdrop-invert'
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
                {tooltipVisible && (
                <motion.div
                    className="absolute p-1 text-lg sm:text-base md:text-xl lg:text-2xl text-blue-500 border-solid border-1 border-blue-900 bg-white rounded pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 0.9 }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.5 }}
                    style={{ top: yPos, left: xPos -margin.left -margin.right }}
                    ref={tooltipRef}
                >
                    {tooltipContent}
                </motion.div>
                )}
            </div>
        </>
    );
};

export default BarChart;