import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const green = (s: string) => `\x1b[32m${s}\x1b[0m`
const red = (s: string) => `\x1b[31m${s}\x1b[0m`
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`

async function seed() {
  console.log(cyan('\n🌱 Bosworth KK-FIX — Seed Script\n'))

  const { data: existing } = await supabase.from('products').select('id').eq('slug', 'kk-fix').single()

  if (existing) {
    console.log(yellow('⚠️  Product "kk-fix" already exists — skipping insert (idempotent).'))
    console.log(yellow('   Delete the existing product from Supabase dashboard to re-seed.\n'))
    process.exit(0)
  }

  console.log('Inserting product…')
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: 'KK-FIX',
      slug: 'kk-fix',
      part_number: 'BSW-KKF-500',
      tagline: 'Conveyor Belt & Rubber Lagging Repair Kit',
      description: 'The Bosworth KK-FIX is a fire-retardant, mercury-free polyurethane repair system engineered for conveyor belts and pulley lagging in the harshest mining and industrial environments. Tough in all environments — heat, moisture and chemical resistant. Version 2 formulation is fully mercury-free and certified for mining use.',
      category: 'Repair Kits',
      is_active: true,
    })
    .select()
    .single()

  if (productError || !product) {
    console.error(red('✗ Failed to insert product:'), productError?.message)
    process.exit(1)
  }
  console.log(green(`✓ Product created: ${product.name} (${product.id})`))

  const kitContents = [
    { item_name: 'KK-Fix Polyether Compound', item_description: 'Flexible, strong, chemical-resistant polyurethane resin', quantity: 'Part A', sort_order: 0 },
    { item_name: 'Hardener', item_description: 'Fast-reacting activator for durable cure', quantity: 'Part B', sort_order: 1 },
    { item_name: 'Cleaning Solvent', item_description: 'Removes oils, grease and contaminants from repair surface', quantity: '1 sachet', sort_order: 2 },
    { item_name: 'Reinforcing Fabric', item_description: 'Adds tensile strength to the completed repair', quantity: '1 piece', sort_order: 3 },
    { item_name: 'Protective Gloves', item_description: 'Chemical-resistant gloves for safe handling', quantity: '1 pair', sort_order: 4 },
    { item_name: 'Spatula', item_description: 'For mixing and applying compound', quantity: '1 unit', sort_order: 5 },
    { item_name: 'Stirrer', item_description: 'For thorough mixing of Part A and Part B', quantity: '1 unit', sort_order: 6 },
    { item_name: 'Ready-to-Use Packaging', item_description: 'Complete kit in sealed packaging', quantity: '—', sort_order: 7 },
  ]

  console.log('Inserting kit contents…')
  const { error: kitError } = await supabase.from('kit_contents').insert(
    kitContents.map(item => ({ ...item, product_id: product.id }))
  )
  if (kitError) { console.error(red('✗ Kit contents failed:'), kitError.message) } else { console.log(green(`✓ ${kitContents.length} kit contents inserted`)) }

  const instructions = [
    { step_number: 1, title: 'Clean the Surface', description: 'Inspect the damaged area thoroughly. Using the included Cleaning Solvent and a clean lint-free cloth, remove all oil, grease, dust, rust, and surface contaminants from the repair zone and surrounding area. The surface must be completely clean and dry before proceeding. Any contamination will compromise adhesion.', warning: 'Use in a well-ventilated area when applying cleaning solvent. Avoid prolonged skin contact.' },
    { step_number: 2, title: 'Prepare the Area', description: 'Using a grinder, file, or wire brush, roughen the entire damaged area to create a mechanical key for adhesion. Remove all loose rubber, frayed edges, and debris. Feather the edges of the damage where possible. The prepared zone should extend at least 20–30mm beyond the visible damage on all sides.', warning: 'Wear eye protection during grinding. Ensure belt is locked out / tagged out before working.' },
    { step_number: 3, title: 'Cut the Reinforcing Fabric', description: 'Measure and cut the included reinforcing fabric so that it covers the entire repair area with an overlap of at least 20mm beyond the prepared zone on all sides. A slightly oversized piece is better than too small. Set aside for later use.', warning: null },
    { step_number: 4, title: 'Mix the Compound', description: 'Open Part A (KK-Fix Polyether Compound) and Part B (Hardener). Combine both components into a clean container and mix vigorously using the included stirrer for a minimum of 2 full minutes until the mixture is completely uniform in colour and consistency, with no streaks. Work quickly — pot life is approximately 5–8 minutes at 25°C. Higher temperatures shorten pot life.', warning: 'Wear gloves. Avoid skin and eye contact. Do not inhale vapours. Mix in a ventilated area.' },
    { step_number: 5, title: 'Apply First Coat', description: 'Using the spatula, apply a generous and even first coat of the mixed compound to the entire prepared surface. Work the compound into any voids, cracks, or recesses. Ensure complete coverage with no dry spots, bubbles, or air pockets. The layer should be approximately 2–3mm thick.', warning: null },
    { step_number: 6, title: 'Embed the Reinforcing Fabric', description: 'Immediately press the reinforcing fabric onto the wet first coat, centring it over the damage. Using the spatula or your gloved fingers, smooth the fabric firmly from the centre outward, pressing out all air bubbles and ensuring full contact with the compound below. The fabric must be fully wetted by the compound.', warning: null },
    { step_number: 7, title: 'Apply Finishing Coat', description: 'Apply a second, generous coat of compound over the top of the embedded fabric. Ensure the fabric is completely encapsulated with no exposed edges or fibres. Feather and blend the edges of the repair smoothly into the surrounding belt surface using the spatula. The surface should be as flush and smooth as possible.', warning: 'Do not touch, flex, or disturb the repair during the curing period.' },
    { step_number: 8, title: 'Cure and Return to Service', description: 'Allow a minimum of 10 minutes for touch-dry and 30–45 minutes for full structural cure at ambient temperature (20–25°C). Cold conditions will extend cure time. Do not operate the conveyor belt or apply any load to the repair until fully cured. Inspect the completed repair — it should be firmly bonded, smooth, and flush with the belt surface. If any edges are lifting, apply additional compound and allow to re-cure.', warning: null },
  ]

  console.log('Inserting instructions…')
  const { error: instrError } = await supabase.from('instructions').insert(
    instructions.map(i => ({ ...i, product_id: product.id }))
  )
  if (instrError) { console.error(red('✗ Instructions failed:'), instrError.message) } else { console.log(green(`✓ ${instructions.length} instruction steps inserted`)) }

  const safetyItems = [
    { type: 'hazard', icon: 'flame', label: 'Flammable', description: 'Keep away from heat sources and open flame. Store below 30°C in a cool, dry place.', sort_order: 0 },
    { type: 'hazard', icon: 'alert-octagon', label: 'Health Hazard', description: 'May cause mild skin and eye irritation with prolonged or repeated contact. Avoid unnecessary exposure.', sort_order: 1 },
    { type: 'hazard', icon: 'leaf', label: 'Environmental Hazard', description: 'Toxic to aquatic organisms with potential for long-term adverse effects. Do not allow to enter drains, watercourses, or soil.', sort_order: 2 },
    { type: 'ppe', icon: 'shield', label: 'Protective Gloves', description: 'Wear chemical-resistant gloves (nitrile or neoprene) at all times during mixing and application.', sort_order: 3 },
    { type: 'ppe', icon: 'eye', label: 'Eye Protection', description: 'Wear safety glasses or chemical splash goggles during preparation, mixing, and application.', sort_order: 4 },
    { type: 'ppe', icon: 'wind', label: 'Ventilation Required', description: 'Use only in well-ventilated areas or wear appropriate respiratory protection if working in confined spaces.', sort_order: 5 },
    { type: 'disposal', icon: 'trash-2', label: 'Hazardous Waste Disposal', description: 'Dispose of used containers and uncured material as hazardous waste in strict accordance with local environmental regulations.', sort_order: 6 },
    { type: 'warning', icon: 'alert-triangle', label: 'Keep Away From Food', description: 'Keep product away from food, beverages, and animal feed at all times. Wash hands thoroughly after use.', sort_order: 7 },
  ]

  console.log('Inserting safety items…')
  const { error: safetyError } = await supabase.from('safety_items').insert(
    safetyItems.map(i => ({ ...i, product_id: product.id }))
  )
  if (safetyError) { console.error(red('✗ Safety items failed:'), safetyError.message) } else { console.log(green(`✓ ${safetyItems.length} safety items inserted`)) }

  console.log(cyan('\n✅  Seed complete. Visit http://localhost:3000/products/kk-fix to see the product page.\n'))
}

seed().catch(err => {
  console.error(red('\n✗ Seed script failed:'), err)
  process.exit(1)
})
