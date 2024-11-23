const dotenv = require('dotenv');

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing Spotify Client ID or Client Secret in environment variables.");
}

let accessToken = null;
let tokenExpiry = null;

// Function to get Spotify access token
const getAccessToken = async () => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error(`Error getting access token: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000; // Set token expiry
  } catch (error) {
    console.error("Error fetching access token: ", error);
    throw error;
  }
};

// Function to ensure a valid access token
const ensureValidToken = async () => {
  if (!accessToken || (tokenExpiry && Date.now() >= tokenExpiry)) {
    await getAccessToken();
  }
};

// Function to get a playlist based on the weather
const getMusic = async (weatherData) => {
  await ensureValidToken();

  let mood = 'happy'; // Default mood

  // Map weather conditions to moods
  const condition = weatherData.current.condition.text.toLowerCase();
  const temp = weatherData.current.temp_c;

  if (condition.includes('rain')) {
    mood = 'rainy';
  } else if (condition.includes('snow')) {
    mood = 'cozy';
  } else if (condition.includes('clear') || condition.includes('sun')) {
    mood = temp > 30 ? 'energetic' : 'relaxed';
  } else if (condition.includes('cloud')) {
    mood = 'chill';
  } else if (condition.includes('storm')) {
    mood = 'moody';
  }

  try {
    // Fetch multiple playlists (limit set to 10 for variety)
    const encodedQuery = encodeURIComponent(`${mood} playlist`);
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=playlist&limit=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching music data: ${response.statusText}`);
    }

    const data = await response.json();

    // Select a random playlist from the results
    const playlists = data.playlists.items;
    if (playlists.length === 0) {
      throw new Error("No playlists found for the given mood.");
    }

    const randomIndex = Math.floor(Math.random() * playlists.length);
    return playlists[randomIndex];
  } catch (error) {
    console.error("Error fetching music data: ", error);
    throw error;
  }
};

module.exports = { getMusic };
