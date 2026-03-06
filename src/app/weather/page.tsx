"use client";

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
} from "lucide-react";

// Mock weather data
const ZURICH_CURRENT = {
  temp: 14,
  feelsLike: 12,
  condition: "Partly Cloudy",
  icon: "cloud-sun",
  humidity: 62,
  wind: 12,
  visibility: 15,
  uvIndex: 4,
  sunrise: "06:42",
  sunset: "18:38",
};

const VIENNA_CURRENT = {
  temp: 11,
  feelsLike: 8,
  condition: "Overcast",
  icon: "cloud",
  humidity: 71,
  wind: 18,
  visibility: 10,
};

interface ForecastDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  condition: string;
  precip: number;
}

const ZURICH_FORECAST: ForecastDay[] = [
  { day: "Today", icon: "cloud-sun", high: 14, low: 6, condition: "Partly Cloudy", precip: 10 },
  { day: "Sat", icon: "sun", high: 16, low: 7, condition: "Sunny", precip: 0 },
  { day: "Sun", icon: "sun", high: 17, low: 8, condition: "Clear", precip: 0 },
  { day: "Mon", icon: "cloud", high: 13, low: 7, condition: "Cloudy", precip: 20 },
  { day: "Tue", icon: "cloud-rain", high: 10, low: 5, condition: "Rain", precip: 75 },
  { day: "Wed", icon: "cloud-rain", high: 9, low: 4, condition: "Showers", precip: 60 },
  { day: "Thu", icon: "cloud-sun", high: 12, low: 5, condition: "Partly Cloudy", precip: 15 },
];

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Weather
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Zurich vs Vienna — for visit planning and daily life. (Mock data)
        </p>
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
            <WeatherIcon icon={ZURICH_CURRENT.icon} className="h-10 w-10 text-amber-400" />
          </div>

          <div className="flex items-end gap-2 mb-4">
            <span className="font-data text-5xl font-black text-text-primary">
              {ZURICH_CURRENT.temp}°
            </span>
            <div className="mb-2">
              <p className="text-xs text-text-secondary">{ZURICH_CURRENT.condition}</p>
              <p className="text-[10px] text-text-muted">
                Feels like {ZURICH_CURRENT.feelsLike}°
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <WeatherStat icon={<Droplets className="h-3 w-3" />} label="Humidity" value={`${ZURICH_CURRENT.humidity}%`} />
            <WeatherStat icon={<Wind className="h-3 w-3" />} label="Wind" value={`${ZURICH_CURRENT.wind} km/h`} />
            <WeatherStat icon={<Eye className="h-3 w-3" />} label="Visibility" value={`${ZURICH_CURRENT.visibility} km`} />
            <WeatherStat icon={<Thermometer className="h-3 w-3" />} label="UV Index" value={`${ZURICH_CURRENT.uvIndex}`} />
          </div>

          <div className="flex justify-between mt-3 pt-3 border-t border-border-subtle text-[10px] text-text-muted">
            <span>Sunrise {ZURICH_CURRENT.sunrise}</span>
            <span>Sunset {ZURICH_CURRENT.sunset}</span>
          </div>
        </div>

        {/* Vienna */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Vienna</h2>
              <p className="text-[10px] text-text-muted">Katie&apos;s city</p>
            </div>
            <WeatherIcon icon={VIENNA_CURRENT.icon} className="h-10 w-10 text-slate-400" />
          </div>

          <div className="flex items-end gap-2 mb-4">
            <span className="font-data text-5xl font-black text-text-primary">
              {VIENNA_CURRENT.temp}°
            </span>
            <div className="mb-2">
              <p className="text-xs text-text-secondary">{VIENNA_CURRENT.condition}</p>
              <p className="text-[10px] text-text-muted">
                Feels like {VIENNA_CURRENT.feelsLike}°
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <WeatherStat icon={<Droplets className="h-3 w-3" />} label="Humidity" value={`${VIENNA_CURRENT.humidity}%`} />
            <WeatherStat icon={<Wind className="h-3 w-3" />} label="Wind" value={`${VIENNA_CURRENT.wind} km/h`} />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
            <p className="text-[10px] text-pink-300">
              Temperature difference: {Math.abs(ZURICH_CURRENT.temp - VIENNA_CURRENT.temp)}° —
              {ZURICH_CURRENT.temp > VIENNA_CURRENT.temp
                ? " Zurich is warmer right now"
                : " Vienna is warmer right now"}
              . Pack accordingly for Katie visits.
            </p>
          </div>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Zurich 7-Day Forecast
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {ZURICH_FORECAST.map((day) => (
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
