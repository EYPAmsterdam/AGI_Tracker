import { cn } from "@/lib/cn";

export const ProgressMeter = ({
  value,
  compact = false
}: {
  value: number;
  compact?: boolean;
}) => {
  const tone =
    value >= 75
      ? "from-sage/80 to-sage"
      : value >= 35
        ? "from-amber/80 to-amber"
        : "from-rust/80 to-rust";

  return (
    <div className={cn("space-y-1.5 md:space-y-2", compact && "space-y-1")}>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-ink-600 md:text-xs md:tracking-[0.16em]">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-900/8 md:h-2">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all", tone)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};
