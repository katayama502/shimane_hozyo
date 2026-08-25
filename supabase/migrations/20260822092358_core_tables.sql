create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_type text,
  website_url text,
  contact_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  level area_level not null,
  region text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table subsidies (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  slug text not null unique,
  title text not null,
  summary text not null,
  status subsidy_status not null default 'draft',
  data_health data_health not null default 'needs_review',
  applicant_types text[] not null default '{}',
  eligible_expenses text[] not null default '{}',
  subsidy_rate_text text,
  max_amount_yen bigint,
  min_amount_yen bigint,
  is_rolling boolean not null default false,
  application_start_at timestamptz,
  application_end_at timestamptz,
  official_url text not null,
  guideline_url text,
  contact_text text,
  organization_id uuid references organizations(id) on delete set null,
  eligible_business_text text,
  exclusion_notes text,
  application_process text,
  required_documents text,
  verified_at timestamptz not null default now(),
  published_at timestamptz,
  content_hash text,
  search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(eligible_business_text, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
