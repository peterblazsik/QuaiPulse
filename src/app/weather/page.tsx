"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Snowflake,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  RefreshCw,
} from "lucide-react";

interface CurrentWeather {
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

interface ForecastDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  condition: string;
  precip: number;
}

interface CityWeather {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

interface WeatherData {
  zurich: CityWeather;
  vienna: CityWeather;
}

// Fallback data for when API fails
const FALLBACK: WeatherData = {
  zurich: {
    current: { temp: 14, feelsLike: 12, condition: "Partly Cloudy", icon: "cloud-sun", humidity: 62, wind: 12, visibility: 15, uvIndex: 4, sunrise: "06:42", sunset: "18:38" },
    forecast: [
      { day: "Today", icon: "cloud-sun", high: 14, low: 6, condition: "Partly Cloudy", precip: 10 },
      { day: "Sat", icon: "sun", high: 16, low: 7, condition: "Sunny", precip: 0 },
      { day: "Sun", icon: "sun", high: 17, low: 8, condition: "Clear", precip: 0 },
      { day: "Mon", icon: "cloud", high: 13, low: 7, condition: "Cloudy", precip: 20 },
      { day: "Tue", icon: "cloud-rain", high: 10, low: 5, condition: "Rain", precip: 75 },
      { day: "Wed", icon: "cloud-rain", high: 9, low: 4, condition: "Showers", precip: 60 },
      { day: "Thu", icon: "cloud-sun", high: 12, low: 5, condition: "Partly Cloudy", precip: 15 },
    ],
  },
  vienna: {
    current: { temp: 11, feelsLike: 8, condition: "Overcast", icon: "cloud", humidity: 71, wind: 18, visibility: 10, uvIndex: 3, sunrise: "06:35", sunset: "18:45" },
    forecast: [],
  },
};

const SEASONAL_NOTES = [
  { season: "Spring (Mar-May)", note: "Lake water still cold. Great hiking weather. Cherry blossoms in April." },
  { season: "Summer (Jun-Aug)", note: "Lake swimming season! Badi culture peaks. 25-30C typical. Long evenings." },
  { season: "Autumn (Sep-Nov)", note: "Fog season (Nebelmeer). Beautiful foliage. Layer up." },
  { season: "Winter (Dec-Feb)", note: "Cold but dry. Occasional snow. Christmas markets. Fohn wind brings warm days." },
];

function WeatherIcon({ icon, className = "h-8 w-8" }: { icon: string; className?: string }) {
  switch (icon) {
    case "sun": return <Sun className={className} />;
    case "cloud": return <Cloud className={className} />;
    case "cloud-rain": return <CloudRain className={className} />;
    case "cloud-sun": return <CloudSun className={className} />;
    case "snow": return <Snowflake className={className} />;
    default: return <Sun className={className} />;
  }
}

export default function WeatherPage() {
  const [data, setData] = useState<WeatherData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/weather");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
      setIsLive(true);
    } catch {
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const { zurich, vienna } = data;
  const tempDiff = Math.abs(zurich.current.temp - vienna.current.temp);

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-cyan" />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Weather
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Zurich vs Vienna — live from Open-Meteo.{" "}
            {!isLive && <span className="text-amber-400">(Fallback data)</span>}
          </p>
        </div>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-primary transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Current weather: Zurich vs Vienna */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Zurich */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Zurich</h2>
              <p className="text-[10px] text-text-muted">Your future home</p>
            </div>
            <WeatherIcon icon={zurich.current.icon} className="h-10 w-10 text-amber-400" />
          </div>

          <div className="flex items-end gap-2 mb-4">
            <span className="font-data text-5xl font-black text-text-primary">
              {zurich.current.temp}°
            </span>
            <div className="mb-2">
              <p className="text-xs text-text-secondary">{zurich.current.condition}</p>
              <p className="text-[10px] text-text-muted">
                Feels like {zurich.current.feelsLike}°
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <WeatherStat icon={<Droplets className="h-3 w-3" />} label="Humidity" value={`${zurich.current.humidity}%`} />
            <WeatherStat icon={<Wind className="h-3 w-3" />} label="Wind" value={`${zurich.current.wind} km/h`} />
            <WeatherStat icon={<Eye className="h-3 w-3" />} label="Visibility" value={`${zurich.current.visibility} km`} />
            <WeatherStat icon={<Thermometer className="h-3 w-3" />} label="UV Index" value={`${zurich.current.uvIndex}`} />
          </div>

          {zurich.current.sunrise && (
            <div className="flex justify-between mt-3 pt-3 border-t border-border-subtle text-[10px] text-text-muted">
              <span>Sunrise {zurich.current.sunrise}</span>
              <span>Sunset {zurich.current.sunset}</span>
            </div>
          )}
        </div>

        {/* Vienna */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Vienna</h2>
              <p className="text-[10px] text-text-muted">Katie&apos;s city</p>
            </div>
            <WeatherIcon icon={vienna.current.icon} className="h-10 w-10 text-slate-400" />
          </div>

          <div className="flex items-end gap-2 mb-4">
            <span className="font-data text-5xl font-black text-text-primary">
              {vienna.current.temp}°
            </span>
            <div className="mb-2">
              <p className="text-xs text-text-secondary">{vienna.current.condition}</p>
              <p className="text-[10px] text-text-muted">
                Feels like {vienna.current.feelsLike}°
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <WeatherStat icon={<Droplets className="h-3 w-3" />} label="Humidity" value={`${vienna.current.humidity}%`} />
            <WeatherStat icon={<Wind className="h-3 w-3" />} label="Wind" value={`${vienna.current.wind} km/h`} />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
            <p className="text-[10px] text-pink-300">
              Temperature difference: {tempDiff}° —
              {zurich.current.temp > vienna.current.temp
                ? " Zurich is warmer right now"
                : zurich.current.temp < vienna.current.temp
                  ? " Vienna is warmer right now"
                  : " Same temperature"}
              . Pack accordingly for Katie visits.
            </p>
          </div>
        </div>
      </div>

      {/* 7-day forecast */}
      {zurich.forecast.length > 0 && (
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Zurich 7-Day Forecast
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {zurich.forecast.map((day) => (
              <div
                key={day.day}
                className="text-center rounded-lg bg-bg-primary/50 border border-border-subtle p-3"
              >
                <p className="text-[10px] font-semibold text-text-secondary mb-2">
                  {day.day}
                </p>
                <WeatherIcon icon={day.icon} className="h-6 w-6 mx-auto text-text-tertiary mb-2" />
                <div className="font-data text-xs">
                  <span className="text-text-primary font-semibold">{day.high}°</span>
                  <span className="text-text-muted"> / {day.low}°</span>
                </div>
                {day.precip > 0 && (
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    <Droplets className="h-2 w-2 text-cyan-400" />
                    <span className="font-data text-[9px] text-cyan-400">
                      {day.precip}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal notes */}
      <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Zurich Seasonal Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SEASONAL_NOTES.map((s) => (
            <div
              key={s.season}
              className="rounded-lg bg-bg-primary/50 border border-border-subtle p-3"
            >
              <p className="text-xs font-semibold text-text-primary mb-1">
                {s.season}
              </p>
              <p className="text-[10px] text-text-muted leading-snug">{s.note}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-text-muted mt-3 italic">
          Lake swimming: May-September. Badi season typically opens late April.
          Important for knee rehab — swimming is low-impact exercise.
        </p>
      </div>
    </div>
  );
}

function WeatherStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-bg-primary/50 p-2">
      <span className="text-text-muted">{icon}</span>
      <div>
        <p className="text-[9px] text-text-muted">{label}</p>
        <p className="font-data text-xs text-text-primary">{value}</p>
      </div>
    </div>
  );
}
