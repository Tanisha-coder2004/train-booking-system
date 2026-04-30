export type HoldResponse = {
  holdId: string;
  totalFare: number;
  expiry_timestamp: number;
};

// Backend creates a Razorpay order.
// Frontend uses the order_id and key_id to open the Razorpay checkout modal.
export type RazorpayInitResponse = {
  razorpay_order_id: string;
  totalFare: number;
  holdId: string;
  key_id: string;
};
