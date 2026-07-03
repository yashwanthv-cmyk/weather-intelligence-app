/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherConditionDetails } from "../types";

export function getWeatherCondition(code: number): WeatherConditionDetails {
  switch (code) {
    case 0:
      return {
        label: "Clear Sky",
        iconName: "Sun",
        bgGradient: "from-amber-400 via-orange-500 to-amber-600",
        cardBg: "bg-amber-500/10 border-amber-500/20",
        accentColor: "text-amber-500",
        recommendations: [
          "Perfect weather for outdoor activities like a picnic, run, or cycling!",
          "UV index is high—be sure to wear sunscreen and sunglasses.",
          "Great day to wash your car or do some gardening.",
          "Keep hydrated! Remember to drink plenty of water."
        ]
      };
    case 1:
    case 2:
      return {
        label: "Partly Cloudy",
        iconName: "CloudSun",
        bgGradient: "from-sky-400 via-blue-500 to-indigo-600",
        cardBg: "bg-blue-500/10 border-blue-500/20",
        accentColor: "text-blue-400",
        recommendations: [
          "Pleasant day for a walk or outdoor errand.",
          "Nice lighting outside—ideal for outdoor photography.",
          "Comfortable temperatures expected; light layers will keep you comfortable.",
          "Great day for outdoor dining or a coffee break."
        ]
      };
    case 3:
      return {
        label: "Overcast",
        iconName: "Cloud",
        bgGradient: "from-slate-400 to-slate-600",
        cardBg: "bg-slate-500/10 border-slate-500/20",
        accentColor: "text-slate-400",
        recommendations: [
          "A grey day ahead. Good time for indoor activities or reading.",
          "Slightly cooler temperatures; you might want a light sweater.",
          "Diffused light is perfect for portrait photos or drawing.",
          "Plan a cozy evening with a warm beverage."
        ]
      };
    case 45:
    case 48:
      return {
        label: "Foggy",
        iconName: "CloudFog",
        bgGradient: "from-zinc-400 via-stone-500 to-zinc-600",
        cardBg: "bg-zinc-500/10 border-zinc-500/20",
        accentColor: "text-zinc-400",
        recommendations: [
          "Visibility is reduced. Drive with extra caution and use fog lights.",
          "Expect potential travel delays at nearby transit hubs.",
          "Great morning for a cozy, warm indoor breakfast.",
          "Keep an eye out for dew and damp conditions if heading outside."
        ]
      };
    case 51:
    case 53:
    case 55:
      return {
        label: "Drizzle",
        iconName: "CloudDrizzle",
        bgGradient: "from-cyan-400 via-blue-500 to-slate-600",
        cardBg: "bg-cyan-500/10 border-cyan-500/20",
        accentColor: "text-cyan-400",
        recommendations: [
          "Light drizzle today. A light rain jacket or cap is recommended.",
          "Pavements may be slippery; watch your step while walking.",
          "Great afternoon for visiting a museum, library, or café.",
          "Humidity is high. Protect any moisture-sensitive gear."
        ]
      };
    case 56:
    case 57:
      return {
        label: "Freezing Drizzle",
        iconName: "CloudSnow",
        bgGradient: "from-blue-300 via-teal-400 to-slate-600",
        cardBg: "bg-teal-500/10 border-teal-500/20",
        accentColor: "text-teal-300",
        recommendations: [
          "Freezing drizzle can cause icy patches. Be very careful on sidewalks.",
          "Ensure car windshield is completely defrosted before driving.",
          "Dress in warm, water-resistant layers.",
          "Limit unnecessary travel if roads are hazardous."
        ]
      };
    case 61:
    case 63:
    case 65:
      return {
        label: "Rainy",
        iconName: "CloudRain",
        bgGradient: "from-blue-500 via-indigo-600 to-slate-800",
        cardBg: "bg-indigo-500/10 border-indigo-500/20",
        accentColor: "text-indigo-400",
        recommendations: [
          "High chance of rain today—bring an umbrella!",
          "Waterproof footwear is highly recommended.",
          "Perfect day for hot soup, a movie, or indoor workouts.",
          "Drive with caution; watch out for hydroplaning on roads."
        ]
      };
    case 66:
    case 67:
      return {
        label: "Freezing Rain",
        iconName: "CloudSnow",
        bgGradient: "from-sky-300 via-slate-500 to-indigo-900",
        cardBg: "bg-sky-500/10 border-sky-500/20",
        accentColor: "text-sky-300",
        recommendations: [
          "Ice accumulation is likely. Extremely hazardous driving and walking conditions.",
          "Wear winter boots with excellent grip.",
          "Keep warm indoors; check on vulnerable neighbors if possible.",
          "Ensure flashlights and emergency kits are ready in case of power issues."
        ]
      };
    case 71:
    case 73:
    case 75:
      return {
        label: "Snowfall",
        iconName: "CloudSnow",
        bgGradient: "from-blue-100 via-sky-300 to-blue-500",
        cardBg: "bg-blue-300/10 border-blue-300/20",
        accentColor: "text-sky-200",
        recommendations: [
          "Beautiful winter scenery! Dress in thermal layers, gloves, and a warm hat.",
          "Allow extra time for travel and clear snow from your vehicle completely.",
          "Watch for slippery black ice on roads and pathways.",
          "Perfect day for hot cocoa, board games, or building a snowman!"
        ]
      };
    case 77:
      return {
        label: "Snow Grains",
        iconName: "CloudSnow",
        bgGradient: "from-slate-300 via-sky-400 to-slate-500",
        cardBg: "bg-slate-400/10 border-slate-400/20",
        accentColor: "text-sky-300",
        recommendations: [
          "Frozen precipitation expected. Keep warm and dry.",
          "Wrap up in layers to block cold wind and moisture.",
          "Plan warm meals and keep active indoors.",
          "Ensure pets are kept warm inside."
        ]
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain Showers",
        iconName: "CloudRain",
        bgGradient: "from-blue-600 via-blue-800 to-slate-900",
        cardBg: "bg-blue-600/10 border-blue-600/20",
        accentColor: "text-blue-400",
        recommendations: [
          "Sudden rain showers are likely. Keep your umbrella or rain jacket handy.",
          "Postpone outdoor workouts until the showers pass.",
          "Check local radar if planning outdoor commutes.",
          "Enjoy the fresh rain smell (petrichor) and cozy indoor vibe."
        ]
      };
    case 85:
    case 86:
      return {
        label: "Snow Showers",
        iconName: "CloudSnow",
        bgGradient: "from-sky-200 via-sky-400 to-indigo-700",
        cardBg: "bg-sky-400/10 border-sky-400/20",
        accentColor: "text-sky-300",
        recommendations: [
          "Intermittent snow showers. Bundle up in heavy winter gear.",
          "Road visibility might drop suddenly during a heavy squall.",
          "Ensure car heater and defroster are in good working order.",
          "Keep outdoor paths salted or shoveled to prevent ice build-up."
        ]
      };
    case 95:
    case 96:
    case 99:
      return {
        label: "Thunderstorm",
        iconName: "CloudLightning",
        bgGradient: "from-slate-800 via-purple-900 to-zinc-950",
        cardBg: "bg-purple-950/20 border-purple-500/20",
        accentColor: "text-purple-400",
        recommendations: [
          "Thunderstorms in the area. Stay indoors and away from windows.",
          "Unplug sensitive electronic devices to protect them from power surges.",
          "Avoid running water or taking showers during lightning activity.",
          "Ensure flashlights or candles are easily accessible in case of power outages."
        ]
      };
    default:
      return {
        label: "Variable",
        iconName: "CloudSun",
        bgGradient: "from-sky-400 via-indigo-500 to-purple-600",
        cardBg: "bg-sky-500/10 border-sky-500/20",
        accentColor: "text-sky-400",
        recommendations: [
          "Varying conditions expected. Layering your clothes is a smart strategy.",
          "Check the short-term forecast periodically before leaving.",
          "Keep an umbrella in your bag just in case.",
          "A great day for flexible, adaptive planning."
        ]
      };
  }
}

// Generate secondary planning metrics based on actual weather stats
export interface DerivedIntelligence {
  uvLevel: "Low" | "Moderate" | "High" | "Very High";
  uvRecommendation: string;
  comfortIndex: "Excellent" | "Good" | "Fair" | "Poor";
  comfortRecommendation: string;
  activityViability: "Highly Favorable" | "Favorable" | "Challenging" | "Not Recommended";
  activityRecommendation: string;
}

export function getDerivedIntelligence(
  temp: number,
  windSpeed: number,
  precipitationProb: number,
  weatherCode: number
): DerivedIntelligence {
  // UV Level approximation based on weather code and month/day-state (or just simple clear sky rule)
  let uvLevel: "Low" | "Moderate" | "High" | "Very High" = "Low";
  let uvRecommendation = "No protection needed for general exposure.";
  
  if (weatherCode === 0) {
    uvLevel = "High";
    uvRecommendation = "SPF 30+ sunscreen, hat, and sunglasses are highly recommended.";
  } else if (weatherCode === 1 || weatherCode === 2) {
    uvLevel = "Moderate";
    uvRecommendation = "Wear sunscreen if outdoors for extended periods.";
  }

  // Comfort Index (temperature + humidity/precipitation approximation)
  let comfortIndex: "Excellent" | "Good" | "Fair" | "Poor" = "Good";
  let comfortRecommendation = "";

  if (temp >= 18 && temp <= 25 && precipitationProb < 20) {
    comfortIndex = "Excellent";
    comfortRecommendation = "Optimal human comfort conditions. Outstanding day for physical activities.";
  } else if ((temp > 25 && temp <= 32) || (temp >= 12 && temp < 18)) {
    comfortIndex = "Good";
    comfortRecommendation = "Very pleasant. Standard dressing is appropriate.";
  } else if (temp > 32) {
    comfortIndex = "Fair";
    comfortRecommendation = "Quite warm. Stay in shade, drink cool liquids, and dress lightly.";
  } else {
    comfortIndex = "Poor";
    comfortRecommendation = "Chilly or damp. Thermal layers and jackets are essential.";
  }

  // Activity Viability (running, hiking, sight-seeing, etc.)
  let activityViability: "Highly Favorable" | "Favorable" | "Challenging" | "Not Recommended" = "Favorable";
  let activityRecommendation = "";

  const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode);
  const isStormy = [95, 96, 99].includes(weatherCode);
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);

  if (isStormy) {
    activityViability = "Not Recommended";
    activityRecommendation = "Severe weather threat. Cancel all outdoor plans and stay sheltered.";
  } else if (isRainy && precipitationProb > 60) {
    activityViability = "Challenging";
    activityRecommendation = "Wet conditions. Outdoor sports not recommended. Indoor alternatives preferred.";
  } else if (isSnowy) {
    activityViability = "Challenging";
    activityRecommendation = "Cold and slippery. Great for winter sports, but standard walking/hiking requires caution.";
  } else if (temp > 35) {
    activityViability = "Challenging";
    activityRecommendation = "Extreme heat. Avoid strenuous outdoor workouts during mid-day hours.";
  } else if (temp >= 16 && temp <= 24 && precipitationProb < 15) {
    activityViability = "Highly Favorable";
    activityRecommendation = "Perfect weather metrics. Plan outdoor events, hikes, or sports today!";
  } else {
    activityViability = "Favorable";
    activityRecommendation = "Generally supportive of most activities. Monitor light wind or overcast sky.";
  }

  return {
    uvLevel,
    uvRecommendation,
    comfortIndex,
    comfortRecommendation,
    activityViability,
    activityRecommendation
  };
}
