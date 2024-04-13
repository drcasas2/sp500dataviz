import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './App.module.css';
import * as d3 from 'd3';
import AreaGraph from '../assets/AreaGraph/AreaGraph.jsx'
import API from '../../utils/API.jsx';

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

  const [monthlyClosingData, setMonthlyClosingData] = useState(null);
  const [dates, setDates] = useState([]);
  const [values, setValues] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
      const fetchMonthlyData = async () => {
              const d = await API.fetchMonthlyData();
              setData(d);
      };

      fetchMonthlyData();
  }, []);

  useEffect(() => {
    if (data) {
        setDates(data.values.map(dat => dat.datetime));
        setValues(data.values.map(dat => parseFloat(dat.close)));
        console.log(`values are ${values} and dates are ${dates}`);
    }
}, [data]);

  return (
    <>
      <div className = "App">
        <AreaGraph height='auto' width='50%' dates={dates} values = {values}/>
      </div>
      <div className="card">
      </div>
    </>
  )
}

export default App
