// Uncomment if `fetch` is unavailable in your Node.js version
// const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.WEATHER_API_KEY;

if (!apiKey) {
  throw new Error("Missing WEATHER_API_KEY in environment variables.");
}

const getWeather = async (city) => {
  if (!city || typeof city !== 'string') {
    throw new Error("Invalid city parameter. Provide a valid city name as a string.");
  }

  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Handle specific HTTP status codes
      const errorMessage = `Error fetching weather data (Status: ${response.status})`;
      if (response.status === 400) {
        throw new Error(`${errorMessage} - Invalid city name or query.`);
      } else if (response.status === 401) {
        throw new Error(`${errorMessage} - Unauthorized. Check your API key.`);
      } else if (response.status === 500) {
        throw new Error(`${errorMessage} - Server error. Try again later.`);
      } else {
        throw new Error(errorMessage);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data: ", error.message);
    throw error;
  }
};

module.exports = { getWeather };
