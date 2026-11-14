import { STATUS_LABEL } from "@/lib/status";

const COLOR = {
  PLACED: "bg-gray-200",
  PREPARING: "bg-yellow-200",
  READY: "bg-green-300",
  PICKED_UP: "bg-blue-200",
  CANCELLED: "bg-red-200",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${COLOR[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
