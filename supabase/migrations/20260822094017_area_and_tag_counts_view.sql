create view public.area_subsidy_counts as
select a.slug as area_slug, count(distinct s.id) as subsidy_count
from areas a
left join subsidy_areas sa on sa.area_id = a.id
left join subsidies s on s.id = sa.subsidy_id
  and s.status <> 'draft' and s.published_at is not null and s.published_at <= now()
group by a.slug;

create view public.tag_subsidy_counts as
select t.slug as tag_slug, t.category, count(distinct s.id) as subsidy_count
from tags t
left join subsidy_tags st on st.tag_id = t.id
left join subsidies s on s.id = st.subsidy_id
  and s.status <> 'draft' and s.published_at is not null and s.published_at <= now()
group by t.slug, t.category;

grant select on public.area_subsidy_counts to anon, authenticated;
grant select on public.tag_subsidy_counts to anon, authenticated;
