const apiKey = 'N4V3NKK84ONUALBK';
const monthlyData = 'TIME_SERIES_MONTHLY_ADJUSTED';
const stockTicker = 'SPY';
const apiUrl = `https://www.alphavantage.co/query?function=${monthlyData}&symbol=${stockTicker}&apikey=${apiKey}`;

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
            console.log('API response:', data); // Log the entire JSON response for inspection
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
};

export default API;
