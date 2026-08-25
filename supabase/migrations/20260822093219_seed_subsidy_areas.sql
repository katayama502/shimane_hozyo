insert into subsidy_areas (subsidy_id, area_id)
select s.id, a.id
from (values
  ('shimane-equipment-investment-2026','shimane'),
  ('shimane-startup-support-2026','shimane'),
  ('shimane-dx-support-2026','shimane'),
  ('shimane-energy-saving-2026','shimane'),
  ('shimane-business-succession-2026','shimane'),
  ('joho-shimane-sales-channel-2026','shimane'),
  ('joho-shimane-product-development-2026','shimane'),
  ('joho-shimane-employment-2025','shimane'),
  ('matsue-shokibo-jizoku-2026','matsue'),
  ('matsue-startup-2026','matsue'),
  ('matsue-akitenpo-2026','matsue'),
  ('matsue-tourism-equipment-2026','matsue'),
  ('izumo-it-dx-2026','izumo'),
  ('izumo-startup-2026','izumo'),
  ('izumo-agri-equipment-2026','izumo'),
  ('hamada-fishery-2026','hamada'),
  ('hamada-sales-channel-2026','hamada'),
  ('hamada-akiya-migration-2026','hamada'),
  ('masuda-startup-challenge-2026','masuda'),
  ('masuda-equipment-2026','masuda'),
  ('masuda-employment-2025','masuda'),
  ('oda-tourism-2026','oda'),
  ('oda-akitenpo-2026','oda'),
  ('yasugi-monozukuri-2026','yasugi'),
  ('gotsu-startup-2026','gotsu'),
  ('unnan-business-succession-2026','unnan'),
  ('okuizumo-agri-forestry-2026','okuizumo'),
  ('tsuwano-migration-housing-2026','tsuwano'),
  ('okinoshima-tourism-2026','okinoshima'),
  ('ama-startup-2026','ama')
) as m(subsidy_slug, area_slug)
join subsidies s on s.slug = m.subsidy_slug
join areas a on a.slug = m.area_slug;
