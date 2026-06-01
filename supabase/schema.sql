-- ============================================================
-- Schema cho "My English" trên Supabase.
-- Chạy file này 1 lần trong Supabase → SQL Editor → New query → Run.
-- Thiết kế cho app CÁ NHÂN (1 người dùng, KHÔNG đăng nhập):
--   - Mọi truy cập đi qua API server của Next.js dùng SERVICE ROLE key.
--   - Bật RLS + KHÔNG tạo policy => anon key (nếu lộ) không đọc/ghi được.
--     Service role bỏ qua RLS nên server vẫn hoạt động bình thường.
-- ============================================================

-- ---------- Chủ đề ----------
create table if not exists public.topics (
  id          text primary key,
  title       text not null,
  description text default '',
  icon        text default '',
  accent      text default '',
  sort_order  int  default 0
);

-- ---------- Câu / cụm từ ----------
create table if not exists public.phrases (
  id          text primary key,
  topic_id    text not null references public.topics(id) on delete cascade,
  en          text not null,
  vi          text not null,
  ipa         text,
  highlights  jsonb default '[]'::jsonb,
  note        text,
  example     text,
  tags        jsonb default '[]'::jsonb,
  sort_order  int  default 0
);
create index if not exists phrases_topic_idx on public.phrases (topic_id, sort_order);

-- ---------- Tiến độ học (1 dòng / câu, app 1 người dùng) ----------
create table if not exists public.user_progress (
  phrase_id      text primary key references public.phrases(id) on delete cascade,
  status         text not null default 'learning',   -- 'learning' | 'learned'
  reviewed_count int  not null default 0,
  starred        boolean not null default false,
  updated_at     timestamptz default now()
);

-- ---------- Thói quen nói chuyện (singleton 1 dòng) ----------
create table if not exists public.speaking_profile (
  id               int primary key default 1 check (id = 1),
  fillers          text default '',
  daily_lines      text default '',
  personality      text default '',
  stuck_situations text default '',
  updated_at       timestamptz default now()
);
insert into public.speaking_profile (id) values (1)
  on conflict (id) do nothing;

-- ---------- Sổ tay từ vựng ----------
create table if not exists public.vocab_notes (
  id         uuid primary key default gen_random_uuid(),
  term       text not null,
  note       text,
  created_at timestamptz default now()
);
create index if not exists vocab_notes_created_idx on public.vocab_notes (created_at desc);

-- ---------- Bật RLS, không policy (chỉ service role truy cập) ----------
alter table public.topics           enable row level security;
alter table public.phrases          enable row level security;
alter table public.user_progress    enable row level security;
alter table public.speaking_profile enable row level security;
alter table public.vocab_notes      enable row level security;
