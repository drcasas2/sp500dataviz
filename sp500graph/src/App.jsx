import { useState, useEffect } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import AreaGraph2 from "../assets/AreaGraph/AreaGraph2.jsx";
import GaugeChart from "../assets/GaugeChart/GaugeChart.jsx";
import PieChart3 from "../assets/PieChart/PieChart3.jsx";
import BarChart from "../assets/BarChart/BarChart.jsx";
import API from "../utils/API.jsx";
import {
  format,
  startOfYear,
  endOfYear,
  eachYearOfInterval,
  isSameYear,
  parseISO,
} from "date-fns";
import { motion } from "framer-motion";
import "@mantine/core/styles.css";
import { SliderInput } from "../assets/SliderInput/SliderInput.jsx";
import { MantineProvider } from "@mantine/core";

export default function App() {
  let [ref, bounds] = useMeasure();
  const [monthlyClosingData, setMonthlyClosingData] = useState(null);
  const [dates, setDates] = useState([]);
  const [values, setValues] = useState([]);
  const [data, setData] = useState([]);
  const [yearlySectorWeights, setYearlySectorWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState();
  const [barDates, setBarDates] = useState([]);
  const [barValues, setBarValues] = useState([]);
  const [barData, setBarData] = useState([]);
  const [avgYearlyReturn, setAvgYearlyReturn] = useState(0);
  const [roRDataNumberOfYears, setRoRDataNumberOfYears] = useState(0);
  const [initialInvestment, setInitialInvestment] = useState();
  const [yearlyInvestment, setYearlyInvestment] = useState();
  const [updatedStockPrice, setUpdatedStockPrice] = useState();
  const [prevDayStockPrice, setPrevDayStockPrice] = useState();
  const [currentPrice, setCurrentPrice] = useState(null);
  const [previousClose, setPreviousClose] = useState(null);
  const [fiftyTwoWeekHigh, setFiftyTwoWeekHigh] = useState(null);
  const [fiftyTwoWeekLow, setFiftyTwoWeekLow] = useState(null);

  const fetchPreviousClose = async () => {
    try {
      const quoteData = await API.prevDayCloseQuote();
      if (quoteData) {
        const prevClose = quoteData.previousClose;
        const fiftyTwoWeekH = quoteData.fiftyTwoWeekHigh;
        const fiftyTwoWeekL = quoteData.fiftyTwoWeekLow;
        setPreviousClose(prevClose);
        setFiftyTwoWeekHigh(fiftyTwoWeekH);
        setFiftyTwoWeekLow(fiftyTwoWeekL);
      }
    } catch (error) {
      console.error("Error fetching previous close:", error);
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const price = await API.realtimeQuote();
      if (price !== null) {
        setCurrentPrice(price);
      }
    } catch (error) {
      console.error("Error fetching current price:", error);
    }
  };

  const fetchMonthlyData = async () => {
    const fetchedData = await API.fetchMonthlyData();
    const sortedData = fetchedData.reverse();
    setData(sortedData);
    setDates(sortedData.map((d) => d.Date));
    setValues(sortedData.map((d) => d.Close));
  };

  const fetchYearlySectorWeights = async () => {
    const fetchedData = await API.yearlySectorWeights;
    const sortedData = fetchedData.reverse();
    setYearlySectorWeights(sortedData);
  };

  const fetchYearlyReturns = async () => {
    const fetchedData = await API.fetchMonthlyData();
    if (!fetchedData || !Array.isArray(fetchedData)) {
      console.error("Invalid data format");
      return;
    }

    const sortedData = fetchedData.reverse();
    const yearlyData = {};

    sortedData.forEach((d) => {
      if (!d[0]) {
        console.error("Missing date in data:", d);
        return;
      }
      const date = d[0];
      const value = d[1];
      const year = date.getFullYear();
      if (!yearlyData[year]) {
        yearlyData[year] = [];
      }
      yearlyData[year].push(d);
    });

    const firstLastMonthData = [];
    const yearlyRoRData = [];

    Object.keys(yearlyData).forEach((year) => {
      const yearData = yearlyData[year];
      if (yearData.length > 0) {
        firstLastMonthData.push(yearData[0]);
        firstLastMonthData.push(yearData[yearData.length - 1]);
        yearlyRoRData.push({
          year: year,
          RoR:
            ((yearData[yearData.length - 1][1] - yearData[0][1]) /
              yearData[0][1]) *
            100,
        });
      }
    });

    const totalRoR = yearlyRoRData.reduce((sum, d) => sum + d.RoR, 0);
    const avgRoR = totalRoR / yearlyRoRData.length;

    setRoRDataNumberOfYears(yearlyRoRData.length);
    setAvgYearlyReturn(avgRoR);
    setBarData(yearlyRoRData);
    setBarDates(yearlyRoRData.year);
    setBarValues(yearlyRoRData.map((d) => d.RoR));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        if (isMounted) {
          await fetchPreviousClose();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await fetchCurrentPrice();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await fetchMonthlyData();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await fetchYearlySectorWeights();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await fetchYearlyReturns();
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (yearlySectorWeights.length > 0) {
      setYear(yearlySectorWeights[yearlySectorWeights.length - 1].Year);
    }
  }, [yearlySectorWeights]);

  const handleInitialInvestment = (event) => {
    setInitialInvestment(event.target.value);
  };

  const handleYearlyInvestment = (event) => {
    setYearlyInvestment(event.target.value);
  };

  // Rest of your return statement remains the same
  return (
    <MantineProvider>
      <>
        <motion.h1
          className="text-center text-3xl font-extrabold font-sans text-blue-700 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4, delay: 0.5, type: "spring" }}
        >
          S&P 500 Data (1993 - 2024)
        </motion.h1>
        <motion.h3 className="text-blue-600 -mt-1 text-sm text-center font-bold">
          All visualized data is using SPDR S&P 500 ETF Trust (SPY)
        </motion.h3>
        <div
          className="my-2 mx-2 h-80 w-full items-center justify-center text-blue-600"
          ref={ref}
        >
          {loading ? (
            <h2 className="w-full text-3xl text-center items-center justify-center  mx-auto">
              Loading...
            </h2>
          ) : (
            bounds.width > 0 && (
              <>
                <p>
                  Current SPY Price:{" "}
                  {currentPrice !== null ? currentPrice.toFixed(2) : "N/A"}
                </p>
                <p>
                  Previous Close:{" "}
                  {previousClose !== null ? previousClose.toFixed(2) : "N/A"}
                </p>
                <motion.div
                  className=" mx-auto rounded overflow-hidden shadow-lg my-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                >
                  <h2 className="text-center font-bold text-xl">
                    Monthly Closing Values Over 32 Years
                  </h2>
                  <AreaGraph2
                    className="mb-2"
                    height={bounds.height}
                    width={bounds.width}
                    dates={dates}
                    values={values}
                    data={data}
                  />
                </motion.div>
                {yearlySectorWeights.length > 0 && (
                  <motion.div className="w-4/5 rounded overflow-hidden shadow-md mx-auto my-6">
                    <h1 className="text-center font-bold text-xl">
                      Yearly Sector Weighting
                    </h1>
                    <motion.div
                      className="-mb-20 mt-3 md:-mb-10"
                      width="100%"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0,
                        ease: [0, 0.71, 0.2, 1.01],
                      }}
                    >
                      <SliderInput
                        value={year}
                        onChange={setYear}
                        className="mt-2 mx-4 text-blue-500"
                        min={yearlySectorWeights[0].Year}
                        max={
                          yearlySectorWeights[yearlySectorWeights.length - 1]
                            .Year
                        }
                      />
                    </motion.div>
                    <motion.div
                      className=""
                      width="100%"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0,
                        ease: [0, 0.71, 0.2, 1.01],
                      }}
                    >
                      <PieChart3
                        className=""
                        height={bounds.height}
                        width={bounds.width}
                        yearlySectorWeights={yearlySectorWeights}
                        year={year}
                      />
                    </motion.div>
                  </motion.div>
                )}
                <motion.div className="relative h-max w-full mx-auto rounded overflow-hidden shadow-lg">
                  <BarChart
                    className="my-20"
                    height={bounds.height}
                    width={bounds.width}
                    barData={barData}
                    roRDataNumberOfYears={roRDataNumberOfYears}
                    avgYearlyReturn={avgYearlyReturn}
                  />
                </motion.div>
                <div className=" h-auto w-full mx-auto rounded shadow-lg">
                  <h2 className="text-center font-bold w-1/2 text-2xl mx-auto px-0">
                    Current Daily Change
                  </h2>
                  <div className="py-4">
                    <GaugeChart
                      height={bounds.height}
                      width={bounds.width}
                      currentPrice={currentPrice}
                      previousClose={previousClose}
                      fiftyTwoWeekHigh={fiftyTwoWeekHigh}
                      fiftyTwoWeekLow={fiftyTwoWeekLow}
                    />
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </>
    </MantineProvider>
  );
}
