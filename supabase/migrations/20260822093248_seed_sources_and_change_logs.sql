insert into sources (subsidy_id, url, is_official, fetched_at, http_status)
select id, official_url, true, verified_at, 200
from subsidies;

insert into change_logs (subsidy_id, field_name, old_value, new_value, changed_by, change_source, created_at)
select id, 'status', 'draft', status::text, 'system', 'manual', verified_at
from subsidies;

insert into change_logs (subsidy_id, field_name, old_value, new_value, changed_by, change_source, created_at)
select id, 'max_amount_yen', null, max_amount_yen::text, 'system', 'manual', verified_at
from subsidies
where max_amount_yen is not null;

insert into ingestion_runs (source_name, started_at, finished_at, run_status, fetched_count, created_count, updated_count, error_count)
values ('manual_seed', '2026-08-15T09:00:00+09', '2026-08-15T09:05:00+09', 'success', 30, 30, 0, 0);
