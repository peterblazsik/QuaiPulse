import { NextResponse } from "next/server";

// Zurich: 47.3769, 8.5417 | Vienna: 48.2082, 16.3738
const CITIES = {
  zurich: { lat: 47.3769, lng: 8.5417 },
  vienna: { lat: 48.2082, lng: 16.3738 },
};

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

function weatherCodeToIcon(code: number): string {
  if (code <= 1) return "sun";
  if (code <= 3) return "cloud-sun";
  if (code <= 48) return "cloud";
  if (code <= 67) return "cloud-rain";
  if (code <= 77) return "snow";
  if (code <= 99) return "cloud-rain";
  return "cloud";
}

function weatherCodeToCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 1) return "Mainly Clear";
  if (code <= 2) return "Partly Cloudy";
  if (code <= 3) return "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 55) return "Drizzle";
  if (code <= 57) return "Freezing Drizzle";
  if (code <= 65) return "Rain";
  if (code <= 67) return "Freezing Rain";
  if (code <= 75) return "Snow";
  if (code <= 77) return "Snow Grains";
  if (code <= 82) return "Rain Showers";
  if (code <= 86) return "Snow Showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

async function fetchCityWeather(city: keyof typeof CITIES) {
  const { lat, lng } = CITIES[city];
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: "temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max",
    timezone: city === "zurich" ? "Europe/Zurich" : "Europe/Vienna",
    forecast_days: "7",
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Weather fetch failed for ${city}`);
  const data: OpenMeteoResponse = await res.json();

  const current = {
    temp: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition: weatherCodeToCondition(data.current.weather_code),
    icon: weatherCodeToIcon(data.current.weather_code),
    humidity: data.current.relative_humidity_2m,
    wind: Math.round(data.current.wind_speed_10m),
    sunrise: data.daily.sunrise[0]?.split("T")[1]?.slice(0, 5) ?? "",
    sunset: data.daily.sunset[0]?.split("T")[1]?.slice(0, 5) ?? "",
    uvIndex: Math.round(data.daily.uv_index_max[0] ?? 0),
    visibility: 15, // Open-Meteo doesn't provide visibility in free tier
  };

  const forecast = data.daily.time.map((date, i) => {
    const d = new Date(date);
    return {
      day: i === 0 ? "Today" : DAY_NAMES[d.getDay()],
      icon: weatherCodeToIcon(data.daily.weather_code[i]),
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      condition: weatherCodeToCondition(data.daily.weather_code[i]),
      precip: data.daily.precipitation_probability_max[i] ?? 0,
    };
  });

  return { current, forecast };
}

export async function GET() {
  try {
    const [zurich, vienna] = await Promise.all([
      fetchCityWeather("zurich"),
      fetchCityWeather("vienna"),
    ]);

    return NextResponse.json(
      { zurich, vienna },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 502 }
    );
  }
}
