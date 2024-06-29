import { useState, useEffect } from 'react';
import { useMeasure } from "@uidotdev/usehooks";
import AreaGraph2 from '../assets/AreaGraph/AreaGraph2.jsx';
import PieChart3 from '../assets/PieChart/PieChart3.jsx';
import API from '../utils/API.jsx';
import { motion } from "framer-motion";
import '@mantine/core/styles.css';
import { SliderInput } from '../assets/SliderInput/SliderInput.jsx'; // Adjust the import path as needed
import { MantineProvider } from '@mantine/core';

export default function App() {
    let [ref, bounds] = useMeasure();
    const [monthlyClosingData, setMonthlyClosingData] = useState(null);
    const [dates, setDates] = useState([]);
    const [values, setValues] = useState([]);
    const [data, setData] = useState([]);
    const [yearlySectorWeights, setYearlySectorWeights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState();

    const fetchMonthlyData = async () => {
        const fetchedData = await API.fetchMonthlyData();
        const sortedData = fetchedData.reverse(); // Sorted the data in ascending order (oldest date first).
        setData(sortedData);
        setDates(data.map(d => d.Date));
        setValues(data.map(d => d.Close));
        setLoading(false);
    };

    const fetchYearlySectorWeights = async () => {
        const fetchedData = await API.yearlySectorWeights;
        const sortedData = fetchedData.reverse();
        setYearlySectorWeights(sortedData);
        setLoading(false);
    }

    useEffect(() => {
        fetchMonthlyData().then(fetchYearlySectorWeights());
    }, []);

    useEffect(() => {
        if (yearlySectorWeights.length > 0) {
            setYear(yearlySectorWeights[yearlySectorWeights.length - 1].Year);
        }
    }, [yearlySectorWeights]);

    return (
        <MantineProvider>  
            <>
                <motion.h1
                    className='text-center text-2xl font-extrabold font-sans text-blue-500 mt-3'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 4, delay: 0.5, type: "spring" }}
                >
                    S&P 500 Data (1993 - 2024)
                </motion.h1>
                <div className="my-2 mx-2 h-80 w-full items-center justify-center text-blue-500" ref={ref}>
                    { loading ? (
                        <h1 className="w-full text-2xl text-center items-center justify-center">Loading...</h1>
                    ) : (
                        bounds.width > 0 &&(
                        <>
                            <motion.div
                                className="box"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0,
                                    ease: [0, 0.71, 0.2, 1.01]
                                }}
                            >
                                <AreaGraph2 className='mb-2' height={bounds.height} width={bounds.width} dates={dates} values={values} data={data}/>
                            </motion.div>
                            <motion.div
                                className="m-0"
                                width='100%'
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0,
                                    ease: [0, 0.71, 0.2, 1.01]
                                }}
                            >
                                <SliderInput value={year} onChange={setYear} className="mt-2 mx-4 text-blue-500" min={yearlySectorWeights[0].Year} max={yearlySectorWeights[yearlySectorWeights.length - 1].Year}/>
                            </motion.div>
                            <motion.div
                                className="m-0"
                                width='100%'
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0,
                                    ease: [0, 0.71, 0.2, 1.01]
                                }}
                            >
                                <PieChart3 className='-mt-40 border-solid border-slate-900 border-2' height={bounds.height} width={bounds.width} yearlySectorWeights={yearlySectorWeights} year={year}/>
                            </motion.div>
                        </>
                        )
                    )}
                </div>
            </>
        </MantineProvider>
    );
}