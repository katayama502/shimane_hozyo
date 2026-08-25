create table subsidy_areas (
  subsidy_id uuid not null references subsidies(id) on delete cascade,
  area_id uuid not null references areas(id) on delete cascade,
  primary key (subsidy_id, area_id)
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category tag_category not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table subsidy_tags (
  subsidy_id uuid not null references subsidies(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (subsidy_id, tag_id)
);

create table sources (
  id uuid primary key default gen_random_uuid(),
  subsidy_id uuid not null references subsidies(id) on delete cascade,
  url text not null,
  is_official boolean not null default true,
  fetched_at timestamptz not null default now(),
  http_status int,
  content_hash text,
  created_at timestamptz not null default now()
);

create table change_logs (
  id uuid primary key default gen_random_uuid(),
  subsidy_id uuid not null references subsidies(id) on delete cascade,
  field_name text not null,
  old_value text,
  new_value text,
  changed_by text not null default 'system',
  change_source text not null default 'manual' check (change_source in ('ingestion', 'manual')),
  created_at timestamptz not null default now()
);

create table ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  run_status text not null default 'running' check (run_status in ('running', 'success', 'partial', 'failed')),
  fetched_count int not null default 0,
  created_count int not null default 0,
  updated_count int not null default 0,
  error_count int not null default 0,
  error_message text
);
