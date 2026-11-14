import { STATUS_LABEL } from "@/lib/status";

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
