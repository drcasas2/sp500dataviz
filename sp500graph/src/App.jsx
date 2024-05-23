import { useState, useEffect } from 'react'
//import useMeasure from "react-use-measure";
import { useMeasure } from "@uidotdev/usehooks";
import { parseISO } from "date-fns";
import { format, startOfYear, startOfMonth, startOfQuarter, endOfYear, endOfMonth, endOfQuarter, eachYearOfInterval, eachMonthOfInterval, eachQuarterOfInterval, isSameYear, isSameMonth, isSameQuarter } from "date-fns";
//import styles from './App.module.css';
//import './index.css';
import * as d3 from 'd3';
import AreaGraph from '../assets/AreaGraph/AreaGraph.jsx'
import AreaGraph2 from '../assets/AreaGraph/AreaGraph2.jsx'
import PieChart from '../assets/PieChart/PieChart.jsx'
import API from '../utils/API.jsx';
import { motion } from "framer-motion";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

export default function App() {
  // const [count, setCount] = useState(0)

  // const revenueData = [
  //   52.13,
  //   53.98,
  //   67.00,
  //   89.70,
  //   99.0,
  //   130.28,
  //   166.70,
  //   234.98,
  //   345.44,
  //   443.34,
  //   543.70,
  //   556.13,
  // ];

  // const months = ["January", "February", "March", "April", "May",
  //               "June", "July", "August", "September", "October",
  //               "November","December"];

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

  // endOfYear(data.at(-1)[0])

  //const fetch

  useEffect(() => {
      fetchMonthlyData();
      fetchYearlySectorWeights();
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
        className='text-center text-2xl font-extrabold font-sans text-blue-500'
        initial = {{ opacity: 0}}
        animate = {{ opacity: 1 }}
        transition = {{ duration: 4, delay: 0.5, type: "spring" }}
        >
          S&P 500 Data (1993 - 2024)
          </motion.h1>
        <div
          className = "my-2 mx-2 h-80 w-full items-center justify-center text-blue-500" ref={ref}
        >
          { loading ? (
              <h1 className="w-full text-2xl text-center items-center justify-center">Loading...</h1>
              ) : (
                bounds.width > 0 &&(
              <>
                <AreaGraph2 height={bounds.height} width={bounds.width} dates={dates} values = {values} data={data}/>
                  <form>
                    <label htmlFor= "year">Year:</label>
                    <input type = "number" value= {year || ''} onChange={e => setYear(Number(e.target.value))} />
                  </form>
                <PieChart height={bounds.height} width={bounds.width} yearlySectorWeights = {yearlySectorWeights} year={year} className = 'w-full text-center items-center justify-center'/>
              </>
          ))}
        </div>
      </>
    </MantineProvider>
  )
}