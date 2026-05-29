import { cn } from "@/lib/cn";

interface IndexGaugeProps {
  value: number;
  className?: string;
}

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 192;
const CENTER_X = 160;
const CENTER_Y = 168;
const RADIUS = 132;
const BAND_WIDTH = 16;

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const valueToAngle = (value: number) => 180 - (clampPercent(value) / 100) * 180;

const polar = (radius: number, angleDegrees: number) => {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: CENTER_X + radius * Math.cos(radians),
    y: CENTER_Y - radius * Math.sin(radians)
  };
};

const describeArc = (radius: number, fromValue: number, toValue: number) => {
  const start = polar(radius, valueToAngle(fromValue));
  const end = polar(radius, valueToAngle(toValue));
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};

const toneColor = (value: number) => {
  if (value >= 75) {
    return "rgb(var(--sage))";
  }
  if (value >= 35) {
    return "rgb(var(--amber))";
  }
  return "rgb(var(--rust))";
};

const bands = [
  { from: 0, to: 35, color: "rgb(var(--rust))" },
  { from: 35, to: 75, color: "rgb(var(--amber))" },
  { from: 75, to: 100, color: "rgb(var(--sage))" }
];

const ticks = [0, 25, 50, 75, 100];

export const IndexGauge = ({ value, className }: IndexGaugeProps) => {
  const safeValue = clampPercent(value);
  const needleAngle = valueToAngle(safeValue);
  const needleTip = polar(RADIUS - 30, needleAngle);
  const needleTail = polar(20, needleAngle + 180);
  const needleColor = toneColor(safeValue);

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={cn("h-full w-full overflow-visible", className)}
      role="img"
      aria-label={`Composite index gauge at ${safeValue} out of 100`}
    >
      <path
        d={describeArc(RADIUS, 0, 100)}
        fill="none"
        stroke="rgb(var(--line) / 0.5)"
        strokeWidth={BAND_WIDTH + 6}
        strokeLinecap="round"
      />

      {bands.map((band) => (
        <path
          key={`${band.from}-${band.to}`}
          d={describeArc(RADIUS, band.from, band.to)}
          fill="none"
          stroke={band.color}
          strokeWidth={BAND_WIDTH}
          strokeLinecap="butt"
          opacity={0.92}
        />
      ))}

      {ticks.map((tick) => {
        const inner = polar(RADIUS - BAND_WIDTH - 6, valueToAngle(tick));
        const outer = polar(RADIUS + 2, valueToAngle(tick));
        const label = polar(RADIUS - BAND_WIDTH - 22, valueToAngle(tick));
        return (
          <g key={tick}>
            <line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgb(var(--ink-900) / 0.28)"
              strokeWidth="1.1"
            />
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] uppercase tracking-[0.12em]"
              style={{ fill: "rgb(var(--ink-600))" }}
            >
              {tick}
            </text>
          </g>
        );
      })}

      <line
        x1={needleTail.x}
        y1={needleTail.y}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke={needleColor}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx={CENTER_X} cy={CENTER_Y} r="9" fill="rgb(var(--paper-50))" />
      <circle
        cx={CENTER_X}
        cy={CENTER_Y}
        r="9"
        fill="none"
        stroke={needleColor}
        strokeWidth="3"
      />
    </svg>
  );
};
