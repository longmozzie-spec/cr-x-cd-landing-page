-- =====================================================================
--  WORKSHOP CR STUDIO × CD MEDIA — Supabase schema
--  Chạy toàn bộ file này trong Supabase → SQL Editor → New query → Run
-- =====================================================================

-- 1) Bảng đăng ký học viên + đơn hàng
create table if not exists public.registrations (
  id            bigint generated always as identity primary key,
  order_code    text        not null unique,          -- CRWS0001
  full_name     text        not null,
  phone         text        not null,
  email         text,
  social        text,                                 -- Facebook / Zalo
  package       text        not null,
  note          text,
  amount        integer     not null,                 -- số tiền cần thanh toán (VND)
  status        text        not null default 'unpaid' -- 'unpaid' | 'paid'
                check (status in ('unpaid', 'paid')),
  paid_amount   integer,                              -- số tiền thực nhận
  paid_at       timestamptz,
  bank_txn_id   text        unique,                   -- mã giao dịch bank (chống trùng)
  created_at    timestamptz not null default now()
);

create index if not exists registrations_status_idx  on public.registrations (status);
create index if not exists registrations_created_idx  on public.registrations (created_at desc);

-- 2) Sequence để sinh số thứ tự mã đơn (atomic, không trùng khi nhiều người đăng ký cùng lúc)
create sequence if not exists public.order_code_seq start 1;

-- 3) RPC tạo mã đơn kế tiếp dạng CRWS0001
create or replace function public.next_order_code(prefix text default 'CRWS')
returns text
language plpgsql
as $$
declare
  n bigint;
begin
  n := nextval('public.order_code_seq');
  return prefix || lpad(n::text, 4, '0');
end;
$$;

-- 4) Bật RLS. KHÔNG tạo policy cho anon/public
--    => client dùng anon key sẽ KHÔNG đọc/ghi được bảng này.
--    Toàn bộ truy cập đi qua server (service_role key) trong API routes.
alter table public.registrations enable row level security;

-- (Cố ý không có policy nào => chặn mọi truy cập từ client-side.)
