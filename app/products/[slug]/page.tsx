import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getProductBySlug } from '@/lib/products-server'
import Navbar from '@/components/public/Navbar'
import ProductHero from '@/components/public/ProductHero'
import VideoEmbed from '@/components/public/VideoEmbed'
import KitContents from '@/components/public/KitContents'
import InstructionSteps from '@/components/public/InstructionSteps'
import SafetyPanel from '@/components/public/SafetyPanel'
import TechSpecs from '@/components/public/TechSpecs'
import KitBuilder from '@/components/public/KitBuilder'
import MSDSDownload from '@/components/public/MSDSDownload'
import ProductFooter from '@/components/public/ProductFooter'
import QRScanTracker from '@/components/public/QRScanTracker'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  return {
    title: `${product?.name ?? 'KK-Fix'} | Bosworth`,
    description: product?.tagline ?? 'Professional Conveyor Belt Repair Kit',
  }
}

function ComingSoon() {
  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Suspense fallback={null}>
        <QRScanTracker productId={null} />
      </Suspense>
      <Navbar productName="KK-Fix" msdsUrl={null} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '3px', color: '#CC1F28', textTransform: 'uppercase', fontWeight: 600 }}>Bosworth</span>
        </div>
        <h1 style={{ fontSize: 'clamp(48px, 10vw, 96px)', fontWeight: 800, color: '#F5F5F0', lineHeight: 1, letterSpacing: '-2px', fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', marginBottom: '8px' }}>
          KK-FIX
        </h1>
        <p style={{ fontSize: '14px', color: '#8A8A8A', marginBottom: '48px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Conveyor Belt &amp; Rubber Lagging Repair Kit
        </p>
        <div style={{ width: '48px', height: '2px', background: '#CC1F28', marginBottom: '48px' }} />
        <p style={{ fontSize: '18px', color: '#F5F5F0', fontWeight: 500, marginBottom: '12px' }}>Content coming soon</p>
        <p style={{ fontSize: '14px', color: '#555', maxWidth: '400px' }}>
          Product details are being configured. Scan this code again shortly to view the full repair guide.
        </p>
      </div>
      <ProductFooter />
    </main>
  )
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)
  if (!product) return <ComingSoon />

  return (
    <main>
      {/* Suspense required because QRScanTracker uses useSearchParams */}
      <Suspense fallback={null}>
        <QRScanTracker productId={product.id} />
      </Suspense>
      <Navbar productName={product.name} msdsUrl={product.msds_url} />
      <ProductHero product={product} />
      <VideoEmbed videoUrl={product.video_url} />
      <KitContents items={product.kit_contents} />
      <InstructionSteps instructions={product.instructions} />
      <KitBuilder />
      <SafetyPanel items={product.safety_items} />
      <TechSpecs specs={product.tech_specs} />
      <MSDSDownload msdsUrl={product.msds_url} />
      <ProductFooter />
    </main>
  )
}
