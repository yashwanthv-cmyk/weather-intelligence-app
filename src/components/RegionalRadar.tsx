import React, { useState, useEffect } from "react";
import { Radio, Shield, MapPin, Layers, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface RegionalRadarProps {
  city: string;
  latitude: number;
  longitude: number;
  precipProb: number;
  weatherCode: number;
}

export default function RegionalRadar({
  city,
  latitude,
  longitude,
  precipProb,
  weatherCode,
}: RegionalRadarProps) {
  const [range, setRange] = useState<number>(150); // range in km
  const [isScanning, setIsScanning] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [scanSpeed, setScanSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showRadarMap, setShowRadarMap] = useState(false);

  // Determine precipitation status and cell configuration
  const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode);
  const isStormy = [95, 96, 99].includes(weatherCode);
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);

  // Generate radar heat cell properties dynamically based on precipitation probability and code
  const getRadarCells = () => {
    const cells = [];
    const maxProb = Math.max(precipProb, isStormy ? 90 : isRainy ? 60 : isSnowy ? 40 : 0);

    if (maxProb === 0) {
      return [];
    }

    if (maxProb > 0 && maxProb <= 30) {
      // Light scattered dampness or snow grains
      cells.push({
        x: 180,
        y: 110,
        rx: 35,
        ry: 20,
        color: "rgba(34, 197, 94, 0.2)", // Emerald/Green
        stroke: "rgba(34, 197, 94, 0.4)",
        label: "Light Mist",
        intensity: "Light",
      });
    } else if (maxProb > 30 && maxProb <= 60) {
      // Moderate cells
      cells.push({
        x: 190,
        y: 100,
        rx: 45,
        ry: 30,
        color: "rgba(34, 197, 94, 0.25)",
        stroke: "rgba(34, 197, 94, 0.4)",
        label: "25 dBZ",
        intensity: "Light",
      });
      cells.push({
        x: 165,
        y: 115,
        rx: 25,
        ry: 15,
        color: "rgba(234, 179, 8, 0.35)", // Yellow/Amber
        stroke: "rgba(234, 179, 8, 0.6)",
        label: "35 dBZ (Moderate Rain)",
        intensity: "Moderate",
      });
    } else {
      // Heavy storm/rain cells
      cells.push({
        x: 195,
        y: 95,
        rx: 55,
        ry: 40,
        color: "rgba(34, 197, 94, 0.25)",
        stroke: "rgba(34, 197, 94, 0.4)",
        label: "30 dBZ",
        intensity: "Light",
      });
      cells.push({
        x: 175,
        y: 105,
        rx: 35,
        ry: 25,
        color: "rgba(234, 179, 8, 0.4)",
        stroke: "rgba(234, 179, 8, 0.6)",
        label: "42 dBZ",
        intensity: "Moderate",
      });
      cells.push({
        x: 155,
        y: 120,
        rx: 20,
        ry: 15,
        color: "rgba(239, 68, 68, 0.5)", // Red
        stroke: "rgba(239, 68, 68, 0.7)",
        label: "52 dBZ (Heavy Rain Cell)",
        intensity: "Heavy",
      });
      cells.push({
        x: 145,
        y: 125,
        rx: 10,
        ry: 8,
        color: "rgba(168, 85, 247, 0.6)", // Purple (Severe)
        stroke: "rgba(168, 85, 247, 0.8)",
        label: "58 dBZ (Severe Cell Core)",
        intensity: "Extreme",
      });
    }
    return cells;
  };

  const radarCells = getRadarCells();

  // Animation duration control
  const sweepDurations = {
    slow: "6s",
    normal: "4s",
    fast: "2s",
  };

  return (
    <div className="bg-slate-900/25 border border-slate-800/60 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 relative overflow-hidden transition-all duration-300">
      
      {/* Decorative pulse background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header section with scanning status and layout switch */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Radio className={`w-4 h-4 ${isScanning ? "animate-pulse" : ""}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Micro-Regional Radar & Precipitation Heatmap
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isScanning ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isScanning ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Live meteorological scan area: <span className="text-indigo-400 font-bold">{city} Area</span>
            </p>
          </div>
        </div>

        {/* Dynamic toggle switches for layout */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pill-shaped Layout Switcher */}
          <div className="bg-slate-950/60 p-0.5 rounded-xl border border-slate-800/80 flex items-center">
            <button
              onClick={() => setShowRadarMap(false)}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                !showRadarMap
                  ? "bg-slate-800 text-indigo-300 border border-slate-700/60 shadow-inner"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Summary Overview
            </button>
            <button
              onClick={() => setShowRadarMap(true)}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                showRadarMap
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Radio className="w-3 h-3 animate-pulse" />
              Interactive Radar
            </button>
          </div>

          {/* Live scanning coordinates */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/50">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span className="text-[9px] text-slate-400 font-mono">
              Lat: <span className="text-slate-200 font-bold">{latitude.toFixed(4)}°N</span> | Lon: <span className="text-slate-200 font-bold">{longitude.toFixed(4)}°E</span>
            </span>
          </div>
        </div>
      </div>

      {showRadarMap ? (
        /* MAIN INTERACTIVE RADAR VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Radar Map Frame */}
          <div className="lg:col-span-7 flex justify-center relative">
            
            {/* Circular Radar Monitor */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-full border border-slate-800 bg-slate-950/80 shadow-2xl p-2 flex items-center justify-center overflow-hidden">
              
              {/* SVG Screen mapping */}
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full text-slate-800 relative z-10"
              >
                <defs>
                  {/* Radar Grid Pattern */}
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="0.5" />
                  </pattern>
                  
                  {/* Radar Scanning wedge gradient */}
                  <linearGradient id="sweepGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                    <stop offset="100%" stopColor="rgba(99, 102, 241, 0.25)" />
                  </linearGradient>

                  {/* Heatmap blur filter */}
                  <filter id="radarBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="12" />
                  </filter>
                </defs>

                {/* Background patterns */}
                <rect width="100%" height="100%" fill="transparent" />
                {showGrid && <rect width="100%" height="100%" fill="url(#grid)" className="opacity-70" />}

                {/* Range Concentric Circles */}
                <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
                <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
                <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />
                <circle cx="150" cy="150" r="35" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />

                {/* Compass Axes lines */}
                <line x1="150" y1="5" x2="150" y2="295" stroke="rgba(99, 102, 241, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />
                <line x1="5" y1="150" x2="295" y2="150" stroke="rgba(99, 102, 241, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />

                {/* Direction Markers */}
                <text x="150" y="16" textAnchor="middle" fill="rgba(148, 163, 184, 0.5)" fontSize="9" fontWeight="bold" fontFamily="monospace">N</text>
                <text x="150" y="292" textAnchor="middle" fill="rgba(148, 163, 184, 0.5)" fontSize="9" fontWeight="bold" fontFamily="monospace">S</text>
                <text x="288" y="153" textAnchor="middle" fill="rgba(148, 163, 184, 0.5)" fontSize="9" fontWeight="bold" fontFamily="monospace">E</text>
                <text x="12" y="153" textAnchor="middle" fill="rgba(148, 163, 184, 0.5)" fontSize="9" fontWeight="bold" fontFamily="monospace">W</text>

                {/* Dynamic Precipitation Heatmap Nodes (Render blur filter first for map look) */}
                <g filter="url(#radarBlur)">
                  {radarCells.map((cell, idx) => (
                    <ellipse
                      key={idx}
                      cx={cell.x}
                      cy={cell.y}
                      rx={cell.rx}
                      ry={cell.ry}
                      fill={cell.color}
                    />
                  ))}
                </g>

                {/* Wireframe border shapes overlay to suggest dynamic contours */}
                <g className="opacity-40">
                  {radarCells.map((cell, idx) => (
                    <ellipse
                      key={`contour-${idx}`}
                      cx={cell.x}
                      cy={cell.y}
                      rx={cell.rx - 5}
                      ry={cell.ry - 5}
                      fill="none"
                      stroke={cell.stroke}
                      strokeWidth="0.75"
                      strokeDasharray="4,2"
                    />
                  ))}
                </g>

                {/* Radar Scanner sweep line & gradient slice */}
                {isScanning && (
                  <g
                    style={{
                      transformOrigin: "150px 150px",
                      animation: `radar-sweep ${sweepDurations[scanSpeed]} linear infinite`,
                    }}
                  >
                    {/* Wedge slice */}
                    <path
                      d="M 150 150 L 150 10 A 140 140 0 0 1 249 249 Z"
                      fill="url(#sweepGrad)"
                    />
                    {/* Bright scan line lead edge */}
                    <line
                      x1="150"
                      y1="150"
                      x2="150"
                      y2="10"
                      stroke="rgba(129, 140, 248, 0.7)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* Center City Node (Beacon) */}
                <g>
                  {/* Multi-pulse beacon animation rings */}
                  <circle cx="150" cy="150" r="10" className="animate-ping" fill="none" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1" style={{ animationDuration: "3s" }} />
                  <circle cx="150" cy="150" r="4" fill="#6366F1" />
                  <circle cx="150" cy="150" r="1.5" fill="#FFFFFF" />
                </g>

                {/* Radar cell label overlays (Clean telemetry coordinates) */}
                {radarCells.slice(-1).map((cell, idx) => (
                  <g key={`telemetry-${idx}`} className="opacity-80">
                    <line
                      x1={cell.x}
                      y1={cell.y}
                      x2={cell.x - 25}
                      y2={cell.y - 30}
                      stroke="rgba(148, 163, 184, 0.4)"
                      strokeWidth="0.5"
                    />
                    <line
                      x1={cell.x - 25}
                      y1={cell.y - 30}
                      x2={cell.x - 65}
                      y2={cell.y - 30}
                      stroke="rgba(148, 163, 184, 0.4)"
                      strokeWidth="0.5"
                    />
                    <text
                      x={cell.x - 65}
                      y={cell.y - 35}
                      fill="rgba(129, 140, 248, 0.9)"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {cell.label}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Sweep Animation style override */}
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes radar-sweep {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}} />

              {/* Simulated scale badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono font-bold tracking-wider text-slate-400 z-20">
                RANGE: {range} KM
              </div>
            </div>
          </div>

          {/* Telemetry and Controls */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/40 border border-slate-850/60 rounded-2xl p-4 flex flex-col gap-3 font-mono">
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full text-left flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-2.5 h-2.5 text-indigo-400" /> Advanced Radar Data
                </span>
                {isAdvancedOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              
              {isAdvancedOpen && (
                <div className="flex flex-col gap-3 pt-2.5 border-t border-slate-850/40 transition-all duration-300">
                  <div className="flex justify-between items-center text-[10px] border-b border-slate-850/40 pb-1.5">
                    <span className="text-slate-400">Scan Status:</span>
                    <span className={`font-bold ${isScanning ? "text-emerald-400 animate-pulse" : "text-amber-400"}`}>
                      {isScanning ? "ACTIVE SCANNING" : "HOLD / PAUSED"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] border-b border-slate-850/40 pb-1.5">
                    <span className="text-slate-400">Rainfall Density:</span>
                    <span className="text-slate-100 font-bold">
                      {radarCells.length > 0 ? radarCells[radarCells.length - 1].label : "None"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] border-b border-slate-850/40 pb-1.5">
                    <span className="text-slate-400">Sky Condition:</span>
                    <span className="text-slate-100 font-bold">
                      {isStormy ? "Convective Storm" : isRainy ? "Frontal Rain Band" : isSnowy ? "Frozen Front" : "Clear Air Zone"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Signal Frequency:</span>
                    <span className="text-slate-100">2.7 GHz (S-Band)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive controls */}
            <div className="flex flex-col gap-3">
              {/* Range Toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">Radar Sweep Range</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-1 rounded-xl border border-slate-850/60">
                  {[80, 150, 300].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        range === r
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweep speed & grid toggler controls */}
              <div className="flex items-center justify-between gap-3 bg-slate-950/30 p-2 rounded-xl border border-slate-850/40">
                <button
                  onClick={() => setIsScanning(!isScanning)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isScanning ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20" : "bg-indigo-600 text-white hover:bg-indigo-500"
                  }`}
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isScanning ? "animate-spin" : ""}`} style={{ animationDuration: isScanning ? "6s" : "0s" }} />
                  {isScanning ? "Freeze Radar" : "Initiate Scan"}
                </button>

                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold border cursor-pointer transition-all ${
                    showGrid
                      ? "bg-slate-800 text-slate-200 border-slate-700"
                      : "bg-slate-950/40 text-slate-500 border-slate-850"
                  }`}
                >
                  {showGrid ? "Hide Grid" : "Show Grid"}
                </button>
              </div>
            </div>

            {/* Color Heatmap Intensity Guide */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-mono font-extrabold">Radar Reflectivity (dBZ)</span>
              <div className="flex items-center gap-1 select-none">
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 via-rose-500 to-purple-600"></div>
                  <div className="flex justify-between text-[8px] font-mono text-slate-500">
                    <span>Light Mist</span>
                    <span>Moderate Rain</span>
                    <span>Severe Storms</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* COMPACT SUMMARY OVERVIEW (MINIMIZED VIEW) */
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-5 bg-slate-950/40 p-5 rounded-2xl border border-slate-850/50">
          <div className="flex-1 flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Active Scan Zone Telemetry</span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="text-slate-300 font-semibold">{city} Area</span>
                <span className="text-slate-500 font-mono">|</span>
                <span className="text-slate-400 font-mono">
                  Coordinates: <span className="text-slate-300">{latitude.toFixed(3)}°N, {longitude.toFixed(3)}°E</span>
                </span>
              </div>
            </div>

            {/* Quick Metrics display bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800/40 font-mono text-[11px]">
              <div>
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest">Radar Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SCANNING
                </span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest">Rainfall Density</span>
                <span className="font-bold text-slate-200 block mt-0.5 truncate">
                  {radarCells.length > 0 ? radarCells[radarCells.length - 1].label : "None"}
                </span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest">Sky Condition</span>
                <span className="font-bold text-slate-200 block mt-0.5 truncate">
                  {isStormy ? "Convective Storm" : isRainy ? "Frontal Rain Band" : isSnowy ? "Frozen Front" : "Clear Air Zone"}
                </span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest">Precipitation Max</span>
                <span className="font-bold text-indigo-400 block mt-0.5">
                  {precipProb}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center md:border-l border-slate-800/50 md:pl-5">
            <button
              onClick={() => setShowRadarMap(true)}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] font-bold tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-200" />
              <span>Expand Interactive Radar Map</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
