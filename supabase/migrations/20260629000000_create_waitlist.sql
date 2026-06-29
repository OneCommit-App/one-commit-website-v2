-- OneCommit website waitlist table.
-- Apply this in the target Supabase project before enabling public waitlist submissions.

create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  sport text not null default 'Track & Field',
  grad_year text not null,
  phone text,
  source text not null default 'website'
);

create unique index if not exists waitlist_email_unique_idx
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

revoke all on table public.waitlist from anon, authenticated;
grant insert on table public.waitlist to anon, authenticated;
grant usage on sequence public.waitlist_id_seq to anon, authenticated;

drop policy if exists "Public can join waitlist" on public.waitlist;

create policy "Public can join waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(first_name)) between 1 and 80
    and char_length(btrim(last_name)) between 1 and 80
    and email = lower(btrim(email))
    and char_length(email) between 5 and 254
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    and sport = 'Track & Field'
    and grad_year in ('2027', '2028', '2029', '2030')
    and (phone is null or char_length(btrim(phone)) <= 40)
    and source = 'website'
  );

comment on table public.waitlist is 'Public beta waitlist submissions from onecommit.us.';
comment on column public.waitlist.source is 'Submission source. Browser inserts should use the default website value.';
