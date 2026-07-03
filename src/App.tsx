/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getWeatherCondition,
  getDerivedIntelligence,
  DerivedIntelligence
} from "./utils/weatherCodes";
import { getCulturalRecommendations } from "./utils/culturalRecommendations";
import { GeocodingResult, WeatherResponse } from "./types";
import WeatherChart from "./components/WeatherChart";
import WeatherIcon from "./components/WeatherIcon";
import RegionalRadar from "./components/RegionalRadar";
import {
  ShieldAlert,
  AlertTriangle,
  EyeOff,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Compass,
  CheckCircle2,
  AlertOctagon,
  Info,
  Sun,
  CloudSun,
  Radio,
  Map
} from "lucide-react";

const DEFAULT_CITIES: GeocodingResult[] = [
  { id: 5391959, name: "San Francisco", latitude: 37.77493, longitude: -122.41941, country_code: "US", admin1: "California", country: "United States" },
  { id: 2643743, name: "London", latitude: 51.50853, longitude: -0.12574, country_code: "GB", admin1: "England", country: "United Kingdom" },
  { id: 1850147, name: "Tokyo", latitude: 35.6895, longitude: 139.69171, country_code: "JP", admin1: "Tokyo", country: "Japan" },
  { id: 2147714, name: "Sydney", latitude: -33.86785, longitude: 151.20732, country_code: "AU", admin1: "New South Wales", country: "Australia" }
];

interface PrecautionDetails {
  title: string;
  text: string;
  emoji: string;
  iconType: any;
  colorClass: string;
  iconBg: string;
  textColor: string;
}

function getPrecautions(temp: number, code: number): PrecautionDetails {
  // 1. Temperature-Based Overrides (Check these first)
  if (temp > 35) {
    return {
      title: "Extreme Heat Alert",
      text: "Extreme Heat Warning! Limit direct sun exposure between 11 AM and 4 PM, stay heavily hydrated, and check on vulnerable individuals or pets.",
      emoji: "🥵",
      iconType: AlertTriangle,
      colorClass: "bg-rose-500/10 border-rose-500/30 text-rose-200",
      iconBg: "bg-rose-500/20 text-rose-400",
      textColor: "text-rose-200",
    };
  }
  if (temp < 0) {
    return {
      title: "Freezing Alert",
      text: "Freezing conditions detected! Wear heavy thermal layers, gloves, and a hat. Watch out for frostbite risk and hidden icy patches.",
      emoji: "🧣",
      iconType: ShieldAlert,
      colorClass: "bg-sky-500/10 border-sky-500/30 text-sky-200",
      iconBg: "bg-sky-500/20 text-sky-400",
      textColor: "text-sky-200",
    };
  }

  // 2. WMO Code Mapping (Standard Logic)
  switch (code) {
    case 0:
      return {
        title: "Sunny/Clear Tips",
        text: "Beautiful clear skies! Perfect day for outdoor activities. Wear sunglasses and apply sunscreen if staying out long.",
        emoji: "☀️",
        iconType: Sun,
        colorClass: "bg-amber-500/10 border-amber-500/20 text-amber-200",
        iconBg: "bg-amber-500/20 text-amber-400",
        textColor: "text-amber-200",
      };
    case 1:
    case 2:
    case 3:
      return {
        title: "Fair Weather Advice",
        text: "Pleasant, manageable conditions. Great for your daily routine or a casual stroll.",
        emoji: "☁️",
        iconType: CloudSun,
        colorClass: "bg-slate-500/10 border-slate-500/25 text-slate-200",
        iconBg: "bg-slate-500/20 text-slate-400",
        textColor: "text-slate-200",
      };
    case 45:
    case 48:
      return {
        title: "Visibility Alert",
        text: "Dense fog area. Low visibility on roads! If driving, turn on low beams, slow down, and maintain a safe breaking distance.",
        emoji: "🌫️",
        iconType: EyeOff,
        colorClass: "bg-zinc-500/10 border-zinc-500/25 text-zinc-200",
        iconBg: "bg-zinc-500/20 text-zinc-400",
        textColor: "text-zinc-200",
      };
    case 51:
    case 53:
    case 55:
      return {
        title: "Light Dampness Tip",
        text: "Misty out there. Damp conditions require a light windbreaker, rain cap, or a compact umbrella.",
        emoji: "💧",
        iconType: CloudDrizzle,
        colorClass: "bg-cyan-500/10 border-cyan-500/25 text-cyan-200",
        iconBg: "bg-cyan-500/20 text-cyan-400",
        textColor: "text-cyan-200",
      };
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        title: "Wet Weather Warning",
        text: "Rain alert! Bring a sturdy umbrella, wear waterproof footwear, and expect potential street puddles or traffic delays.",
        emoji: "🌧️",
        iconType: CloudRain,
        colorClass: "bg-blue-500/10 border-blue-500/25 text-blue-200",
        iconBg: "bg-blue-500/20 text-blue-400",
        textColor: "text-blue-200",
      };
    case 56:
    case 57:
    case 66:
    case 67:
      return {
        title: "Severe Ice Alert",
        text: "Slippery conditions! Freezing rain forms treacherous black ice on sidewalks and roads. Avoid unnecessary travel.",
        emoji: "❄️",
        iconType: Info,
        colorClass: "bg-teal-500/10 border-teal-500/25 text-teal-200",
        iconBg: "bg-teal-500/20 text-teal-400",
        textColor: "text-teal-200",
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        title: "Wintry Conditions Tip",
        text: "Snow day! Bundle up in heavy winter layers, insulated boots, and coats. Roads will be slick; commute with extreme caution.",
        emoji: "⛄",
        iconType: CloudSnow,
        colorClass: "bg-indigo-500/10 border-indigo-500/25 text-indigo-200",
        iconBg: "bg-indigo-500/20 text-indigo-400",
        textColor: "text-indigo-200",
      };
    case 95:
    case 96:
    case 99:
      return {
        title: "Severe Storm Alert",
        text: "Severe thunderstorm warning! Stay safely indoors. Avoid open fields, tall trees, and water bodies. Unplug sensitive electronics.",
        emoji: "⚡",
        iconType: CloudLightning,
        colorClass: "bg-purple-500/10 border-purple-500/25 text-purple-200",
        iconBg: "bg-purple-500/20 text-purple-400",
        textColor: "text-purple-200",
      };
    default:
      return {
        title: "Adaptive Advisory",
        text: "Expect variable weather conditions today. Keep an eye on local forecasts and plan your activities adaptively.",
        emoji: "🧭",
        iconType: Compass,
        colorClass: "bg-slate-500/10 border-slate-500/20 text-slate-200",
        iconBg: "bg-slate-500/20 text-slate-400",
        textColor: "text-slate-200",
      };
  }
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult>(DEFAULT_CITIES[0]);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>([]);
  const [showRadar, setShowRadar] = useState(false);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("weather_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  // Window click listener to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Fetch search suggestions as the user types (debounced)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchQuery.trim()
        )}&count=5&language=en&format=json`;
        
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results) {
            setSuggestions(geoData.results);
          } else {
            setSuggestions([]);
          }
        }
      } catch (err) {
        console.error("Geocoding search suggestions error", err);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchWeather = useCallback(async (location: GeocodingResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather metrics from the meteorology service.");
      }
      const data: WeatherResponse = await response.json();
      setWeatherData(data);
      setSelectedLocation(location);

      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.name.toLowerCase() !== location.name.toLowerCase());
        const updated = [location, ...filtered].slice(0, 5);
        localStorage.setItem("weather_recent_searches", JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching the weather forecast.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(DEFAULT_CITIES[0]);
  }, [fetchWeather]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchQuery.trim()
      )}&count=1&language=en&format=json`;
      
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) {
        throw new Error("Geocoding service unavailable.");
      }
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Location "${searchQuery}" could not be found. Please check spelling or try a larger city nearby.`);
      }

      const location: GeocodingResult = geoData.results[0];
      await fetchWeather(location);
      setSearchQuery("");
      setSuggestions([]);
    } catch (err: any) {
      setError(err.message || "Unable to search for city. Please check network connection.");
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (location: GeocodingResult) => {
    fetchWeather(location);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRecentClick = (location: GeocodingResult) => {
    fetchWeather(location);
  };

  const formatTemp = (temp: number) => {
    if (isCelsius) {
      return `${Math.round(temp)}°`;
    }
    const fahrenheit = (temp * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  };

  const currentCondition = weatherData?.current_weather
    ? getWeatherCondition(weatherData.current_weather.weathercode)
    : getWeatherCondition(0);

  // Combine generalized recommendations with culturally specific recommendations
  const culturalRecs = weatherData?.current_weather
    ? getCulturalRecommendations(
        selectedLocation.country_code || selectedLocation.country,
        weatherData.current_weather.weathercode
      )
    : [];

  // Smart Planning uses cultural/regional recommendations if available, falling back to general highlights
  const smartPlanningRecommendations = culturalRecs.length > 0
    ? culturalRecs
    : currentCondition.recommendations;

  // Targeted action checklist focuses strictly on practical weather actions to avoid redundancy
  const targetedActionChecklist = currentCondition.recommendations;

  const currentTemp = weatherData?.current_weather?.temperature ?? 15;
  const currentCode = weatherData?.current_weather?.weathercode ?? 0;
  const currentPrecautions = getPrecautions(currentTemp, currentCode);

  const intelligence: DerivedIntelligence | null = weatherData?.current_weather
    ? getDerivedIntelligence(
        weatherData.current_weather.temperature,
        weatherData.current_weather.windspeed,
        weatherData.daily.precipitation_probability_max[0] || 0,
        weatherData.current_weather.weathercode
      )
    : null;

  const forecastDays = weatherData?.daily.time.map((time, idx) => {
    const code = weatherData.daily.weathercode[idx];
    const max = weatherData.daily.temperature_2m_max[idx];
    const min = weatherData.daily.temperature_2m_min[idx];
    const precip = weatherData.daily.precipitation_probability_max[idx];
    const condition = getWeatherCondition(code);

    return {
      date: time,
      max,
      min,
      precip,
      condition,
      code
    };
  }) || [];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans relative overflow-x-hidden flex flex-col">
      
      {/* Editorial Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[140px]"></div>
      </div>

      {/* GLOBAL TOP HEADER (Keeps Search at the very top of the app) */}
      <header className="relative z-40 border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl px-6 lg:px-8 flex shrink-0">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:py-0 sm:h-20">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
              <WeatherIcon name="Sparkles" className="text-white animate-pulse" size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">WeatherIntel</span>
          </div>

        {/* Global Autocomplete Search Bar */}
        <div className="relative w-full sm:w-[320px] md:w-[420px]" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSearch} className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <WeatherIcon name="Search" size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for a city..."
              className="w-full bg-slate-800/30 hover:bg-slate-800/40 focus:bg-slate-800/50 border border-slate-700/50 rounded-full py-2 pl-10 pr-24 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-slate-100 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-full hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            >
              {isLoading ? (
                <WeatherIcon name="Loader2" className="animate-spin text-white" size={11} />
              ) : (
                <span>Search</span>
              )}
            </button>
          </form>

          {/* Autocomplete Dropdown List */}
          <AnimatePresence>
            {showSuggestions && (suggestions.length > 0 || isSearchingSuggestions) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col divide-y divide-slate-800/60 max-h-60 overflow-y-auto"
              >
                {isSearchingSuggestions && suggestions.length === 0 && (
                  <div className="px-4 py-3 text-xs text-slate-400 italic flex items-center gap-2">
                    <WeatherIcon name="Loader2" className="animate-spin text-indigo-400" size={12} />
                    Searching regional locations...
                  </div>
                )}
                {suggestions.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(loc)}
                    className="text-left w-full px-4 py-3 hover:bg-indigo-600/25 hover:text-white transition-all text-xs font-medium text-slate-300 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="truncate">
                      <span className="font-bold text-slate-100">{loc.name}</span>
                      {loc.admin1 && <span className="text-slate-400">, {loc.admin1}</span>}
                      {loc.country && (
                        <span className="text-indigo-400/90 font-bold"> ({loc.country})</span>
                      )}
                    </span>
                    {loc.country_code && (
                      <span className="text-[9px] bg-slate-850 border border-slate-750 text-slate-400 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider shrink-0">
                        {loc.country_code}
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Unit Selector and Temporal Status */}
        <div className="flex items-center gap-6 text-[11px] font-mono shrink-0">
          <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800/60 shadow-inner">
            <button
              onClick={() => setIsCelsius(true)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                isCelsius
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setIsCelsius(false)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                !isCelsius
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °F
            </button>
          </div>

          <span className="text-slate-400 font-semibold tracking-wider hidden sm:inline">
            Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        </div>
      </header>

      {/* INVALID CITY ERROR MODAL BACKDROP (Full screen blur with warnings) */}
      <AnimatePresence>
        {error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setError(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/20 text-center flex flex-col items-center gap-6 z-10"
            >
              <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/15 animate-bounce">
                <WeatherIcon name="AlertTriangle" size={32} />
              </div>

              <div>
                <h3 className="font-serif italic text-2xl text-white">
                  Location Not Found
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mt-3 px-2">
                  The geocoding registry could not find the city you entered. Please verify spelling, try adding a state/country, or try a larger neighboring metropolitan center.
                </p>
              </div>

              {/* Direct correct query entry */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const inputEl = target.elements.namedItem("modalSearch") as HTMLInputElement;
                  if (inputEl && inputEl.value.trim()) {
                    const val = inputEl.value.trim();
                    setSearchQuery(val);
                    setError(null);
                    setIsLoading(true);
                    try {
                      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                        val
                      )}&count=1&language=en&format=json`;
                      const geoRes = await fetch(geoUrl);
                      if (!geoRes.ok) throw new Error("Geocoding service unavailable.");
                      const geoData = await geoRes.json();
                      if (!geoData.results || geoData.results.length === 0) {
                        throw new Error(`Location "${val}" could not be found.`);
                      }
                      await fetchWeather(geoData.results[0]);
                      setSearchQuery("");
                    } catch (err: any) {
                      setError(err.message || "Unable to locate specified city.");
                      setIsLoading(false);
                    }
                  }
                }}
                className="w-full relative animate-pulse"
              >
                <input
                  type="text"
                  name="modalSearch"
                  placeholder="Enter correct city name..."
                  className="w-full bg-slate-850 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700/60 rounded-full py-2.5 pl-4 pr-20 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-100 placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  Search
                </button>
              </form>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 transition-all rounded-full text-xs font-bold text-slate-300 border border-slate-700/50 cursor-pointer"
                >
                  Okay, Try Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BODY WITH CONDITIONAL BLUR OUTSIDE MODAL */}
      <div className={`relative z-10 flex flex-col lg:flex-row h-auto transition-all duration-300 ${error ? "blur-md pointer-events-none select-none brightness-75" : ""}`}>
        
        {/* SIDEBAR: Current Status & Recommendations */}
        <aside className="w-full lg:w-[380px] lg:border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shrink-0">
          <div>
            {weatherData ? (
              <div className="mt-4">
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-extrabold mb-1">
                  Current Observations
                </h2>
                
                {/* Beside city, mention country as well */}
                <p className="text-3xl sm:text-4xl font-serif italic mb-6 text-white leading-tight">
                  {selectedLocation.name}
                  {selectedLocation.country && (
                    <span className="text-sm font-sans not-italic block text-indigo-400/80 font-bold tracking-wide mt-1">
                      {selectedLocation.country}
                    </span>
                  )}
                </p>
                
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-7xl sm:text-8xl font-light tracking-tighter leading-none text-white">
                    {formatTemp(weatherData.current_weather.temperature)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-slate-100 flex items-center gap-1.5">
                      <WeatherIcon name={currentCondition.iconName} className={`${currentCondition.accentColor}`} size={18} />
                      {currentCondition.label}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
                      💧 Rain Prob: {weatherData.daily.precipitation_probability_max[0]}%
                    </span>
                  </div>
                </div>

                {/* Left side quick extra parameters */}
                <div className="grid grid-cols-2 gap-3 mb-8 text-xs">
                  <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 flex items-center gap-2.5">
                    <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
                      <WeatherIcon name="Wind" size={14} />
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold text-[9px] uppercase">Wind</p>
                      <p className="text-xs font-bold text-slate-200">{weatherData.current_weather.windspeed} km/h</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 flex items-center gap-2.5">
                    <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                      <WeatherIcon name="Thermometer" size={14} />
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold text-[9px] uppercase">Extremes</p>
                      <p className="text-[10px] font-bold text-slate-200 truncate">
                        {formatTemp(weatherData.daily.temperature_2m_max[0])} / {formatTemp(weatherData.daily.temperature_2m_min[0])}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 italic">
                Loading metropolitan weather data...
              </div>
            )}
          </div>

          {/* Smart Planning Section with specific and culturally relevant activities */}
          {weatherData && (
            <div className="mt-8 lg:mt-auto border-t border-slate-800/60 pt-6">
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-5 shadow-inner">
                <h3 className="text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
                  <WeatherIcon name="Sparkles" size={12} />
                  Smart Planning
                </h3>
                <div className="space-y-4">
                  {smartPlanningRecommendations.slice(0, 3).map((rec, idx) => {
                    return (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="flex-shrink-0 text-xs mt-0.5">✨</div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{rec}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN BODY: Forecast details */}
        <main className="flex-1 flex flex-col h-auto">

          {/* DASHBOARD CONTENT BODY */}
          <div className="w-full max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 z-10 h-auto py-6">

            {/* DASHBOARD HEADER WITH VIEW TOGGLE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/40 pb-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <Map className="text-indigo-400" size={18} />
                  Meteorological Intelligence Panel
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Access live radar visualizations, strategic forecasts, and tailored warnings for <span className="text-indigo-400 font-bold">{selectedLocation.name}</span>
                </p>
              </div>

              {/* Pill-shaped toggle switcher */}
              <div className="bg-slate-950/60 p-1 rounded-2xl border border-slate-800/80 flex items-center shadow-inner self-start sm:self-center shrink-0">
                <button
                  onClick={() => setShowRadar(false)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    !showRadar
                      ? "bg-indigo-600 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sun size={14} />
                  Main Forecast
                </button>
                <button
                  onClick={() => setShowRadar(true)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    showRadar
                      ? "bg-indigo-600 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Radio size={14} className={showRadar ? "animate-pulse" : ""} />
                  Regional Radar
                </button>
              </div>
            </div>

            {/* Popular and Recent Cities Preset Row */}
            <section className="flex flex-col sm:flex-row sm:items-center gap-3.5 bg-slate-900/30 border border-slate-800/50 p-4 rounded-2xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Quick Inquiries:
              </span>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleRecentClick(city)}
                    className={`px-3.5 py-1.5 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                      selectedLocation.name === city.name
                        ? "bg-indigo-600/25 border-indigo-500/40 text-white font-bold"
                        : "bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/40 text-slate-300"
                    }`}
                  >
                    <WeatherIcon name="MapPin" size={11} className="opacity-70" />
                    {city.name}
                  </button>
                ))}

                {recentSearches.filter(r => !DEFAULT_CITIES.some(d => d.name.toLowerCase() === r.name.toLowerCase())).map((loc, idx) => (
                  <button
                    key={`rec-${idx}`}
                    onClick={() => handleRecentClick(loc)}
                    className="px-3.5 py-1.5 rounded-xl border bg-slate-800/20 border-slate-700/30 hover:bg-slate-700/40 transition-all text-xs font-semibold text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <WeatherIcon name="Navigation" size={10} className="text-sky-400 rotate-45" />
                    {loc.name}
                  </button>
                ))}
              </div>
            </section>

            {/* ERROR CARD ALERT */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start gap-4 shadow-xl shadow-rose-950/10"
                >
                  <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-300 shrink-0">
                    <WeatherIcon name="AlertTriangle" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-300 text-xs uppercase tracking-wider">Strategic Meteorological Warning</h3>
                    <p className="text-xs text-rose-200/80 mt-1.5 leading-relaxed font-medium">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {weatherData && (
              <>
                {!showRadar ? (
                  <>
                    {/* ADVANCED DYNAMIC INTELLIGENCE METRIC ROW */}
                    {intelligence && (
                      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Comfort Level */}
                        <div className="bg-slate-900/30 border border-slate-800/60 p-5 py-6 rounded-2xl flex flex-col gap-2 shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="flex items-center gap-1.5">
                            <WeatherIcon name="Activity" size={13} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Human Comfort</span>
                          </div>
                          <span className="text-base font-extrabold text-emerald-400 mt-1">{intelligence.comfortIndex}</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-medium mt-1">
                            {intelligence.comfortRecommendation}
                          </p>
                        </div>

                        {/* UV Index Level */}
                        <div className="bg-slate-900/30 border border-slate-800/60 p-5 py-6 rounded-2xl flex flex-col gap-2 shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="flex items-center gap-1.5">
                            <WeatherIcon name="Sun" size={13} className="text-amber-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solar Exposure</span>
                          </div>
                          <span className="text-base font-extrabold text-amber-400 mt-1">{intelligence.uvLevel}</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-medium mt-1">
                            {intelligence.uvRecommendation}
                          </p>
                        </div>

                        {/* Outdoor Viability */}
                        <div className="bg-slate-900/30 border border-slate-800/60 p-5 py-6 rounded-2xl flex flex-col gap-2 shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="flex items-center gap-1.5">
                            <WeatherIcon name="Compass" size={13} className="text-sky-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outdoor Viability</span>
                          </div>
                          <span className="text-base font-extrabold text-sky-400 mt-1">{intelligence.activityViability}</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-medium mt-1">
                            {intelligence.activityRecommendation}
                          </p>
                        </div>
                      </section>
                    )}

                    {/* 3. Keep 7 day strategic forecast ABOVE 7 day temp curves */}
                    {/* 7-DAY FORECAST GRID */}
                    <section className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center gap-1.5">
                          <WeatherIcon name="Calendar" size={12} className="text-indigo-400" />
                          7-Day Strategic Forecast
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Auto-Adjusted Meteorological Cycles
                        </span>
                      </div>

                      {/* 7-Day cards container */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 lg:max-h-[300px] overflow-y-auto py-2">
                        {forecastDays.map((day, idx) => {
                          const dayOfWeek = new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "short"
                          });
                          const dayMonth = new Date(day.date).toLocaleDateString("en-US", {
                            month: "numeric",
                            day: "numeric"
                          });
                          const isToday = idx === 0;

                          return (
                            <div
                              key={idx}
                              className={`rounded-2xl p-3 sm:p-3.5 flex flex-col items-center justify-between gap-2.5 transition-all duration-300 ${
                                isToday
                                  ? "bg-indigo-600/15 border border-indigo-500/40 shadow-xl shadow-indigo-950/20 scale-[1.03] z-10"
                                  : "bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50"
                              }`}
                            >
                              <div className="text-center">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-indigo-300" : "text-slate-400"}`}>
                                  {isToday ? "Today" : dayOfWeek}
                                </span>
                                <p className="text-[9px] text-slate-500 font-mono mt-0.5">{dayMonth}</p>
                              </div>

                              <span className="text-xl sm:text-2xl filter drop-shadow my-1">
                                {day.code === 0 ? "☀️" : 
                                 [1, 2].includes(day.code) ? "⛅" : 
                                 day.code === 3 ? "☁️" : 
                                 [45, 48].includes(day.code) ? "🌫️" : 
                                 [51, 53, 55, 80, 81, 82].includes(day.code) ? "🌦️" : 
                                 [61, 63, 65, 66, 67].includes(day.code) ? "🌧️" : 
                                 [71, 73, 75, 77, 85, 86].includes(day.code) ? "❄️" : 
                                 [95, 96, 99].includes(day.code) ? "⛈️" : "⛅"}
                              </span>

                              <div className="text-center">
                                <div className="text-xs font-bold text-slate-200">
                                  {formatTemp(day.max)} / {formatTemp(day.min)}
                                </div>
                                <div className="text-[9px] text-indigo-400 font-bold uppercase mt-0.5">
                                  {day.precip}% Precip
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* CHART SECTION: Temperature Trend */}
                    <section className="bg-slate-900/20 border border-slate-800/50 rounded-3xl p-6 relative">
                      <WeatherChart
                        dates={weatherData.daily.time}
                        tempMax={weatherData.daily.temperature_2m_max}
                        tempMin={weatherData.daily.temperature_2m_min}
                      />
                    </section>

                    {/* TAILORED DECISION RECOMMENDATIONS LIST */}
                    <section className={`border rounded-3xl p-5 sm:p-6 flex flex-col gap-5 transition-all duration-300 ${currentPrecautions.colorClass}`}>
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                          <currentPrecautions.iconType size={14} />
                          Precautions & Key Cautions to Remember
                        </span>
                        <span className="text-xl select-none" role="img" aria-label="alert emoji">
                          {currentPrecautions.emoji}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className={`p-3 rounded-2xl ${currentPrecautions.iconBg} flex-shrink-0 flex items-center justify-center shadow-md`}>
                          <currentPrecautions.iconType size={22} />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white opacity-90">
                            {currentPrecautions.title}
                          </h4>
                          <p className="text-xs font-semibold leading-relaxed text-slate-100">
                            {currentPrecautions.text}
                          </p>
                        </div>
                      </div>

                      {/* General Meteorological Recommendations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                        {targetedActionChecklist.map((rec, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-slate-950/45 border border-white/5 rounded-2xl flex items-start gap-3 hover:bg-slate-950/60 transition-all"
                          >
                            <div className="p-1 rounded bg-white/5 text-slate-400 mt-0.5 flex-shrink-0">
                              <CheckCircle2 size={11} className="text-emerald-400" />
                            </div>
                            <span className="text-xs font-medium text-slate-300 leading-relaxed">
                              {rec}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                ) : (
                  /* REGIONAL RADAR MAP SECTION (Uses interactive dynamic SVG map simulation) */
                  <section>
                    <RegionalRadar
                      city={selectedLocation.name}
                      latitude={selectedLocation.latitude}
                      longitude={selectedLocation.longitude}
                      precipProb={weatherData.daily.precipitation_probability_max[0] || 0}
                      weatherCode={weatherData.current_weather.weathercode}
                    />
                  </section>
                )}
              </>
            )}

          </div>

          {/* Bottom Footer block */}
          <footer className="text-center py-6 border-t border-slate-800/60 px-6 lg:px-10 text-[10px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
            <span>
              Dashboard powered by Open-Meteo API. Zero telemetry stored.
            </span>
            <div className="flex gap-4 font-semibold">
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                Meteorological Reference
                <WeatherIcon name="ExternalLink" size={9} />
              </a>
            </div>
          </footer>

        </main>
      </div>

    </div>
  );
}
