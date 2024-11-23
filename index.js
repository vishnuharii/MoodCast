// Import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const weather = require("./modules/weather");
const music = require("./modules/music");

// Set up Express app
const app = express();
const port = process.env.PORT || 3000;

// Define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set up public folder
app.use(express.static(path.join(__dirname, "public")));

// PAGE ROUTES
// Home Page
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome" });
});

// Weather and Music Route
app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).render("error", {
      title: "Error",
      message: "City parameter is required.",
    });
  }

  try {
    const weatherData = await weather.getWeather(city);
    const musicData = await music.getMusic(weatherData);

    res.render("weather", {
      title: "Weather and Music",
      weather: weatherData,
      music: musicData,
    });
  } catch (error) {
    console.error("Error in /weather route:", error.message);

    res.status(500).render("error", {
      title: "Error",
      message: "Unable to fetch weather or music data. Please try again later.",
    });
  }
});


// Set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});


