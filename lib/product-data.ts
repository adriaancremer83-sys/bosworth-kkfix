import type { ProductWithRelations } from './types'

/**
 * Static KK-Fix content. This portal serves one product, so the content that
 * used to live in Supabase (see supabase/seed.sql) is baked in here. To edit the
 * guide, edit this file and redeploy — there is no admin CMS.
 */

const PRODUCT_ID = 'kk-fix'
const NOW = '2024-01-01T00:00:00.000Z'

/** Downloadable documents shown in the Documentation section. */
export const KK_FIX_DOCS: {
  title: string
  meta: string
  url: string
  note?: string
}[] = [
  {
    title: 'Safety Data Sheet (SDS)',
    meta: 'Version 2 — Mercury Free · November 2025',
    url: '/msds/kk-fix-msds.pdf',
  },
  {
    title: 'MASC flammability test report',
    meta: 'MASC 26-4549 · SANS 340 (2016) Ed 3, clause 5.3.2.1.1 a) & b) · issued 6 October 2025',
    url: '/docs/kk-fix-masc-26-4549.pdf',
    note:
      'Tested by Mining and Surface Certification (a SANAS-accredited test lab). The samples tested showed no flame, re-flame or smouldering and complied with the requirements. The report covers the samples submitted and applies within South Africa.',
  },
]

export const KK_FIX: ProductWithRelations = {
  id: PRODUCT_ID,
  name: 'KK-Fix',
  slug: 'kk-fix',
  tagline: 'Clean. Fast. Permanent.',
  subtitle: 'Conveyor Belt & Rubber Lagging Repair Kit',
  description:
    'KK-Fix is a two-component polyether-based repair system for conveyor belts and rubber lagging. Formulated for mine-site conditions, it delivers a permanent, flexible repair in under an hour — no hot work, no belt removal, no downtime.',
  category: 'Conveyor Belt Repair',
  part_number: 'BSW-KKF-500',
  version: 'Version 2 — Mercury Free',
  badges: ['🔥 FIRE RETARDANT', '☿ MERCURY FREE', '✓ VERSION 2'],
  hero_image_url: null,
  product_image_url: null,
  gallery_images: [],
  video_url: '/video/kk-fix-instructions.mp4',
  msds_url: '/msds/kk-fix-msds.pdf',
  image_url: null,
  is_active: true,
  created_at: NOW,
  updated_at: NOW,

  kit_contents: [
    ['KK-Fix Polyether Compound (Part A)', 'Two-component polyether repair compound base — forms a permanent flexible bond', '1 unit'],
    ['Hardener (Part B)', 'Activator component — mix with Part A immediately before use', '1 unit'],
    ['Cleaning Solvent', 'Surface preparation solvent — removes oils, grease and contaminants', '1 bottle'],
    ['Reinforcing Fabric', 'High-strength textile reinforcement — embedded into repair compound', '1 sheet'],
    ['Protective Gloves', 'Chemical-resistant gloves for safe handling during mixing and application', '1 pair'],
    ['Spatula', 'Mixing and application tool — use for compound preparation and spreading', '1 piece'],
    ['Ready-to-Use Packaging', 'Pre-measured components — no weighing required, mix entire contents of Part B into Part A', '1 kit'],
  ].map(([item_name, item_description, quantity], i) => ({
    id: `kc-${i}`,
    product_id: PRODUCT_ID,
    item_name,
    item_description,
    quantity,
    image_url: null,
    sort_order: i,
    created_at: NOW,
  })),

  instructions: [
    {
      title: 'Clean the Surface',
      description:
        'Inspect the damaged area thoroughly. Using the included Cleaning Solvent and a clean lint-free cloth, remove all oil, grease, dust, rust, and surface contaminants from the repair zone and surrounding area. The surface must be completely clean and dry before proceeding.',
      warning: 'Use in well-ventilated area. Avoid prolonged skin contact with solvent.',
      estimated_time: '2–3 min',
    },
    {
      title: 'Prepare the Area',
      description:
        'Using a grinding disc or coarse sandpaper (80–120 grit), roughen the repair area and extend 25–30mm beyond the damaged zone. This creates a mechanical key for the repair compound. Remove all grinding residue with a clean cloth lightly dampened with Cleaning Solvent and allow the surface to dry completely.',
      warning: 'Wear safety glasses during grinding. Ensure all dust and solvent residue is removed before applying compound.',
      estimated_time: '2–3 min',
    },
    {
      title: 'Cut the Reinforcing Fabric',
      description:
        'Cut the reinforcing fabric to a size that extends at least 20mm beyond the damaged area on all sides. For larger or deeper repairs, cut multiple layers. Keep the cut fabric on a clean, dry surface until required.',
      warning: null,
      estimated_time: '1–2 min',
    },
    {
      title: 'Mix the Compound',
      description:
        'Pour the full contents of Part B (Hardener) into the Part A (Polyether Compound) container. Mix thoroughly with the included spatula for a minimum of 60 seconds, scraping the sides and bottom of the container to ensure a completely homogeneous mix. The compound is ready when the colour is fully uniform throughout. Pot life: 5–8 minutes.',
      warning: 'Work quickly once mixed — pot life is 5–8 minutes. Do not attempt to use material that has begun to gel.',
      estimated_time: '1–2 min',
    },
    {
      title: 'Apply First Coat',
      description:
        'Using the spatula, apply an even first coat of the mixed compound over the prepared repair area. Spread to a uniform thickness of approximately 1–2mm, ensuring complete coverage across the damaged zone and into all cracks or voids. Work briskly within the pot life window.',
      warning: null,
      estimated_time: '1–2 min',
    },
    {
      title: 'Embed the Reinforcing Fabric',
      description:
        'Centre the pre-cut reinforcing fabric over the wet first coat and press firmly into the compound with the spatula. Work from the centre outward to expel any air and ensure full contact between fabric and compound. All edges of the fabric must be fully embedded — no lifting or air pockets.',
      warning: null,
      estimated_time: '1–2 min',
    },
    {
      title: 'Apply Finishing Coat',
      description:
        'Apply a final coat of compound over the embedded reinforcing fabric. Fill the fabric weave completely and build up to a smooth, flush surface. Feather the outer edges with the spatula to create a seamless transition to the surrounding belt surface. The finished repair should be level with or marginally proud of the belt.',
      warning: null,
      estimated_time: '1–2 min',
    },
    {
      title: 'Cure and Return to Service',
      description:
        'Allow the repair to cure at ambient temperature for a minimum of 30–45 minutes before returning the belt to service. In cold conditions (below 15°C) extend the cure time accordingly. Do not load or flex the repair until fully set. Full mechanical strength is achieved within 24 hours.',
      warning: 'Do not return belt to service before minimum cure time has elapsed. Cold conditions will extend required cure time.',
      estimated_time: '30–45 min',
    },
  ].map((s, i) => ({
    id: `in-${i}`,
    product_id: PRODUCT_ID,
    step_number: i + 1,
    image_url: null,
    created_at: NOW,
    ...s,
  })),

  safety_items: (
    [
      ['flame', 'Flammable', 'Keep away from heat sources and open flame. Store below 30°C in a cool, dry place.', 'hazard'],
      ['alert-triangle', 'Health Hazard', 'May cause mild skin and eye irritation with prolonged or repeated contact. Wash affected areas immediately with soap and water.', 'hazard'],
      ['leaf', 'Environmental Hazard', 'Toxic to aquatic organisms with potential for long-term adverse effects. Prevent product from entering drains, waterways or soil.', 'hazard'],
      ['shield', 'Chemical-Resistant Gloves', 'Nitrile or neoprene gloves must be worn during mixing and application. Included gloves meet minimum requirement.', 'ppe'],
      ['eye', 'Eye Protection', 'Safety glasses or chemical splash goggles required. In case of eye contact rinse immediately with water for 15 minutes and seek medical advice.', 'ppe'],
      ['wind', 'Ventilation', 'Use in a well-ventilated area. In confined spaces respiratory protection is required.', 'ppe'],
      ['trash-2', 'Disposal', 'Dispose of cured material and empty containers in accordance with local regulations. Do not pour uncured compound down drains.', 'disposal'],
    ] as const
  ).map(([icon, label, description, type], i) => ({
    id: `sf-${i}`,
    product_id: PRODUCT_ID,
    icon,
    label,
    description,
    type,
    sort_order: i,
    created_at: NOW,
  })),

  tech_specs: [
    ['Part Number', 'BSW-KKF-500'],
    ['Compound Type', 'Two-component polyether'],
    ['Pot Life', '5–8 minutes at 20°C'],
    ['Cure Time', '30–45 minutes (ambient)'],
    ['Full Strength', '24 hours'],
    ['Application Temp', '5°C – 40°C'],
    ['Coverage', 'Up to 500 cm² per kit'],
    ['Flame Rating', 'Fire retardant'],
    ['Mercury Content', 'Mercury free (Version 2)'],
    ['Packaging', 'Pre-measured, no weighing'],
  ].map(([key, value], i) => ({
    id: `ts-${i}`,
    product_id: PRODUCT_ID,
    key,
    value,
    sort_order: i,
    created_at: NOW,
  })),
}
