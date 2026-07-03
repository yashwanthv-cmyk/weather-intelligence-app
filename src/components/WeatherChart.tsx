/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useRef, useEffect } from "react";

interface WeatherChartProps {
  dates: string[];
  tempMax: number[];
  tempMin: number[];
}

export default function WeatherChart({ dates, tempMax, tempMin }: WeatherChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const height = 240;

  // Track size of the container for dynamic resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width) {
          // Subtract padding/margins (32px padding on inner card)
          setWidth(Math.max(300, entry.contentRect.width - 32));
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { pointsMax, pointsMin, yGridLines, yLabels, pointsMaxArea, pointsMinArea } = useMemo(() => {
    if (!tempMax.length || !tempMin.length) {
      return { pointsMax: "", pointsMin: "", yGridLines: [], yLabels: [], pointsMaxArea: "", pointsMinArea: "" };
    }

    const paddingX = 45;
    const paddingY = 30;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const allTemps = [...tempMax, ...tempMin];
    const absoluteMax = Math.max(...allTemps);
    const absoluteMin = Math.min(...allTemps);
    const tempRange = absoluteMax - absoluteMin || 1;

    // Buffer limits
    const yMaxLimit = absoluteMax + tempRange * 0.15;
    const yMinLimit = absoluteMin - tempRange * 0.15;
    const yRange = yMaxLimit - yMinLimit;

    const getX = (index: number) => {
      if (tempMax.length <= 1) return paddingX + chartWidth / 2;
      return paddingX + (index / (tempMax.length - 1)) * chartWidth;
    };

    const getY = (temp: number) => {
      return paddingY + chartHeight - ((temp - yMinLimit) / yRange) * chartHeight;
    };

    // Build SVG Path strings
    const coordsMax = tempMax.map((t, idx) => ({ x: getX(idx), y: getY(t) }));
    const coordsMin = tempMin.map((t, idx) => ({ x: getX(idx), y: getY(t) }));

    const pointsMax = coordsMax.map(c => `${c.x},${c.y}`).join(" ");
    const pointsMin = coordsMin.map(c => `${c.x},${c.y}`).join(" ");

    // Fill area paths
    const pointsMaxArea = coordsMax.length > 0 
      ? `${getX(0)},${paddingY + chartHeight} ` + pointsMax + ` ${getX(coordsMax.length - 1)},${paddingY + chartHeight}` 
      : "";
    const pointsMinArea = coordsMin.length > 0 
      ? `${getX(0)},${paddingY + chartHeight} ` + pointsMin + ` ${getX(coordsMin.length - 1)},${paddingY + chartHeight}` 
      : "";

    // Generate grid line values
    const gridCount = 4;
    const yGridLines: number[] = [];
    const yLabels: number[] = [];
    for (let i = 0; i <= gridCount; i++) {
      const val = yMinLimit + (i / gridCount) * yRange;
      yGridLines.push(getY(val));
      yLabels.push(val);
    }

    return {
      pointsMax,
      pointsMin,
      coordsMax,
      coordsMin,
      yGridLines,
      yLabels,
      pointsMaxArea,
      pointsMinArea
    };
  }, [tempMax, tempMin, width]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getXCoordinate = (index: number) => {
    if (!tempMax.length) return 0;
    const paddingX = 45;
    const chartWidth = width - paddingX * 2;
    return paddingX + (index / (tempMax.length - 1)) * chartWidth;
  };

  return (
    <div ref={containerRef} className="w-full relative select-none">
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          7-Day Temperature Curves
        </h4>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse"></span>
            Max Temp
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block animate-pulse"></span>
            Min Temp
          </span>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-md rounded-2xl p-4 overflow-hidden shadow-xl shadow-black/10">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            {/* Gradients for Areas */}
            <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            {/* Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines & Y Axis Labels */}
          {yGridLines.map((yVal, idx) => (
            <g key={idx} className="opacity-30">
              <line
                x1={45}
                y1={yVal}
                x2={width - 45}
                y2={yVal}
                stroke="#475569"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={12}
                y={yVal + 4}
                fill="#94a3b8"
                fontSize={10}
                fontFamily="JetBrains Mono, monospace"
                className="font-medium"
              >
                {Math.round(yLabels[idx])}°C
              </text>
            </g>
          ))}

          {/* Gradient Fill Areas */}
          {pointsMaxArea && (
            <polygon points={pointsMaxArea} fill="url(#maxGradient)" />
          )}
          {pointsMinArea && (
            <polygon points={pointsMinArea} fill="url(#minGradient)" />
          )}

          {/* Line paths */}
          {pointsMax && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth={3}
              points={pointsMax}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          )}
          {pointsMin && (
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth={3}
              points={pointsMin}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          )}

          {/* Interactive Hover Guide Line */}
          {hoveredIndex !== null && (
            <line
              x1={getXCoordinate(hoveredIndex)}
              y1={25}
              x2={getXCoordinate(hoveredIndex)}
              y2={height - 35}
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              className="opacity-60"
            />
          )}

          {/* Interactive hover overlays / Dots */}
          {tempMax.map((tMax, idx) => {
            const x = getXCoordinate(idx);
            const isHovered = hoveredIndex === idx;

            // Simple direct formula to calculate Y coordinate for plotting
            const allTemps = [...tempMax, ...tempMin];
            const absoluteMax = Math.max(...allTemps);
            const absoluteMin = Math.min(...allTemps);
            const tempRange = absoluteMax - absoluteMin || 1;
            const yMaxLimit = absoluteMax + tempRange * 0.15;
            const yMinLimit = absoluteMin - tempRange * 0.15;
            const yRange = yMaxLimit - yMinLimit;
            
            const yMax = 30 + (height - 60) - ((tMax - yMinLimit) / yRange) * (height - 60);
            const yMin = 30 + (height - 60) - ((tempMin[idx] - yMinLimit) / yRange) * (height - 60);

            return (
              <g key={idx}>
                {/* Data point circle: Max Temp */}
                <circle
                  cx={x}
                  cy={yMax}
                  r={isHovered ? 6 : 4}
                  fill="#f59e0b"
                  stroke="#1e293b"
                  strokeWidth={2}
                  className="transition-all duration-200"
                />
                
                {/* Data point circle: Min Temp */}
                <circle
                  cx={x}
                  cy={yMin}
                  r={isHovered ? 6 : 4}
                  fill="#38bdf8"
                  stroke="#1e293b"
                  strokeWidth={2}
                  className="transition-all duration-200"
                />

                {/* Hover Text values */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 28}
                      y={yMax - 30}
                      width={56}
                      height={20}
                      rx={6}
                      fill="#1e293b"
                      stroke="#f59e0b"
                      strokeWidth={1}
                      className="shadow-md"
                    />
                    <text
                      x={x}
                      y={yMax - 16}
                      fill="#f59e0b"
                      fontSize={10}
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {tMax}°C
                    </text>

                    <rect
                      x={x - 28}
                      y={yMin + 12}
                      width={56}
                      height={20}
                      rx={6}
                      fill="#1e293b"
                      stroke="#38bdf8"
                      strokeWidth={1}
                      className="shadow-md"
                    />
                    <text
                      x={x}
                      y={yMin + 26}
                      fill="#38bdf8"
                      fontSize={10}
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {tempMin[idx]}°C
                    </text>
                  </g>
                )}

                {/* Hover trigger areas */}
                <rect
                  x={x - (width - 90) / (tempMax.length - 1) / 2}
                  y={20}
                  width={(width - 90) / (tempMax.length - 1)}
                  height={height - 40}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}

          {/* X Axis Date Labels */}
          {dates.map((dateStr, idx) => {
            const x = getXCoordinate(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - 8}
                fill="#94a3b8"
                fontSize={9}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                className="font-medium tracking-tight"
              >
                {formatDate(dateStr)}
              </text>
            );
          })}
        </svg>
      </div>
      <p className="text-[10px] text-slate-500 font-mono text-center mt-2">
        * Hover over the graph to see precise temperature metrics.
      </p>
    </div>
  );
}
