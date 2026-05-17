import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug } from '@/lib/products-server'
import Navbar from '@/components/public/Navbar'
import ProductHero from '@/components/public/ProductHero'
import VideoEmbed from '@/components/public/VideoEmbed'
import KitContents from '@/components/public/KitContents'
import InstructionSteps from '@/components/public/InstructionSteps'
import SafetyPanel from '@/components/public/SafetyPanel'
import MSDSDownload from '@/components/public/MSDSDownload'
import ProductFooter from '@/components/public/ProductFooter'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  return {
    title: `${product?.name ?? 'Product'} | Bosworth`,
    description: product?.tagline ?? undefined,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) notFound()

  return (
    <main>
      <Navbar productName={product.name} msdsUrl={product.msds_url} />
      <ProductHero product={product} />
      <VideoEmbed videoUrl={product.video_url} />
      <KitContents items={product.kit_contents} />
      <InstructionSteps instructions={product.instructions} />
      <SafetyPanel items={product.safety_items} />
      <MSDSDownload msdsUrl={product.msds_url} />
      <ProductFooter />
    </main>
  )
}
