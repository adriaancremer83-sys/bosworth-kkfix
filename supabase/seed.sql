-- KK-Fix Seed Data
-- Run in: https://supabase.com/dashboard/project/rtjeqeobxycfsipckwur/editor
-- NOTE: Run migration_step2.sql and migration_step3.sql FIRST before this file.

DO $$
DECLARE
  pid uuid;
BEGIN

  -- ── 1. Product ──────────────────────────────────────────────────────────────
  SELECT id INTO pid FROM products WHERE slug = 'kk-fix';

  IF pid IS NULL THEN
    INSERT INTO products (
      name, slug, tagline, subtitle, description,
      category, part_number, version, badges, is_active
    ) VALUES (
      'KK-Fix',
      'kk-fix',
      'Clean. Fast. Permanent.',
      'Conveyor Belt & Rubber Lagging Repair Kit',
      'KK-Fix is a two-component polyether-based repair system for conveyor belts and rubber lagging. Formulated for mine-site conditions, it delivers a permanent, flexible repair in under an hour — no hot work, no belt removal, no downtime.',
      'Conveyor Belt Repair',
      'BSW-KKF-500',
      'Version 2 — Mercury Free',
      ARRAY['🔥 FIRE RETARDANT', '☿ MERCURY FREE', '✓ VERSION 2'],
      true
    ) RETURNING id INTO pid;
  ELSE
    UPDATE products SET
      tagline    = 'Clean. Fast. Permanent.',
      subtitle   = 'Conveyor Belt & Rubber Lagging Repair Kit',
      description = 'KK-Fix is a two-component polyether-based repair system for conveyor belts and rubber lagging. Formulated for mine-site conditions, it delivers a permanent, flexible repair in under an hour — no hot work, no belt removal, no downtime.',
      part_number = 'BSW-KKF-500',
      version    = 'Version 2 — Mercury Free',
      badges     = ARRAY['🔥 FIRE RETARDANT', '☿ MERCURY FREE', '✓ VERSION 2'],
      is_active  = true
    WHERE id = pid;
  END IF;

  -- ── 2. Kit Contents ─────────────────────────────────────────────────────────
  DELETE FROM kit_contents WHERE product_id = pid;

  INSERT INTO kit_contents (product_id, item_name, item_description, quantity, sort_order) VALUES
  (pid, 'KK-Fix Polyether Compound (Part A)', 'Two-component polyether repair compound base — forms a permanent flexible bond', '1 unit', 0),
  (pid, 'Hardener (Part B)',                  'Activator component — mix with Part A immediately before use',                  '1 unit', 1),
  (pid, 'Cleaning Solvent',                   'Surface preparation solvent — removes oils, grease and contaminants',           '1 bottle', 2),
  (pid, 'Reinforcing Fabric',                 'High-strength textile reinforcement — embedded into repair compound',           '1 sheet', 3),
  (pid, 'Protective Gloves',                  'Chemical-resistant gloves for safe handling during mixing and application',     '1 pair', 4),
  (pid, 'Spatula',                             'Mixing and application tool — use for compound preparation and spreading',     '1 piece', 5),
  (pid, 'Ready-to-Use Packaging',             'Pre-measured components — no weighing required, mix entire contents of Part B into Part A', '1 kit', 6);

  -- ── 3. Instructions ─────────────────────────────────────────────────────────
  DELETE FROM instructions WHERE product_id = pid;

  INSERT INTO instructions (product_id, step_number, title, description, warning, estimated_time) VALUES
  (pid, 1,
   'Clean the Surface',
   'Inspect the damaged area thoroughly. Using the included Cleaning Solvent and a clean lint-free cloth, remove all oil, grease, dust, rust, and surface contaminants from the repair zone and surrounding area. The surface must be completely clean and dry before proceeding.',
   'Use in well-ventilated area. Avoid prolonged skin contact with solvent.',
   '2–3 min'),

  (pid, 2,
   'Prepare the Area',
   'Using a grinding disc or coarse sandpaper (80–120 grit), roughen the repair area and extend 25–30mm beyond the damaged zone. This creates a mechanical key for the repair compound. Remove all grinding residue with a clean cloth lightly dampened with Cleaning Solvent and allow the surface to dry completely.',
   'Wear safety glasses during grinding. Ensure all dust and solvent residue is removed before applying compound.',
   '2–3 min'),

  (pid, 3,
   'Cut the Reinforcing Fabric',
   'Cut the reinforcing fabric to a size that extends at least 20mm beyond the damaged area on all sides. For larger or deeper repairs, cut multiple layers. Keep the cut fabric on a clean, dry surface until required.',
   NULL,
   '1–2 min'),

  (pid, 4,
   'Mix the Compound',
   'Pour the full contents of Part B (Hardener) into the Part A (Polyether Compound) container. Mix thoroughly with the included spatula for a minimum of 60 seconds, scraping the sides and bottom of the container to ensure a completely homogeneous mix. The compound is ready when the colour is fully uniform throughout. Pot life: 5–8 minutes.',
   'Work quickly once mixed — pot life is 5–8 minutes. Do not attempt to use material that has begun to gel.',
   '1–2 min'),

  (pid, 5,
   'Apply First Coat',
   'Using the spatula, apply an even first coat of the mixed compound over the prepared repair area. Spread to a uniform thickness of approximately 1–2mm, ensuring complete coverage across the damaged zone and into all cracks or voids. Work briskly within the pot life window.',
   NULL,
   '1–2 min'),

  (pid, 6,
   'Embed the Reinforcing Fabric',
   'Centre the pre-cut reinforcing fabric over the wet first coat and press firmly into the compound with the spatula. Work from the centre outward to expel any air and ensure full contact between fabric and compound. All edges of the fabric must be fully embedded — no lifting or air pockets.',
   NULL,
   '1–2 min'),

  (pid, 7,
   'Apply Finishing Coat',
   'Apply a final coat of compound over the embedded reinforcing fabric. Fill the fabric weave completely and build up to a smooth, flush surface. Feather the outer edges with the spatula to create a seamless transition to the surrounding belt surface. The finished repair should be level with or marginally proud of the belt.',
   NULL,
   '1–2 min'),

  (pid, 8,
   'Cure and Return to Service',
   'Allow the repair to cure at ambient temperature for a minimum of 30–45 minutes before returning the belt to service. In cold conditions (below 15°C) extend the cure time accordingly. Do not load or flex the repair until fully set. Full mechanical strength is achieved within 24 hours.',
   'Do not return belt to service before minimum cure time has elapsed. Cold conditions will extend required cure time.',
   '30–45 min');

  -- ── 4. Safety Items ─────────────────────────────────────────────────────────
  DELETE FROM safety_items WHERE product_id = pid;

  INSERT INTO safety_items (product_id, icon, label, description, type, sort_order) VALUES
  (pid, 'flame',          'Flammable',             'Keep away from heat sources and open flame. Store below 30°C in a cool, dry place.',                                                              'hazard',  0),
  (pid, 'alert-triangle', 'Health Hazard',          'May cause mild skin and eye irritation with prolonged or repeated contact. Wash affected areas immediately with soap and water.',                 'hazard',  1),
  (pid, 'leaf',           'Environmental Hazard',   'Toxic to aquatic organisms with potential for long-term adverse effects. Prevent product from entering drains, waterways or soil.',               'hazard',  2),
  (pid, 'shield',         'Chemical-Resistant Gloves', 'Nitrile or neoprene gloves must be worn during mixing and application. Included gloves meet minimum requirement.',                           'ppe',     3),
  (pid, 'eye',            'Eye Protection',         'Safety glasses or chemical splash goggles required. In case of eye contact rinse immediately with water for 15 minutes and seek medical advice.', 'ppe',     4),
  (pid, 'wind',           'Ventilation',            'Use in a well-ventilated area. In confined spaces respiratory protection is required.',                                                           'ppe',     5),
  (pid, 'trash-2',        'Disposal',               'Dispose of cured material and empty containers in accordance with local regulations. Do not pour uncured compound down drains.',                  'disposal',6);

  -- ── 5. Tech Specs ───────────────────────────────────────────────────────────
  DELETE FROM tech_specs WHERE product_id = pid;

  INSERT INTO tech_specs (product_id, key, value, sort_order) VALUES
  (pid, 'Part Number',        'BSW-KKF-500',                    0),
  (pid, 'Compound Type',      'Two-component polyether',        1),
  (pid, 'Pot Life',           '5–8 minutes at 20°C',           2),
  (pid, 'Cure Time',          '30–45 minutes (ambient)',        3),
  (pid, 'Full Strength',      '24 hours',                       4),
  (pid, 'Application Temp',   '5°C – 40°C',                    5),
  (pid, 'Coverage',           'Up to 500 cm² per kit',         6),
  (pid, 'Flame Rating',       'Fire retardant',                 7),
  (pid, 'Mercury Content',    'Mercury free (Version 2)',       8),
  (pid, 'Packaging',          'Pre-measured, no weighing',      9);

  RAISE NOTICE 'KK-Fix seed complete. Product ID: %', pid;

END $$;
