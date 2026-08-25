-- Admin bootstrap: lets the very first admin self-register once, then locks itself.
create or replace function public.admin_bootstrap_available()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (select 1 from admin_profiles);
$$;

grant execute on function public.admin_bootstrap_available() to anon, authenticated;

create policy "admin_profiles bootstrap first owner" on admin_profiles
  for insert
  with check (id = auth.uid() and public.admin_bootstrap_available());

-- Diagnosis (design doc S10 "従業員規模が一致"): employee-count range for scoring.
alter table subsidies add column employee_min int;
alter table subsidies add column employee_max int;
