import { useState, useEffect } from 'react'
import useMeasure from "react-use-measure";
import { parseISO } from "date-fns";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import styles from './App.module.css';
//import './index.css';
import * as d3 from 'd3';
import AreaGraph from '../assets/AreaGraph/AreaGraph.jsx'
import AreaGraph2 from '../assets/AreaGraph/AreaGraph2.jsx'
import API from '../utils/API.jsx';

function App() {
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
  const [loading, setLoading] = useState(true);

  const fetchMonthlyData = async () => {
    const fetchedData = await API.fetchMonthlyData();
    setData(fetchedData);
    setDates(data.map(d => d.Date));
    setValues(data.map(d => d.Close));
    setLoading(false);
    };

  useEffect(() => {
      fetchMonthlyData();
  }, []);

  return (
    <div className = "my-2 mx-2 h-40 w-full items-center justify-center text-blue-500" ref={ref}>
      { loading ? (
          <p>Loading...</p>
          ) : (
            bounds.width > 0 &&
        <AreaGraph2 height={bounds.height} width={bounds.width} dates={dates} values = {values} data={data}/>
      )}
    </div>
  )
}

export default App
