export type RegistrationStatus = "unpaid" | "paid";

export interface Registration {
  id: number;
  order_code: string;
  full_name: string;
  phone: string;
  email: string | null;
  social: string | null;
  package: string;
  note: string | null;
  amount: number;
  status: RegistrationStatus;
  paid_amount: number | null;
  paid_at: string | null;
  bank_txn_id: string | null;
  created_at: string;
}

/** Payload công khai trả về khi poll trạng thái — KHÔNG lộ thông tin cá nhân */
export interface PublicOrderStatus {
  order_code: string;
  status: RegistrationStatus;
  amount: number;
}
