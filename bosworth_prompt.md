You are building a world-class, production-grade web application for Bosworth — a South African industrial manufacturer established in 1943, globally respected in the mining and conveyor belt industry. This is a real client project. The output must be so visually exceptional and technically flawless that it could be showcased as a portfolio centrepiece. Do not cut corners. Do not use placeholder code. Build every single component fully.

---

# PROJECT: Bosworth KK-FIX Product Portal

## What this is

A full-stack Next.js 14 application with two distinct sides:

1. **PUBLIC PRODUCT PAGE** — The page a mine worker sees when they scan a QR code printed on a Bosworth product package. It must be immediately clear, visually impressive, and easy to follow even in harsh industrial conditions (bright sunlight, dirty hands, mobile phone).

2. **ADMIN PORTAL** — A secure dashboard where Bosworth staff manage all products, update instructions, and generate print-ready QR codes for product labels.

---

## TECH STACK

- Next.js 14 with App Router (TypeScript, strict mode)
- Tailwind CSS (with custom config — do not use default palette)
- Supabase (PostgreSQL database + Supabase Auth)
- @supabase/ssr for server-side auth
- Framer Motion for animations
- qrcode library for QR generation
- jszip for batch QR download
- lucide-react for icons
- clsx for conditional classes
- Google Fonts: Bebas Neue (display) + DM Sans (body)
- Deployment: Netlify

---

## BRAND & DESIGN SYSTEM

### Colors (define as CSS variables AND Tailwind theme extensions)
```
--red:      #C8102E   → primary brand, CTAs, accents
--black:    #0A0A0A   → page background
--charcoal: #1C1C1C   → section backgrounds
--steel:    #242424   → card backgrounds
--iron:     #383838   → borders, dividers
--silver:   #8A8A8A   → muted/secondary text
--ash:      #B0B0A8   → body text on dark
--white:    #F5F5F0   → headings, primary text (warm white)
--gold:     #B8860B   → premium accent, used sparingly
--amber:    #D97706   → warnings
--success:  #16A34A   → success states
```

### Typography
- **Display**: Bebas Neue — all major headings, step numbers, hero text
- **Body**: DM Sans — all paragraph text, labels, UI elements
- Scale: use clamp() for responsive type on hero elements

### Design Aesthetic
Industrial-luxury. This is NOT a generic SaaS dashboard. Think: the precision of a Rolls-Royce instrument panel meets the toughness of mining equipment. Dark backgrounds. Surgical use of red. Gold accents on premium elements. Every card has depth — subtle inner shadows, micro-borders. Motion is purposeful, not decorative.

### Key Design Rules
- Background is always near-black (#0A0A0A), never pure white sections on public page
- Red (#C8102E) is used for: CTAs, active states, step numbers, accent lines, badges
- All cards: background #242424, border 1px solid #383838, border-radius 8px
- Hover states: border color shifts to rgba(200,16,46,0.4), subtle glow
- Shadows: use dark shadows (rgba(0,0,0,0.4)) not light ones
- Noise texture: apply via pseudo-element on body, SVG data URI, opacity 0.025
- No pure white anywhere. Use #F5F5F0 for primary text.

---

## DATABASE SCHEMA

Run this SQL in Supabase SQL Editor:

```sql
-- Products
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  tagline text,
  description text,
  category text default 'Repair Kits',
  part_number text,
  video_url text,
  msds_url text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Instructions
create table instructions (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  step_number integer not null,
  title text not null,
  description text not null,
  warning text,
  created_at timestamptz default now()
);

-- Safety items
create table safety_items (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  icon text not null,
  label text not null,
  description text,
  type text check (type in ('hazard','ppe','warning','disposal')),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Kit contents
create table kit_contents (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  item_name text not null,
  item_description text,
  quantity text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- RLS
alter table products enable row level security;
alter table instructions enable row level security;
alter table safety_items enable row level security;
alter table kit_contents enable row level security;

create policy "Public can read active products" on products for select using (is_active = true);
create policy "Public can read instructions" on instructions for select using (true);
create policy "Public can read safety_items" on safety_items for select using (true);
create policy "Public can read kit_contents" on kit_contents for select using (true);

create policy "Authenticated full access products" on products for all using (auth.role() = 'authenticated');
create policy "Authenticated full access instructions" on instructions for all using (auth.role() = 'authenticated');
create policy "Authenticated full access safety_items" on safety_items for all using (auth.role() = 'authenticated');
create policy "Authenticated full access kit_contents" on kit_contents for all using (auth.role() = 'authenticated');

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger products_updated_at before update on products
for each row execute function update_updated_at();
```

---

## TYPES (lib/types.ts)

Define these TypeScript interfaces. Use everywhere — no `any` types:

```typescript
export interface Product {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  category: string | null
  part_number: string | null
  video_url: string | null
  msds_url: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Instruction {
  id: string
  product_id: string
  step_number: number
  title: string
  description: string
  warning: string | null
  created_at: string
}

export interface SafetyItem {
  id: string
  product_id: string
  icon: string
  label: string
  description: string | null
  type: 'hazard' | 'ppe' | 'warning' | 'disposal'
  sort_order: number
  created_at: string
}

export interface KitContent {
  id: string
  product_id: string
  item_name: string
  item_description: string | null
  quantity: string | null
  sort_order: number
  created_at: string
}

export interface ProductWithRelations extends Product {
  instructions: Instruction[]
  safety_items: SafetyItem[]
  kit_contents: KitContent[]
}
```

---

## SUPABASE SETUP (lib/supabase.ts and lib/supabase-server.ts)

**lib/supabase.ts** — browser client:
```typescript
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**lib/supabase-server.ts** — server client (for Server Components and API routes):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )
}
```

---

## MIDDLEWARE (middleware.ts — root level)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/products', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*']
}
```

---

## DATA FUNCTIONS (lib/products.ts)

Implement these fully:

```typescript
// getProductBySlug(slug: string): Promise<ProductWithRelations | null>
// getAllProducts(): Promise<Product[]>
// createProduct(data: Partial<Product>): Promise<Product>
// updateProduct(id: string, data: Partial<Product>): Promise<Product>
// deleteProduct(id: string): Promise<void>
// toggleProductActive(id: string, isActive: boolean): Promise<void>
// upsertInstructions(productId: string, instructions: Partial<Instruction>[]): Promise<void>
// upsertKitContents(productId: string, items: Partial<KitContent>[]): Promise<void>
// upsertSafetyItems(productId: string, items: Partial<SafetyItem>[]): Promise<void>
```

All functions must use try/catch and return typed results. Server-side functions use createServerSupabaseClient. Client-side functions use createClient.

---

## TAILWIND CONFIG (tailwind.config.ts)

Extend theme with all custom colors, add Bebas Neue and DM Sans to fontFamily. Define custom box-shadow values for cards. Add custom animation for the red rule expand effect.

---

## GLOBALS CSS (app/globals.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

/* Noise texture overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  z-index: 9999;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0A0A0A; }
::-webkit-scrollbar-thumb { background: #C8102E; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #e01535; }

html { scroll-behavior: smooth; }

body {
  background-color: #0A0A0A;
  color: #F5F5F0;
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.font-display { font-family: 'Bebas Neue', cursive; }

/* Red rule animation */
@keyframes expandRule {
  from { width: 0; }
  to { width: 100%; }
}

.animate-rule { animation: expandRule 0.8s ease-out forwards; }

/* Print styles */
@media print {
  .no-print { display: none !important; }
  body { background: white; color: black; }
}
```

---

## ROOT LAYOUT (app/layout.tsx)

- Dark background, DM Sans font class
- Proper metadata: title "Bosworth KK-FIX | Product Portal", description, viewport
- Include Framer Motion LazyMotion for performance

---

## ROOT PAGE (app/page.tsx)

Redirect to /products/kk-fix using Next.js redirect().

---

## ============================================
## PUBLIC PRODUCT PAGE — THIS IS THE PRIORITY
## ============================================

### app/products/[slug]/page.tsx

This is a Server Component. Fetch product by slug from Supabase. If not found, return notFound(). Pass data to client components.

```typescript
// Metadata generation
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  return {
    title: `${product?.name} | Bosworth`,
    description: product?.tagline,
  }
}
```

### NAVBAR component (components/public/Navbar.tsx)

Fixed top, backdrop-blur, dark:
- Left: "BOSWORTH" in Bebas Neue, red color, letter-spacing wide + thin red vertical divider + product name in DM Sans
- Right: "SCAN TO LEARN" small badge with QR icon + if msds_url exists show "DOWNLOAD SDS" button
- Height: 64px
- Border bottom: 1px solid #383838
- Background: rgba(10,10,10,0.85) with backdrop-filter blur(12px)

### HERO component (components/public/ProductHero.tsx)

Full viewport height (min-h-screen), dark background with subtle radial gradient from red at top-right corner (rgba(200,16,46,0.06)).

Layout:
```
[Top area — 64px navbar spacer]

[Center content — vertically centered]
  Category badge: "REPAIR KITS" — small caps, red border, red text, letter-spacing
  
  Product name: "KK-FIX" in Bebas Neue
    - Size: clamp(96px, 18vw, 220px)
    - Color: #F5F5F0
    - Line height: 0.9
    - Letter spacing: 0.02em
  
  Red rule: 2px solid #C8102E, full width, animated expand on load
  
  Tagline: "Conveyor Belt & Rubber Lagging Repair Kit"
    - DM Sans 300 weight, 20px, #B0B0A8
  
  Badge row (horizontal flex, gap-3):
    "🔥 FIRE RETARDANT" | "☿ MERCURY FREE" | "✓ VERSION 2"
    Each: small pill, border 1px solid rgba(200,16,46,0.4), 
    background rgba(200,16,46,0.08), text #F5F5F0, font-size 11px uppercase tracking-widest
  
  Part number: "PART NO: BSW-KKF-500" — monospace style, #8A8A8A, small

[Bottom — scroll indicator]
  Animated chevron-down, pulses, disappears on scroll
```

Framer Motion entrance:
- Category badge: fade in, delay 0.1s
- Product name: slide up 30px + fade in, delay 0.2s
- Red rule: width 0 → 100%, delay 0.5s
- Tagline: fade in, delay 0.7s
- Badges: stagger 0.1s each, fade in from below, delay 0.9s

### VIDEO component (components/public/VideoEmbed.tsx)

Section with heading "HOW TO USE KK-FIX" in Bebas Neue.

If video_url exists:
- 16:9 aspect ratio iframe, YouTube embed, rounded corners, red glow on border

If no video_url:
- Elegant placeholder: dark card, 16:9, centered content
- Large play icon in red circle
- "Instructional Video" heading
- "Coming Soon" subtext
- Subtle animated pulse on the play icon

### KIT CONTENTS component (components/public/KitContents.tsx)

Section heading: "WHAT'S IN THE BOX" in Bebas Neue + item count badge.

Grid: 2 cols mobile, 4 cols desktop.

Each card:
- Background: #242424
- Border: 1px solid #383838
- Hover: border-color rgba(200,16,46,0.5), translateY(-2px), transition 200ms
- Top: numbered item index in Bebas Neue, red, 32px
- Item name: DM Sans 500 weight, white
- Description: DM Sans 300, #8A8A8A, small

Icons — map item names to lucide icons:
- Compound/Resin → FlaskConical
- Hardener → Zap
- Solvent/Cleaner → Droplets
- Fabric → Layers
- Gloves → Shield
- Spatula → Paintbrush
- Stirrer → RefreshCw
- Packaging → Package
- Default → Box

Animate cards in with stagger using Framer Motion whileInView.

### INSTRUCTIONS component (components/public/InstructionSteps.tsx)

Section heading: "STEP-BY-STEP INSTRUCTIONS" in Bebas Neue + "Follow all steps carefully" in DM Sans.

Each step — full width, relative positioning:

```
[Step container — position: relative, overflow: hidden]
  
  [Watermark number — position: absolute, right: -20px, top: -20px]
    Bebas Neue, 200px, rgba(200,16,46,0.06), pointer-events: none, select-none, z-index: 0
  
  [Content — position: relative, z-index: 1]
    Left: 4px solid #C8102E border
    Padding: 24px 32px
    Background: #1C1C1C
    
    Step label: "STEP 01" in Bebas Neue, 14px, red, letter-spacing wide
    Title: Bebas Neue, 36px, #F5F5F0
    Description: DM Sans 400, 16px, #B0B0A8, line-height 1.7
    
    [Warning block — if warning exists]
      Background: rgba(217,119,6,0.1)
      Border-left: 4px solid #D97706
      Padding: 12px 16px
      Icon: AlertTriangle (amber)
      Text: DM Sans, 14px, #D97706
```

Animate each step: fade in from left (x: -20px → 0), stagger 0.15s, trigger on scroll (whileInView, once: true).

### SAFETY PANEL component (components/public/SafetyPanel.tsx)

Section heading: "SAFETY INFORMATION" in Bebas Neue.

Two sub-sections side by side on desktop, stacked on mobile:

Left column — "HAZARDS & WARNINGS":
- Cards with red/amber tints

Right column — "PPE REQUIRED & DISPOSAL":
- Cards with blue/green tints

Type → color mapping:
- hazard: bg rgba(200,16,46,0.08), border rgba(200,16,46,0.3), icon red
- ppe: bg rgba(26,58,92,0.5), border rgba(59,130,246,0.3), icon blue
- warning: bg rgba(217,119,6,0.08), border rgba(217,119,6,0.3), icon amber
- disposal: bg rgba(22,163,74,0.08), border rgba(22,163,74,0.3), icon green

Each card: icon (large, 32px) + label (DM Sans 500) + description (DM Sans 300, small, muted).

GHS symbol emojis as fallback icons:
- hazard → ⚠️ or use lucide Flame/AlertOctagon/Skull
- ppe → 🥽 or use lucide ShieldCheck/Eye/Wind
- warning → ⚠️ or use lucide AlertTriangle
- disposal → ♻️ or use lucide Trash2

Also add a "FIRST AID" sub-section at bottom:
4 quick cards: Skin | Eyes | Inhalation | Ingestion — each with icon + brief action.

### MSDS DOWNLOAD component (components/public/MSDSDownload.tsx)

Full-width dark panel with red gradient border (1px, gradient from red to transparent).

Left: Document icon + "MATERIAL SAFETY DATA SHEET" heading + "Version 2 — Mercury Free — November 2025" subtitle + "Prepared by A. Pieterse | Approved by L. van der Vyver" in small muted text.

Right: Large red "DOWNLOAD SDS" button with download icon. If no msds_url, show "Contact Bosworth for SDS document" with email link.

### FOOTER component (components/public/ProductFooter.tsx)

Dark, minimal:

Top row: "BOSWORTH" in Bebas Neue large + red rule + "Since 1943"

Middle grid (3 cols):
- Column 1: Address (21 Vereeniging Rd, Alrode, South Africa)
- Column 2: Contact (pulleys@bosworth.co.za | +27 11 864 1643)
- Column 3: Certifications (ISO 9001:2015 | ISO 14001:2015 | ISO 45001:2015 | Member: CMA of South Africa)

Bottom: "© 2025 Bosworth — A Division of Hudaco Trading Ltd. All rights reserved." | "Part of the Hudaco Group"

---

## ADMIN PANEL

### app/admin/layout.tsx

Dark sidebar layout. Two-column: sidebar (fixed, 260px wide) + main content area.

Sidebar (components/admin/AdminSidebar.tsx):
- Background: #0A0A0A
- Border-right: 1px solid #383838
- Top: Bosworth logo area — "BOSWORTH" in Bebas Neue red + "ADMIN PORTAL" in DM Sans small caps silver
- Red divider line
- Nav links with lucide icons:
  - LayoutDashboard → /admin/products (label: Dashboard)
  - Package → /admin/products (label: Products)
  - PlusCircle → /admin/products/new (label: Add Product)
  - QrCode → /admin/qr (label: QR Generator)
- Active state: red left border + red text + red background tint
- Bottom: user email display + LogOut button
- Hover: background #1C1C1C

Main content area:
- Background: #0F0F0F
- Padding: 32px
- Overflow: auto

### app/admin/login/page.tsx

Centered layout, full screen, dark background.

Card (max-width 400px, centered):
- "BOSWORTH" in Bebas Neue, large, red — centered
- "Admin Portal" subtitle
- Red divider
- Email input + Password input — dark styled inputs, red focus ring
- "Sign In" button — full width, red background
- Error state with AlertCircle icon
- Loading state with spinner
- Uses Supabase signInWithPassword
- On success: router.push('/admin/products')

Input style: background #1C1C1C, border 1px solid #383838, focus:border-red, text white, padding 12px 16px, rounded 6px.

### app/admin/products/page.tsx

Header: "PRODUCTS" in Bebas Neue + product count badge + "Add New Product" red button.

Table:
- Background #1C1C1C
- Header row: #242424, DM Sans 500, uppercase, small, silver
- Columns: Name | Part No | Category | Status | Created | Actions
- Row hover: background #242424
- Status badge: Active = green pill | Inactive = gray pill
- Actions: Edit (pencil icon, blue) | QR (QR icon, purple) | Toggle (eye icon) | Delete (trash, red with confirm)
- Empty state: large QR code icon, "No products yet", "Add your first product" link

### app/admin/products/new/page.tsx AND app/admin/products/[id]/page.tsx

Use same ProductForm component (components/admin/ProductForm.tsx).

Tab-based form with 4 tabs. Tab indicator: red underline on active tab.

Tab 1 — BASIC INFO:
Fields: Name*, Slug* (auto-gen from name, editable), Part Number, Category (select), Tagline, Description (textarea, 4 rows), Image URL, Video URL (hint: YouTube embed URL), MSDS PDF URL, Active (toggle switch — red when on).

Slug auto-generation: lowercase, replace spaces with hyphens, remove special chars. Show live preview: "This product will be available at /products/{slug}"

Tab 2 — KIT CONTENTS (components/admin/KitContentsEditor.tsx):
Dynamic list. "Add Item" button at bottom.
Each row: drag handle (GripVertical icon) | Item Name input | Description input | Quantity input | Delete button (X).
Simple up/down arrow reorder. Items numbered automatically.

Tab 3 — INSTRUCTIONS (components/admin/InstructionsEditor.tsx):
Dynamic numbered steps. "Add Step" button.
Each step card:
- Step number (auto, shown as badge)
- Title input (full width)
- Description textarea (3 rows)
- Warning textarea (2 rows, amber-tinted when has content)
- Delete step button
- Drag/reorder with up/down arrows.

Tab 4 — SAFETY INFO (components/admin/SafetyEditor.tsx):
Dynamic list. "Add Safety Item" button.
Each row:
- Type select (hazard/ppe/warning/disposal) — color coded
- Icon input (text, e.g. "flame" or "shield")
- Label input
- Description input
- Delete button

Form actions (bottom, sticky):
- Cancel button (ghost)
- Save button (red, full width on mobile)
- Show success toast on save
- Show error toast on failure

### app/admin/qr/page.tsx (components/admin/QRGenerator.tsx)

This page must be exceptional. It's what Bosworth staff use to print QR codes for physical labels.

Layout: two-column on desktop (settings left, preview right).

LEFT COLUMN — Settings:
- "QR CODE GENERATOR" heading in Bebas Neue
- Product selector: styled select or searchable dropdown showing all active products
- Base URL input: pre-filled with NEXT_PUBLIC_BASE_URL + "/products/"
- Full URL preview: shows complete URL that QR will encode (read-only, monospace, dark)
- QR Options section:
  - Error correction: L / M / Q / H (radio buttons, default H for industrial use)
  - Margin: 1-4 (slider)
  - Foreground color: color picker (default #F5F5F0)
  - Background color: color picker (default #0A0A0A)
- Download buttons (stacked):
  - "DOWNLOAD PNG (300px)" — digital use
  - "DOWNLOAD PNG (1000px)" — high-res print
  - "DOWNLOAD SVG" — vector for professional printing
- Print Label button: opens print-specific view

BATCH SECTION:
- "BATCH EXPORT" sub-heading
- "Generate QR codes for ALL active products" description
- "DOWNLOAD ALL AS ZIP" button — uses jszip to create zip with all QRs named {slug}-qr.png

RIGHT COLUMN — Live Preview:
- Large centered QR code preview (updates in real-time as any setting changes)
- Dark card with subtle red corner bracket decoration (CSS only — use ::before ::after with border-left + border-top on corners)
- Below QR: product name + part number + URL encoded
- "SCAN TO VIEW PRODUCT" text below

PRINT LAYOUT (separate CSS class, shown only when printing):
- 85mm × 54mm business card dimensions
- White background
- QR code (large, centered)
- "BOSWORTH" logo text above
- Product name below
- Part number small below that
- URL tiny at very bottom
- @media print { .print-layout { display: block; } .no-print { display: none; } }

---

## SEED SCRIPT (scripts/seed.ts)

Run: `npx tsx scripts/seed.ts`

Full implementation — inserts all data below. Idempotent (checks slug before insert). Uses service role key. Color-coded console output.

```
PRODUCT:
name: "KK-FIX"
slug: "kk-fix"
part_number: "BSW-KKF-500"
tagline: "Conveyor Belt & Rubber Lagging Repair Kit"
description: "The Bosworth KK-FIX is a fire-retardant, mercury-free polyurethane repair system engineered for conveyor belts and pulley lagging in the harshest mining and industrial environments. Tough in all environments — heat, moisture and chemical resistant. Version 2 formulation is fully mercury-free and certified for mining use."
category: "Repair Kits"
is_active: true

KIT CONTENTS (8 items):
1. KK-Fix Polyether Compound | Flexible, strong, chemical-resistant polyurethane resin | Part A
2. Hardener | Fast-reacting activator for durable cure | Part B
3. Cleaning Solvent | Removes oils, grease and contaminants from repair surface | 1 sachet
4. Reinforcing Fabric | Adds tensile strength to the completed repair | 1 piece
5. Protective Gloves | Chemical-resistant gloves for safe handling | 1 pair
6. Spatula | For mixing and applying compound | 1 unit
7. Stirrer | For thorough mixing of Part A and Part B | 1 unit
8. Ready-to-Use Packaging | Complete kit in sealed packaging | —

INSTRUCTIONS (8 steps):
1. CLEAN THE SURFACE
   Inspect the damaged area thoroughly. Using the included Cleaning Solvent and a clean lint-free cloth, remove all oil, grease, dust, rust, and surface contaminants from the repair zone and surrounding area. The surface must be completely clean and dry before proceeding. Any contamination will compromise adhesion.
   WARNING: Use in a well-ventilated area when applying cleaning solvent. Avoid prolonged skin contact.

2. PREPARE THE AREA
   Using a grinder, file, or wire brush, roughen the entire damaged area to create a mechanical key for adhesion. Remove all loose rubber, frayed edges, and debris. Feather the edges of the damage where possible. The prepared zone should extend at least 20–30mm beyond the visible damage on all sides.
   WARNING: Wear eye protection during grinding. Ensure belt is locked out / tagged out before working.

3. CUT THE REINFORCING FABRIC
   Measure and cut the included reinforcing fabric so that it covers the entire repair area with an overlap of at least 20mm beyond the prepared zone on all sides. A slightly oversized piece is better than too small. Set aside for later use.

4. MIX THE COMPOUND
   Open Part A (KK-Fix Polyether Compound) and Part B (Hardener). Combine both components into a clean container and mix vigorously using the included stirrer for a minimum of 2 full minutes until the mixture is completely uniform in colour and consistency, with no streaks. Work quickly — pot life is approximately 5–8 minutes at 25°C. Higher temperatures shorten pot life.
   WARNING: Wear gloves. Avoid skin and eye contact. Do not inhale vapours. Mix in a ventilated area.

5. APPLY FIRST COAT
   Using the spatula, apply a generous and even first coat of the mixed compound to the entire prepared surface. Work the compound into any voids, cracks, or recesses. Ensure complete coverage with no dry spots, bubbles, or air pockets. The layer should be approximately 2–3mm thick.

6. EMBED THE REINFORCING FABRIC
   Immediately press the reinforcing fabric onto the wet first coat, centring it over the damage. Using the spatula or your gloved fingers, smooth the fabric firmly from the centre outward, pressing out all air bubbles and ensuring full contact with the compound below. The fabric must be fully wetted by the compound.

7. APPLY FINISHING COAT
   Apply a second, generous coat of compound over the top of the embedded fabric. Ensure the fabric is completely encapsulated with no exposed edges or fibres. Feather and blend the edges of the repair smoothly into the surrounding belt surface using the spatula. The surface should be as flush and smooth as possible.
   WARNING: Do not touch, flex, or disturb the repair during the curing period.

8. CURE AND RETURN TO SERVICE
   Allow a minimum of 10 minutes for touch-dry and 30–45 minutes for full structural cure at ambient temperature (20–25°C). Cold conditions will extend cure time. Do not operate the conveyor belt or apply any load to the repair until fully cured. Inspect the completed repair — it should be firmly bonded, smooth, and flush with the belt surface. If any edges are lifting, apply additional compound and allow to re-cure.

SAFETY ITEMS (8 items):
hazard | flame | Flammable | Keep away from heat sources and open flame. Store below 30°C in a cool, dry place.
hazard | alert-octagon | Health Hazard | May cause mild skin and eye irritation with prolonged or repeated contact. Avoid unnecessary exposure.
hazard | leaf | Environmental Hazard | Toxic to aquatic organisms with potential for long-term adverse effects. Do not allow to enter drains, watercourses, or soil.
ppe | shield | Protective Gloves | Wear chemical-resistant gloves (nitrile or neoprene) at all times during mixing and application.
ppe | eye | Eye Protection | Wear safety glasses or chemical splash goggles during preparation, mixing, and application.
ppe | wind | Ventilation Required | Use only in well-ventilated areas or wear appropriate respiratory protection if working in confined spaces.
disposal | trash-2 | Hazardous Waste Disposal | Dispose of used containers and uncured material as hazardous waste in strict accordance with local environmental regulations.
warning | alert-triangle | Keep Away From Food | Keep product away from food, beverages, and animal feed at all times. Wash hands thoroughly after use.
```

---

## PACKAGE.JSON

```json
{
  "name": "bosworth-kkfix-portal",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed": "npx tsx scripts/seed.ts"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "@supabase/supabase-js": "^2.43.0",
    "@supabase/ssr": "^0.3.0",
    "framer-motion": "^11.2.0",
    "qrcode": "^1.5.3",
    "jszip": "^3.10.1",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/qrcode": "^1.5.5",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "tsx": "^4.15.0",
    "eslint": "^8",
    "eslint-config-next": "14.2.0"
  }
}
```

---

## NETLIFY CONFIG

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## ENV FILES

**.env.local.example**:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app
```

**Also create .gitignore** that includes:
```
.env.local
.env
node_modules/
.next/
out/
```

---

## README.md

Generate a comprehensive README with these exact sections:
1. Project Overview (what this is, who it's for)
2. Prerequisites (Node 20, Supabase account, Netlify account)
3. Supabase Setup (step by step — create project, run SQL, get keys)
4. Local Development Setup (clone, install, env vars, npm run dev)
5. Database Seeding (npx tsx scripts/seed.ts)
6. Netlify Deployment (connect repo, env vars in Netlify dashboard, deploy)
7. Creating Your First Admin User (Supabase dashboard → Auth → Add user)
8. Admin Panel Guide (login, add products, manage instructions, generate QR)
9. Printing QR Codes (recommended sizes, paper types, placement on packaging)
10. Adding New Products (step by step with screenshots placeholder)
11. Tech Stack (table format)
12. Project Structure (file tree)
13. Support (pulleys@bosworth.co.za)

---

## FINAL BUILD INSTRUCTIONS

Build in this exact order. Do not skip steps. Do not write placeholder comments.

1. Create package.json → run npm install
2. Create tsconfig.json (strict mode)
3. Create tailwind.config.ts + postcss.config.js
4. Create app/globals.css
5. Create lib/types.ts
6. Create lib/supabase.ts + lib/supabase-server.ts
7. Create lib/products.ts
8. Create lib/utils.ts (cn helper using clsx + tailwind-merge)
9. Create middleware.ts
10. Create app/layout.tsx
11. Create app/page.tsx

--- PUBLIC PRODUCT PAGE (HIGHEST PRIORITY) ---
12. Create components/public/Navbar.tsx
13. Create components/public/ProductHero.tsx
14. Create components/public/VideoEmbed.tsx
15. Create components/public/KitContents.tsx
16. Create components/public/InstructionSteps.tsx
17. Create components/public/SafetyPanel.tsx
18. Create components/public/MSDSDownload.tsx
19. Create components/public/ProductFooter.tsx
20. Create app/products/[slug]/page.tsx (assembles all public components)

--- ADMIN PANEL ---
21. Create components/admin/AdminSidebar.tsx
22. Create app/admin/layout.tsx
23. Create app/admin/login/page.tsx
24. Create app/admin/page.tsx (redirect)
25. Create app/admin/products/page.tsx
26. Create components/admin/KitContentsEditor.tsx
27. Create components/admin/InstructionsEditor.tsx
28. Create components/admin/SafetyEditor.tsx
29. Create components/admin/ProductForm.tsx
30. Create app/admin/products/new/page.tsx
31. Create app/admin/products/[id]/page.tsx
32. Create components/admin/QRGenerator.tsx
33. Create app/admin/qr/page.tsx

--- SCRIPTS & CONFIG ---
34. Create scripts/seed.ts
35. Create netlify.toml
36. Create .env.local.example
37. Create .gitignore
38. Create README.md

---

## ABSOLUTE REQUIREMENTS

- Zero TypeScript errors. Strict mode on.
- Zero `any` types. All interfaces in lib/types.ts.
- Every async operation has loading state.
- Every list has empty state.
- Every form has validation and error display.
- Every Supabase call has try/catch.
- Mobile responsive at 375px, 768px, 1280px, 1440px.
- All admin routes protected. Unauthenticated → /admin/login.
- QR PNG (300px and 1000px) and SVG download fully working.
- Seed script fully working and idempotent.
- No TODO comments. No placeholder functions. Everything implemented.
- The public product page must be genuinely stunning. Use Framer Motion. Use the watermark step numbers. Use the red rule animation. Make it feel like a premium product.

This is a real production deployment for a major South African industrial client. Treat it accordingly.
