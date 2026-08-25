create or replace function public.search_subsidies(
  p_query text default null,
  p_area_slug text default null,
  p_purpose_slugs text[] default null,
  p_industry_slugs text[] default null,
  p_applicant_type text default null,
  p_status text default null,
  p_deadline_within_days int default null,
  p_amount_min bigint default null,
  p_amount_max bigint default null,
  p_sort text default 'recommended',
  p_limit int default 20,
  p_offset int default 0
) returns table (
  id uuid,
  slug text,
  title text,
  summary text,
  status text,
  data_health data_health,
  applicant_types text[],
  subsidy_rate_text text,
  max_amount_yen bigint,
  min_amount_yen bigint,
  is_rolling boolean,
  application_start_at timestamptz,
  application_end_at timestamptz,
  official_url text,
  verified_at timestamptz,
  organization_name text,
  area_names text[],
  purpose_tags text[],
  industry_tags text[],
  total_count bigint
)
language sql
stable
as $$
  with base as (
    select s.*, o.name as organization_name
    from subsidies s
    left join organizations o on o.id = s.organization_id
    where s.status <> 'draft' and s.published_at is not null and s.published_at <= now()
      and (p_query is null or length(trim(p_query)) < 2 or
           s.title ilike '%' || p_query || '%' or
           s.summary ilike '%' || p_query || '%' or
           coalesce(o.name, '') ilike '%' || p_query || '%')
      and (p_area_slug is null or exists (
        select 1 from subsidy_areas sa join areas a on a.id = sa.area_id
        where sa.subsidy_id = s.id and a.slug = p_area_slug
      ))
      and (p_purpose_slugs is null or array_length(p_purpose_slugs, 1) is null or exists (
        select 1 from subsidy_tags st join tags t on t.id = st.tag_id
        where st.subsidy_id = s.id and t.category = 'purpose' and t.slug = any(p_purpose_slugs)
      ))
      and (p_industry_slugs is null or array_length(p_industry_slugs, 1) is null or exists (
        select 1 from subsidy_tags st join tags t on t.id = st.tag_id
        where st.subsidy_id = s.id and t.category = 'industry' and t.slug = any(p_industry_slugs)
      ))
      and (p_applicant_type is null or p_applicant_type = any(s.applicant_types))
      and (p_amount_min is null or s.max_amount_yen is null or s.max_amount_yen >= p_amount_min)
      and (p_amount_max is null or s.max_amount_yen is null or s.max_amount_yen <= p_amount_max)
  ),
  effective as (
    select b.*,
      case
        when b.application_end_at is not null and b.application_end_at < now() then 'closed'
        else b.status::text
      end as effective_status
    from base b
  ),
  filtered as (
    select *
    from effective e
    where (p_status is null or p_status = '' or e.effective_status = p_status)
      and (
        p_deadline_within_days is null
        or (
          e.application_end_at is not null
          and e.application_end_at >= now()
          and e.application_end_at <= now() + (p_deadline_within_days || ' days')::interval
        )
      )
  )
  select
    f.id,
    f.slug,
    f.title,
    f.summary,
    f.effective_status as status,
    f.data_health,
    f.applicant_types,
    f.subsidy_rate_text,
    f.max_amount_yen,
    f.min_amount_yen,
    f.is_rolling,
    f.application_start_at,
    f.application_end_at,
    f.official_url,
    f.verified_at,
    f.organization_name,
    coalesce((select array_agg(a.name order by a.sort_order) from subsidy_areas sa join areas a on a.id = sa.area_id where sa.subsidy_id = f.id), '{}') as area_names,
    coalesce((select array_agg(t.name order by t.sort_order) from subsidy_tags st join tags t on t.id = st.tag_id where st.subsidy_id = f.id and t.category = 'purpose'), '{}') as purpose_tags,
    coalesce((select array_agg(t.name order by t.sort_order) from subsidy_tags st join tags t on t.id = st.tag_id where st.subsidy_id = f.id and t.category = 'industry'), '{}') as industry_tags,
    count(*) over () as total_count
  from filtered f
  order by
    case when p_sort = 'deadline' then f.application_end_at end asc nulls last,
    case when p_sort = 'updated' then f.verified_at end desc,
    case when p_sort = 'amount' then f.max_amount_yen end desc nulls last,
    case when p_sort is null or p_sort = 'recommended' then
      case f.effective_status
        when 'open' then 0
        when 'anytime' then 1
        when 'scheduled' then 2
        when 'needs_review' then 3
        when 'closed' then 4
        else 5
      end
    end asc,
    f.application_end_at asc nulls last,
    f.verified_at desc
  limit p_limit offset p_offset;
$$;
