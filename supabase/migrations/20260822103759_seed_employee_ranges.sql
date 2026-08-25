-- Best-effort employee-count ranges for a representative subset; subsidies without
-- a value are treated as "no restriction" (always matches) in the diagnosis scorer.
update subsidies set employee_max = 20 where slug in ('matsue-shokibo-jizoku-2026', 'oda-akitenpo-2026');
update subsidies set employee_max = 300 where slug in (
  'shimane-equipment-investment-2026', 'masuda-equipment-2026', 'yasugi-monozukuri-2026',
  'joho-shimane-employment-2025', 'masuda-employment-2025', 'shimane-dx-support-2026'
);
