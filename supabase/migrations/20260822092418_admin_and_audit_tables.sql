create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('editor', 'approver', 'owner')),
  display_name text,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  target_table text not null,
  target_id uuid,
  detail jsonb,
  created_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from admin_profiles where id = auth.uid());
$$;
