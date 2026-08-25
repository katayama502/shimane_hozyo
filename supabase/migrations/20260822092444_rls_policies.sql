alter table organizations enable row level security;
alter table areas enable row level security;
alter table tags enable row level security;
alter table subsidies enable row level security;
alter table subsidy_areas enable row level security;
alter table subsidy_tags enable row level security;
alter table sources enable row level security;
alter table change_logs enable row level security;
alter table ingestion_runs enable row level security;
alter table admin_profiles enable row level security;
alter table audit_logs enable row level security;

-- organizations: public read, admin write
create policy "organizations public read" on organizations
  for select using (true);
create policy "organizations admin write" on organizations
  for all using (is_admin()) with check (is_admin());

-- areas: public read, admin write
create policy "areas public read" on areas
  for select using (true);
create policy "areas admin write" on areas
  for all using (is_admin()) with check (is_admin());

-- tags: public read, admin write
create policy "tags public read" on tags
  for select using (true);
create policy "tags admin write" on tags
  for all using (is_admin()) with check (is_admin());

-- subsidies: public read only published & not draft, admin full access
create policy "subsidies public read" on subsidies
  for select using (
    status <> 'draft' and published_at is not null and published_at <= now()
  );
create policy "subsidies admin full access" on subsidies
  for all using (is_admin()) with check (is_admin());

-- subsidy_areas: public read only when parent subsidy is publicly visible
create policy "subsidy_areas public read" on subsidy_areas
  for select using (
    exists (
      select 1 from subsidies s
      where s.id = subsidy_areas.subsidy_id
        and s.status <> 'draft' and s.published_at is not null and s.published_at <= now()
    )
  );
create policy "subsidy_areas admin write" on subsidy_areas
  for all using (is_admin()) with check (is_admin());

-- subsidy_tags: same pattern
create policy "subsidy_tags public read" on subsidy_tags
  for select using (
    exists (
      select 1 from subsidies s
      where s.id = subsidy_tags.subsidy_id
        and s.status <> 'draft' and s.published_at is not null and s.published_at <= now()
    )
  );
create policy "subsidy_tags admin write" on subsidy_tags
  for all using (is_admin()) with check (is_admin());

-- sources: admin only
create policy "sources admin only" on sources
  for all using (is_admin()) with check (is_admin());

-- change_logs: public read for published subsidies, admin write
create policy "change_logs public read" on change_logs
  for select using (
    exists (
      select 1 from subsidies s
      where s.id = change_logs.subsidy_id
        and s.status <> 'draft' and s.published_at is not null and s.published_at <= now()
    )
  );
create policy "change_logs admin write" on change_logs
  for all using (is_admin()) with check (is_admin());

-- ingestion_runs: admin only
create policy "ingestion_runs admin only" on ingestion_runs
  for all using (is_admin()) with check (is_admin());

-- admin_profiles: self or admin can read, only admin can write
create policy "admin_profiles self or admin read" on admin_profiles
  for select using (id = auth.uid() or is_admin());
create policy "admin_profiles admin write" on admin_profiles
  for all using (is_admin()) with check (is_admin());

-- audit_logs: admin only
create policy "audit_logs admin only" on audit_logs
  for all using (is_admin()) with check (is_admin());
