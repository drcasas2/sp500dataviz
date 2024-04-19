import * as d3 from 'd3';

const apiKey = '58e9634c43c04daaa1cd52796aa74f7aef';
//const apiKey = 'N4V3NKK84ONUALBK';
//const apiToken = 'pk_ff7603d357ef45529330f9757e0b7ed7';

//const monthlyData = 'TIME_SERIES_MONTHLY_ADJUSTED';
const stockTicker = 'SPY';
const monthlyInterval = '1month';
const weeklyInterval = '1week';
const dailyInterval = '1day';

// const start = '607410000';
// const end = Date.now();
// const date = 1712933535 <- UNIX End date in 2024
//const apiUrl = `https://api.finazon.io/latest?/time_series?dataset=us_stocks_essential&ticker=${stockTicker}&interval=${interval}&start_at=${start}&end_at=${end}`;
//const apiUrl = `https://api.finazon.io/latest/time_series?dataset=sip_non_pro&ticker=${stockTicker}&interval=${interval}&start_at=${start}&end_at${end}`
//const apiUrl = `https://api.iex.cloud/v1/data/core/historical_prices/${stockTicker}?range=${range}&token=${apiToken}`;
//const apiUrl = `https://api.iex.cloud/v1/query?function=${monthlyData}&symbol=${stockTicker}&apikey=${apiKey}`;

const API = {
    fetchMonthlyData: async () => {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'd4254f019amsh4409182db38e154p1cf8b7jsn9e16217755dd',
                'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(`https://twelve-data1.p.rapidapi.com/time_series?symbol=${stockTicker}&interval=${monthlyInterval}&outputsize=5000&format=json`, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Monthly data:', data);
            const parseDate = d3.timeParse("%Y-%m-%d");
            const parsedData = data.values.map(d => ({
                Date: parseDate(d.datetime),
                Close: parseFloat(d.close)
            }));
            console.log('Processed data:', parsedData);

            // Return the processed data
            return parsedData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Rethrow the error for handling in the calling code if needed
        }
    }
};

export default API;
