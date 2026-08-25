create extension if not exists pg_trgm;

create type subsidy_status as enum (
  'draft', 'scheduled', 'open', 'anytime', 'closed', 'needs_review', 'archived'
);

create type data_health as enum (
  'verified', 'needs_review', 'source_unavailable', 'expired', 'archived'
);

create type area_level as enum ('national', 'prefecture', 'municipality');

create type tag_category as enum ('purpose', 'industry', 'theme');
