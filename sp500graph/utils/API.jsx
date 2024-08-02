import * as d3 from 'd3';

const apiKey = '58e9634c43c04daaa1cd52796aa74f7aef'; //If that one doesn't work, try this one: e7d90402b4004aaeb8cec4e6da195607
//const apiKey = 'N4V3NKK84ONUALBK';
//const apiToken = 'pk_ff7603d357ef45529330f9757e0b7ed7';

//const monthlyData = 'TIME_SERIES_MONTHLY_ADJUSTED';
const stockTicker = 'SPY';
const monthlyInterval = '1month';
const yearlyInterval = '1year';
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

    yearlySectorWeights: [
        {
            Year: 2023,
            Sector: {
                "Communication Services": 9,
                "Consumer Discretionary": 11,
                "Consumer Staples": 7,
                Energy: 4,
                Financials: 13,
                "Health Care": 13,
                Industrials: 8,
                "Information Technology": 27,
                Materials: 2,
                "Real Estate": 2,
                Utilities: 2
            }
        },
        {
            Year: 2022,
            Sector: {
                "Communication Services": 8,
                "Consumer Discretionary": 9,
                "Consumer Staples": 8,
                Energy: 5,
                Financials: 14,
                "Health Care": 15,
                Industrials: 9,
                "Information Technology": 23,
                Materials: 3,
                "Real Estate": 3,
                Utilities: 3
            }
        },
        {
            Year: 2021,
            Sector: {
                "Communication Services": 15,
                "Consumer Discretionary": 13,
                "Consumer Staples": 6,
                Energy: 3,
                Financials: 11,
                "Health Care": 13,
                Industrials: 7,
                "Information Technology": 25,
                Materials: 2,
                "Real Estate": 3,
                Utilities: 2
            }
        },
        {
            Year: 2020,
            Sector: {
                "Communication Services": 14,
                "Consumer Discretionary": 13,
                "Consumer Staples": 7,
                Energy: 2,
                Financials: 10,
                "Health Care": 12,
                Industrials: 8,
                "Information Technology": 26,
                Materials: 2,
                "Real Estate": 2,
                Utilities: 2
            }
        },
        {
            Year: 2019,
            Sector: {
                "Communication Services": 14,
                "Consumer Discretionary": 10,
                "Consumer Staples": 8,
                Energy: 4,
                Financials: 13,
                "Health Care": 13,
                Industrials: 8,
                "Information Technology": 23,
                Materials: 2,
                "Real Estate": 3,
                Utilities: 3
            }
        },
        {
            Year: 2018,
            Sector: {
                "Communication Services": 13,
                "Consumer Discretionary": 10,
                "Consumer Staples": 8,
                Energy: 4,
                Financials: 13,
                "Health Care": 14,
                Industrials: 8,
                "Information Technology": 22,
                Materials: 2,
                "Real Estate": 3,
                Utilities: 3
            }
        },
        {
            Year: 2017,
            Sector: {
                "Communication Services": 13,
                "Consumer Discretionary": 10,
                "Consumer Staples": 9,
                Energy: 5,
                Financials: 15,
                "Health Care": 12,
                Industrials: 9,
                "Information Technology": 19,
                Materials: 2,
                "Real Estate": 3,
                Utilities: 3
            }
        },
        {
            Year: 2016,
            Sector: {
                "Communication Services": 13,
                "Consumer Discretionary": 9,
                "Consumer Staples": 10,
                Energy: 6,
                Financials: 15,
                "Health Care": 12,
                Industrials: 10,
                "Information Technology": 17,
                Materials: 2,
                "Real Estate": 3,
                Utilities: 3
            }
        },
        {
            Year: 2015,
            Sector: {
                "Communication Services": 13,
                "Consumer Discretionary": 10,
                "Consumer Staples": 10,
                Energy: 6,
                Financials: 14,
                "Health Care": 14,
                Industrials: 9,
                "Information Technology": 16,
                Materials: 2,
                "Real Estate": 3,
                Utilities: 3
            }
        },
        {
            Year: 2014,
            Sector: {
                "Communication Services": 10,
                "Consumer Discretionary": 9,
                "Consumer Staples": 10,
                Energy: 7,
                Financials: 16,
                "Health Care": 14,
                Industrials: 10,
                "Information Technology": 16,
                Materials: 2,
                "Real Estate": 3,
                Utilities: 3
            }
        },
        {
            Year: 2013,
            Sector: {
                "Communication Services": 38,
                "Consumer Discretionary": 6,
                "Consumer Staples": 7,
                Energy: 6,
                Financials: 11,
                "Health Care": 9,
                Industrials: 7,
                "Information Technology": 11,
                Materials: 2,
                "Real Estate": 2,
                Utilities: 2
            }
        },
        {
            Year: 2012,
            Sector: {
                "Communication Services": 33,
                "Consumer Discretionary": 6,
                "Consumer Staples": 8,
                Energy: 7,
                Financials: 11,
                "Health Care": 8,
                Industrials: 7,
                "Information Technology": 14,
                Materials: 2,
                "Real Estate": 2,
                Utilities: 3
            }
        },
        {
            Year: 2011,
            Sector: {
                "Communication Services": 33,
                "Consumer Discretionary": 6,
                "Consumer Staples": 9,
                Energy: 7,
                Financials: 10,
                "Health Care": 8,
                Industrials: 7,
                "Information Technology": 13,
                Materials: 2,
                "Real Estate": 2,
                Utilities: 2
            }
        },
        {
            Year: 2010,
            Sector: {
                "Communication Services": 32,
                "Consumer Discretionary": 6,
                "Consumer Staples": 8,
                Energy: 7,
                Financials: 12,
                "Health Care": 9,
                Industrials: 8,
                "Information Technology": 12,
                Materials: 2,
                "Real Estate": 1,
                Utilities: 2
            }
        },
        {
            Year: 2009,
            Sector: {
                "Communication Services": 35,
                "Consumer Discretionary": 5,
                "Consumer Staples": 8,
                Energy: 7,
                Financials: 12,
                "Health Care": 9,
                Industrials: 7,
                "Information Technology": 13,
                Materials: 2,
                "Real Estate": 1,
                Utilities: 2
            }
        },
        {
            Year: 2008,
            Sector: {
                "Communication Services": 26,
                "Consumer Discretionary": 4,
                "Consumer Staples": 10,
                Energy: 9,
                Financials: 12,
                "Health Care": 10,
                Industrials: 8,
                "Information Technology": 13,
                Materials: 2,
                "Real Estate": 1,
                Utilities: 3
            }
        },
        {
            Year: 2007,
            Sector: {
                "Communication Services": 34,
                "Consumer Discretionary": 4,
                "Consumer Staples": 7,
                Energy: 8,
                Financials: 13,
                "Health Care": 9,
                Industrials: 8,
                "Information Technology": 10,
                Materials: 2,
                "Real Estate": 1,
                Utilities: 3
            }
        },
        {
            Year: 2006,
            Sector: {
                "Communication Services": 27,
                "Consumer Discretionary": 5,
                "Consumer Staples": 8,
                Energy: 8,
                Financials: 17,
                "Health Care": 9,
                Industrials: 9,
                "Information Technology": 11,
                Materials: 2,
                "Real Estate": 2,
                Utilities: 3
            }
        },
        {
            Year: 2005,
            Sector: {
                "Communication Services": 26,
                "Consumer Discretionary": 5,
                "Consumer Staples": 8,
                Energy: 8,
                Financials: 17,
                "Health Care": 10,
                Industrials: 10,
                "Information Technology": 11,
                Materials: 2,
                "Real Estate": 1,
                Utilities: 3
            }
        },
        {
            Year: 2004,
            Sector: {
                "Communication Services": 16,
                "Consumer Discretionary": 7,
                "Consumer Staples": 10,
                Energy: 7,
                Financials: 19,
                "Health Care": 12,
                Industrials: 11,
                "Information Technology": 13,
                Materials: 2,
                "Real Estate": 1,
                Utilities: 3
            }
        },
        {
            Year: 2003,
            Sector: {
                "Communication Services": 5,
                "Consumer Discretionary": 6,
                "Consumer Staples": 12,
                Energy: 7,
                Financials: 20,
                "Health Care": 15,
                Industrials: 12,
                "Information Technology": 17,
                Materials: 2,
                "Real Estate": 1,
                Utilities: 3
            }
        },
        {
            Year: 2002,
            Sector: {
                "Communication Services": 5,
                "Consumer Discretionary": 5,
                "Consumer Staples": 13,
                Energy: 7,
                Financials: 20,
                "Health Care": 15,
                Industrials: 12,
                "Information Technology": 16,
                Materials: 2,
                "Real Estate": 1,
                Utilities: 3
            }
        },
        {
            Year: 2001, // This data is inaccurate
            Sector: {
                "Communication Services": 5,
                "Consumer Discretionary": 13.1,
                "Consumer Staples": 8.2,
                Energy: 7,
                Financials: 17.8,
                "Health Care": 14.4,
                Industrials: 11.3,
                "Information Technology": 17.6,
                Materials: 2.6,
                "Real Estate": 1,
                Utilities: 3.1
            }
        }
    ],

    // sectorWeightings: [
    //     {
    //         Year: 1990,
    //         Sector: {
    //             Financials: 7.5,
    //             Technology: 6.3,
    //             Healthcare: 10.4,
    //             Industrials: 13.6,
    //             "Cons Disc": 12.8,
    //             Energy: 13.4,
    //             "Cons Stap": 14.0,
    //             Utilities: 6.2,
    //             Telecom: 8.7,
    //             Materials: 7.2
    //         }
    //     },
    //     {
    //         Year: 1991,
    //         Sector: {
    //             Financials: 8.7, // Fill in the actual values here
    //             Technology: 5.3,
    //             Healthcare: 12.4,
    //             Industrials: 13.2,
    //             "Consumer Discretionary": 14.0,
    //             Energy: 10.6,
    //             "Consumer Staples": 15.2,
    //             Utilities: 5.8,
    //             Telecom: 8.0,
    //             Materials: 6.8
    //         }
    //     },
    //     {
    //         Year: 1992,
    //         Sector: {
    //             Financials: 10.6, // Fill in the actual values here
    //             Technology: 5.3,
    //             Healthcare: 12.4,
    //             Industrials: 13.2,
    //             "Consumer Discretionary": 14.0,
    //             Energy: 10.6,
    //             "Consumer Staples": 15.2,
    //             Utilities: 5.8,
    //             Telecom: 8.0,
    //             Materials: 6.8
    //         }
    //     },
    // ],
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
            const parsedData = data.values.map(d => ([
                parseDate(d.datetime),
                parseFloat(d.close)
            ]));
            console.log('Processed data:', parsedData);

            // Return the processed data
            return parsedData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Rethrow the error for handling in the calling code if needed
        }
    },
    realtimeQuote: async () => {

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'd4254f019amsh4409182db38e154p1cf8b7jsn9e16217755dd',
                'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(`https://twelve-data1.p.rapidapi.com/price?format=json&outputsize=30&symbol=${stockTicker}`, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Realtime data:', data.price)
            return data.price;
        } catch (error) {
            console.error('Error fetching Realtime data:', error);
            throw error; // Rethrow the error for handling in the calling code if needed
        }
    },
    prevDayCloseQuote: async() => {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'd4254f019amsh4409182db38e154p1cf8b7jsn9e16217755dd',
                'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(`https://twelve-data1.p.rapidapi.com/quote?symbol=${stockTicker}&outputsize=30&format=json&interval=1day`, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const relevantData = {previous_close: data.previous_close, todays_percent_change: data.percent_change, todays_open: data.open, fifty_two_week_high: data.fifty_two_week.high, fifty_two_week_low: data.fifty_two_week.low };
            console.log('data:', relevantData)
            return relevantData;
        } catch (error) {
            console.error('Error fetching Quote data:', error);
            throw error; // Rethrow the error for handling in the calling code if needed
        }
    }
};

export default API;
