//const apiKey = 'N4V3NKK84ONUALBK';
const apiToken = 'pk_ff7603d357ef45529330f9757e0b7ed7';

//const monthlyData = 'TIME_SERIES_MONTHLY_ADJUSTED';
const stockTicker = 'SPY';
const range = '67y';
const apiUrl = `https://api.iex.cloud/v1/data/core/historical_prices/${stockTicker}?range=${range}&token=${apiToken}`;
// `https://api.iex.cloud/v1/query?function=${monthlyData}&symbol=${stockTicker}&apikey=${apiKey}`;

const API = {
    fetchData: () => {
        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Filter data to get only monthly closing prices
            const monthlyData = data.filter(item => {
            // Assuming 'date' is the key for the date field in your data
            return item.priceDate.endsWith('-01'); // Filter by the first day of each month
            });
            console.log('Monthly data:', monthlyData); // Log the entire JSON response for inspection
            return monthlyData;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
};

export default API;
