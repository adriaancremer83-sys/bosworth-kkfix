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
  image_url: string | null
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
