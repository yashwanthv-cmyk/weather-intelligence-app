/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Compass,
  Calendar,
  Search,
  MapPin,
  Loader2,
  AlertTriangle,
  Umbrella,
  Sparkles,
  Activity,
  Thermometer,
  ArrowRight,
  Navigation,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";

export type IconType =
  | "Sun"
  | "CloudSun"
  | "Cloud"
  | "CloudFog"
  | "CloudDrizzle"
  | "CloudRain"
  | "CloudSnow"
  | "CloudLightning"
  | "Wind"
  | "Droplets"
  | "Compass"
  | "Calendar"
  | "Search"
  | "MapPin"
  | "Loader2"
  | "AlertTriangle"
  | "Umbrella"
  | "Sparkles"
  | "Activity"
  | "Thermometer"
  | "ArrowRight"
  | "Navigation"
  | "ExternalLink"
  | "ChevronRight"
  | "Info";

interface WeatherIconProps {
  name: IconType | string;
  className?: string;
  size?: number;
}

export default function WeatherIcon({ name, className = "", size = 24 }: WeatherIconProps) {
  switch (name) {
    case "Sun":
      return <Sun className={className} size={size} />;
    case "CloudSun":
      return <CloudSun className={className} size={size} />;
    case "Cloud":
      return <Cloud className={className} size={size} />;
    case "CloudFog":
      return <CloudFog className={className} size={size} />;
    case "CloudDrizzle":
      return <CloudDrizzle className={className} size={size} />;
    case "CloudRain":
      return <CloudRain className={className} size={size} />;
    case "CloudSnow":
      return <CloudSnow className={className} size={size} />;
    case "CloudLightning":
      return <CloudLightning className={className} size={size} />;
    case "Wind":
      return <Wind className={className} size={size} />;
    case "Droplets":
      return <Droplets className={className} size={size} />;
    case "Compass":
      return <Compass className={className} size={size} />;
    case "Calendar":
      return <Calendar className={className} size={size} />;
    case "Search":
      return <Search className={className} size={size} />;
    case "MapPin":
      return <MapPin className={className} size={size} />;
    case "Loader2":
      return <Loader2 className={className} size={size} />;
    case "AlertTriangle":
      return <AlertTriangle className={className} size={size} />;
    case "Umbrella":
      return <Umbrella className={className} size={size} />;
    case "Sparkles":
      return <Sparkles className={className} size={size} />;
    case "Activity":
      return <Activity className={className} size={size} />;
    case "Thermometer":
      return <Thermometer className={className} size={size} />;
    case "ArrowRight":
      return <ArrowRight className={className} size={size} />;
    case "Navigation":
      return <Navigation className={className} size={size} />;
    case "ExternalLink":
      return <ExternalLink className={className} size={size} />;
    case "ChevronRight":
      return <ChevronRight className={className} size={size} />;
    case "Info":
      return <Info className={className} size={size} />;
    default:
      return <CloudSun className={className} size={size} />;
  }
}
