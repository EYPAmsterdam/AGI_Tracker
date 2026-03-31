import { CONFIDENCE_LABELS, PROOF_TYPE_LABELS, STATUS_LABELS } from "@/lib/milestone-utils";
import { cn } from "@/lib/cn";
import { Confidence, ProofType, Status } from "@/types/agi";

const statusStyles: Record<Status, string> = {
  met: "border-sage/30 bg-sage/10 text-sage",
  in_progress: "border-amber/30 bg-amber/10 text-amber",
  not_met: "border-rust/30 bg-rust/10 text-rust"
};

const confidenceStyles: Record<Confidence, string> = {
  high: "border-sky/25 bg-sky/10 text-sky",
  medium: "border-amber/25 bg-amber/10 text-amber",
  low: "border-rust/25 bg-rust/10 text-rust"
};

const proofTypeStyles: Record<ProofType, string> = {
  benchmark: "border-sky/25 bg-sky/10 text-sky",
  leaderboard: "border-sage/25 bg-sage/10 text-sage",
  research_paper: "border-ink-700/20 bg-ink-700/10 text-ink-800",
  news: "border-amber/25 bg-amber/10 text-amber",
  implementation: "border-ink-600/20 bg-paper-100 text-ink-700"
};

const baseBadge =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]";

export const StatusBadge = ({ status }: { status: Status }) => (
  <span className={cn(baseBadge, statusStyles[status])}>{STATUS_LABELS[status]}</span>
);

export const ConfidenceBadge = ({
  confidence
}: {
  confidence: Confidence;
}) => (
  <span className={cn(baseBadge, confidenceStyles[confidence])}>
    {CONFIDENCE_LABELS[confidence]}
  </span>
);

export const ProofTypeBadge = ({ type }: { type: ProofType }) => (
  <span className={cn(baseBadge, proofTypeStyles[type])}>
    {PROOF_TYPE_LABELS[type]}
  </span>
);
