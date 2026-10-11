-- ============================================================
-- AI 동화책 만들기 — 사용량 제한(남용 방지)용 표와 함수 (Supabase SQL Editor 에서 한 번 실행)
-- 하는 일: IP별·전체 시간당 호출 횟수를 세어서, 한도를 넘으면 Edge Function 이 거절하게 합니다.
-- 기존 테이블은 건드리지 않습니다. 여러 번 실행해도 안전합니다.
-- ============================================================
create table if not exists public.storybook_usage (
  k    text        not null,
  hour timestamptz not null,
  n    int         not null default 0,
  primary key (k, hour)
);
alter table public.storybook_usage enable row level security;
revoke all on public.storybook_usage from anon, authenticated;

create or replace function public.storybook_hit(p_key text, p_limit int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  h timestamptz := date_trunc('hour', now());
  c int;
begin
  insert into public.storybook_usage (k, hour, n) values (p_key, h, 1)
  on conflict (k, hour) do update set n = public.storybook_usage.n + 1
  returning n into c;
  delete from public.storybook_usage where hour < now() - interval '2 days';
  return c <= p_limit;
end;
$$;
revoke all on function public.storybook_hit(text, int) from public, anon, authenticated;
grant execute on function public.storybook_hit(text, int) to service_role;
