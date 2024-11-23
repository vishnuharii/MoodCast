# MoodCast

Moodcast
Moodcast is a web application that offers personalized weather and music recommendations based on the user's mood and the current weather conditions in their city. It combines weather data and music playlists to create a mood-boosting experience, perfect for any time of the day!

Overview
Moodcast fetches the current weather data for a given city and matches it with music tracks that fit the weather condition, making it an ideal companion to brighten your day.

Users can input a city and get the current weather conditions.
The app will then suggest music tracks suited to the weather.
The application is built using Node.js and Express.

Installation
Clone the repository: git clone https://github.com/vishnuharii/MoodCast.git

Navigate to the project folder: cd MoodCast

Create a .env file in the root of the project and add your API keys:
WEATHER_API_KEY=your_weatherapi_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
PORT=3000

Install dependencies : npm i

Run the application: npm run dev