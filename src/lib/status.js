// Shared constants (safe to import in client and server code).

export const SLOTS = [
  "10:30 AM",
  "11:45 AM",
  "01:30 PM",
  "03:00 PM",
  "04:15 PM",
] ;

// Module 2 moves an order along this path.
export const NEXT_STATUS = {
  PLACED: "PREPARING",
  PREPARING: "READY",
};

export const STATUS_LABEL = {
  PLACED: "Placed",
  PREPARING: "Preparing",
  READY: "Ready for pickup",
  PICKED_UP: "Picked up",
  CANCELLED: "Cancelled",
};
