import Link from "next/link";
import { cn } from "@/lib/cn";
import { buildCommunityHref } from "@/lib/community";

export const FeedbackLink = ({
  dimensionId,
  questionId,
  source,
  className
}: {
  dimensionId?: string;
  questionId?: string;
  source?: string;
  className?: string;
}) => (
  <Link
    href={buildCommunityHref({ dimensionId, questionId, source })}
    className={cn(
      "text-xs font-medium text-sky transition hover:text-ink-900 md:text-sm",
      className
    )}
  >
    Got feedback for us?
  </Link>
);
