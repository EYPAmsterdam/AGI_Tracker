"use client";

import { useMemo, useState } from "react";
import { Status } from "@/types/agi";

type DimensionProgressPoint = {
  id: string;
  label: string;
  progressPercent: number;
  status: Status;
};

interface DimensionProgressRadarProps {
  dimensions: DimensionProgressPoint[];
}

const getProgressTone = (progressPercent: number) => {
  if (progressPercent >= 75) {
    return {
      stroke: "rgb(var(--sage) / 0.98)",
      fill: "rgb(var(--sage) / 0.14)",
      text: "rgb(var(--sage) / 0.98)"
    };
  }

  if (progressPercent >= 35) {
    return {
      stroke: "rgb(var(--amber) / 0.98)",
      fill: "rgb(var(--amber) / 0.14)",
      text: "rgb(var(--amber) / 0.98)"
    };
  }

  return {
    stroke: "rgb(var(--rust) / 0.98)",
    fill: "rgb(var(--rust) / 0.14)",
    text: "rgb(var(--rust) / 0.98)"
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const toPolarPoint = (
  centerX: number,
  centerY: number,
  angle: number,
  radius: number
) => ({
  x: centerX + Math.cos(angle) * radius,
  y: centerY + Math.sin(angle) * radius
});

const toChartLabel = (label: string) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("cognitive reasoning")) {
    return "Reasoning";
  }

  if (normalized.includes("learning")) {
    return "Learning";
  }

  if (normalized.includes("epistemic")) {
    return "Epistemic";
  }

  if (normalized.includes("metacognition")) {
    return "Metacognition";
  }

  if (normalized.includes("human interaction")) {
    return "Human";
  }

  if (normalized.includes("multimodal")) {
    return "Multimodal";
  }

  if (normalized.includes("safety")) {
    return "Safety";
  }

  if (normalized.includes("autonomy")) {
    return "Autonomy";
  }

  if (normalized.includes("robustness")) {
    return "Robustness";
  }

  return label;
};

const getLabelPlacement = (angleDegrees: number) => {
  if (angleDegrees >= 250 && angleDegrees <= 290) {
    return { anchor: "middle" as const, offsetX: 0, offsetY: -12 };
  }

  if (angleDegrees > 290 && angleDegrees < 340) {
    return { anchor: "start" as const, offsetX: 10, offsetY: -4 };
  }

  if (angleDegrees >= 340 || angleDegrees <= 20) {
    return { anchor: "start" as const, offsetX: 14, offsetY: 3 };
  }

  if (angleDegrees > 20 && angleDegrees < 80) {
    return { anchor: "start" as const, offsetX: 10, offsetY: 12 };
  }

  if (angleDegrees >= 80 && angleDegrees <= 100) {
    return { anchor: "middle" as const, offsetX: 0, offsetY: 14 };
  }

  if (angleDegrees > 100 && angleDegrees < 160) {
    return { anchor: "end" as const, offsetX: -10, offsetY: 12 };
  }

  if (angleDegrees >= 160 && angleDegrees <= 200) {
    return { anchor: "end" as const, offsetX: -14, offsetY: 3 };
  }

  return { anchor: "end" as const, offsetX: -10, offsetY: -4 };
};

export const DimensionProgressRadar = ({
  dimensions
}: DimensionProgressRadarProps) => {
  const [activeDimensionId, setActiveDimensionId] = useState<string | null>(null);
  const inactiveLabelColor = "rgb(var(--ink-600) / 0.9)";

  const chart = useMemo(() => {
    const safeDimensions = dimensions.slice(0, 12);
    const width = 620;
    const height = 228;
    const centerX = 310;
    const centerY = 116;
    const chartRadius = 98;
    const labelRadius = 142;
    const ringCount = 4;
    const labelInsetX = 18;
    const labelInsetY = 14;
    const startingAngle = -Math.PI / 2;
    const angleStep = (Math.PI * 2) / Math.max(1, safeDimensions.length);

    const axes = safeDimensions.map((dimension, index) => {
      const angle = startingAngle + index * angleStep;
      const angleDegrees = ((angle * 180) / Math.PI + 360) % 360;
      const edgePoint = toPolarPoint(centerX, centerY, angle, chartRadius);
      const rawLabelPoint = toPolarPoint(centerX, centerY, angle, labelRadius);
      const valuePoint = toPolarPoint(
        centerX,
        centerY,
        angle,
        (chartRadius * clampPercent(dimension.progressPercent)) / 100
      );
      const labelText = toChartLabel(dimension.label);
      const estimatedWidth = labelText.length * 7.2;
      const { anchor, offsetX, offsetY } = getLabelPlacement(angleDegrees);
      const rawX = rawLabelPoint.x + offsetX;
      const rawY = rawLabelPoint.y + offsetY;
      const labelX =
        anchor === "start"
          ? clamp(rawX, labelInsetX, width - labelInsetX - estimatedWidth)
          : anchor === "end"
            ? clamp(rawX, labelInsetX + estimatedWidth, width - labelInsetX)
            : clamp(
                rawX,
                labelInsetX + estimatedWidth / 2,
                width - labelInsetX - estimatedWidth / 2
              );
      const labelY = clamp(rawY, labelInsetY + 2, height - labelInsetY - 2);

      return {
        ...dimension,
        angle,
        edgePoint,
        valuePoint,
        labelText,
        labelX,
        labelY,
        anchor
      };
    });

    const rings = Array.from({ length: ringCount }, (_, index) => {
      const ratio = (index + 1) / ringCount;
      const radius = chartRadius * ratio;
      const points = axes.map((axis) => toPolarPoint(centerX, centerY, axis.angle, radius));

      return {
        key: radius,
        points: points.map((point) => `${point.x},${point.y}`).join(" ")
      };
    });

    return {
      width,
      height,
      centerX,
      centerY,
      axes,
      rings,
      polygon: axes.map((axis) => `${axis.valuePoint.x},${axis.valuePoint.y}`).join(" ")
    };
  }, [dimensions]);

  const activeDimension =
    chart.axes.find((dimension) => dimension.id === activeDimensionId) ?? chart.axes[0] ?? null;
  const activeTone = activeDimension
    ? getProgressTone(activeDimension.progressPercent)
    : getProgressTone(0);

  if (chart.axes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[1.35rem] border border-line/80 bg-paper-50/72 p-3.5 md:rounded-[1.6rem] md:p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 md:text-xs md:tracking-[0.22em]">
          Dimension progress
        </p>
        {activeDimension ? (
          <div className="min-w-0 text-right">
            <p
              className="max-w-[14rem] truncate text-[10px] uppercase tracking-[0.14em] text-ink-600 md:max-w-[16rem] md:text-[11px] md:tracking-[0.16em]"
              title={activeDimension.label}
            >
              {activeDimension.label}
            </p>
            <p
              className="mt-1 inline-flex items-center justify-end gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] md:text-xs md:tracking-[0.16em]"
              style={{ color: activeTone.text }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: activeTone.stroke }}
              />
              <span>{activeDimension.progressPercent}%</span>
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-3 h-[14.25rem] md:mt-4 md:h-[14.75rem]">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label="Radar chart showing progress across current dimensions"
        >
          {chart.rings.map((ring, index) => (
            <polygon
              key={ring.key}
              points={ring.points}
              fill="none"
              stroke="rgb(var(--line) / 0.44)"
              strokeWidth={index === chart.rings.length - 1 ? 1.1 : 0.9}
            />
          ))}

          {chart.axes.map((axis) => {
            const tone = getProgressTone(axis.progressPercent);

            return (
              <g key={`${axis.id}-axis`}>
                <line
                  x1={chart.centerX}
                  y1={chart.centerY}
                  x2={axis.edgePoint.x}
                  y2={axis.edgePoint.y}
                  stroke="rgb(var(--line) / 0.28)"
                  strokeWidth="0.95"
                />
                <line
                  x1={chart.centerX}
                  y1={chart.centerY}
                  x2={axis.valuePoint.x}
                  y2={axis.valuePoint.y}
                  stroke={tone.stroke}
                  strokeWidth={axis.id === activeDimension?.id ? 3.2 : 2.35}
                  strokeLinecap="round"
                  opacity={axis.id === activeDimension?.id ? 1 : 0.9}
                />
              </g>
            );
          })}

          <polygon
            points={chart.polygon}
            fill="rgb(var(--paper-100) / 0.22)"
            stroke="rgb(var(--ink-900) / 0.24)"
            strokeWidth="1.65"
          />

          {chart.axes.map((axis) => {
            const active = axis.id === activeDimension?.id;
            const tone = getProgressTone(axis.progressPercent);

            return (
              <g
                key={axis.id}
                tabIndex={0}
                role="button"
                aria-label={`${axis.label}: ${axis.progressPercent}% progress`}
                onMouseEnter={() => setActiveDimensionId(axis.id)}
                onMouseLeave={() => setActiveDimensionId(null)}
                onFocus={() => setActiveDimensionId(axis.id)}
                onBlur={() => setActiveDimensionId(null)}
                className="cursor-default outline-none"
              >
                <circle
                  cx={axis.valuePoint.x}
                  cy={axis.valuePoint.y}
                  r="12"
                  fill="transparent"
                />
                <circle
                  cx={axis.valuePoint.x}
                  cy={axis.valuePoint.y}
                  r={active ? 10 : 8}
                  fill={tone.fill}
                  stroke="none"
                  opacity={active ? 0.95 : 0.7}
                />
                <circle
                  cx={axis.valuePoint.x}
                  cy={axis.valuePoint.y}
                  r={active ? 6 : 5}
                  fill={tone.stroke}
                  stroke="rgb(var(--paper-50) / 0.96)"
                  strokeWidth="2"
                />

                <text
                  x={axis.labelX}
                  y={axis.labelY}
                  textAnchor={axis.anchor}
                  dominantBaseline="middle"
                  style={{ fill: active ? tone.stroke : inactiveLabelColor }}
                  className="text-[11px] uppercase tracking-[0.12em] md:text-xs md:tracking-[0.14em]"
                >
                  {axis.labelText}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
