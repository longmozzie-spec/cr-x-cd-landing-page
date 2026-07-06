const SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

export interface SheetNewRow {
  action: "new";
  order_code: string;
  full_name: string;
  phone: string;
  email: string | null;
  social: string | null;
  note: string | null;
  amount: number;
  created_at: string;
}

export interface SheetPaidUpdate {
  action: "paid";
  order_code: string;
  paid_amount: number;
  paid_at: string;
}

type SheetPayload = SheetNewRow | SheetPaidUpdate;

export function syncToSheet(data: SheetPayload): void {
  if (!SHEET_URL) return;
  fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch((err) => {
    console.error("Google Sheet sync error:", err);
  });
}
