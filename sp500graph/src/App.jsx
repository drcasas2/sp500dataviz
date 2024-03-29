import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as d3 from 'd3';
import AreaGraph from '../assets/AreaGraph/AreaGraph.jsx'
import API from '../../utils/API.jsx';

function App() {
  // const [count, setCount] = useState(0)

  const revenueData = [
    52.13,
    53.98,
    67.00,
    89.70,
    99.0,
    130.28,
    166.70,
    234.98,
    345.44,
    443.34,
    543.70,
    556.13,
  ];

  const months = ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October",
                "November","December"];

  const parseMonths = d3.timeParse("%B"); // %B is the  nomenclature used in the timeParse method in the d3 library that allows you to turn the months into the time format, and abbreviate/pull the month name from that newly formatted data.

  const [monthlyClosingData, setMonthlyClosingData] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const data = await API.fetchData();
              setMonthlyClosingData(data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
  }, []);

  console.log('The data fetched at App.jsx is' + API.fetchData()) //work on fetching the S&P500 data
  return (
    <>
      <div className = "App">
        <AreaGraph months = {months} revenueData = {revenueData} parseMonths={parseMonths} data={monthlyClosingData}/>
      </div>
      <div className="card">
      </div>
    </>
  )
}

export default App
