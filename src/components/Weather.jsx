
import { useState } from "react";
import axios from "axios";
import "./Weather.css";

function Weather() {

  const [city, setCity] = useState("");

  const [weather, setWeather] = useState(null);
  
  const [error, setError] = useState("");
  
  const [loading, setLoading] = useState(false);

  const getWeather = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name!");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    try {
      if (!apiKey) {
        throw new Error("API key is missing");
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&appid=${apiKey}&units=metric`;

      const response = await axios.get(url);
      setWeather(response.data);

    } catch (err) {
      if (err.response?.status === 404) {
        setError("City not found. Try another city.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key. Please check your key.");
      } else {
        setError("Unable to fetch weather. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="weather-page">
      <section className="weather-box">
        <div className="floating-cloud">🌤️</div>

        <h1>🌦️ Weather Report</h1>
        <p className="subtitle">
          Let's discover the weather in your city!
        </p>

        <form onSubmit={getWeather} className="weather-form">
          <input
            type="text"
            placeholder="Enter city name"
            aria-label="City name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Get Report →"}
          </button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        <div className="weather-result" aria-live="polite">
          <p>
            <strong>City:</strong> {weather?.name || "—"}
          </p>

          <p>
            <strong>Weather:</strong>{" "}
            {weather?.weather[0].main || "—"}
          </p>

          <p>
            <strong>Temperature:</strong>{" "}
            {weather ? `${Math.round(weather.main.temp)}°C` : "—"}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {weather?.weather[0].description || "—"}
          </p>

          {weather && (
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          )}
        </div>

        <p className="footer-text">
          ☁ Simple weather, beautifully presented
        </p>
      </section>
    </main>
  );
}

export default Weather;
