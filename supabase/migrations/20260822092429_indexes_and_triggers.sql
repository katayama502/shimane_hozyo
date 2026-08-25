create index idx_subsidies_status on subsidies (status);
create index idx_subsidies_application_end_at on subsidies (application_end_at);
create index idx_subsidies_verified_at on subsidies (verified_at);
create index idx_subsidies_published_at on subsidies (published_at);
create index idx_subsidies_title_trgm on subsidies using gin (title gin_trgm_ops);
create index idx_subsidies_summary_trgm on subsidies using gin (summary gin_trgm_ops);
create index idx_subsidies_search_vector on subsidies using gin (search_vector);
create index idx_subsidies_organization_id on subsidies (organization_id);

create index idx_subsidy_areas_area_id on subsidy_areas (area_id);
create index idx_subsidy_tags_tag_id on subsidy_tags (tag_id);
create index idx_sources_subsidy_id on sources (subsidy_id);
create index idx_change_logs_subsidy_id on change_logs (subsidy_id);
create index idx_areas_level on areas (level);
create index idx_organizations_name_trgm on organizations using gin (name gin_trgm_ops);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_organizations_updated_at
  before update on organizations
  for each row execute function public.set_updated_at();

create trigger trg_subsidies_updated_at
  before update on subsidies
  for each row execute function public.set_updated_at();
