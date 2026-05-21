import Image from 'next/image'

export default function HeroImage() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        marginTop: '64px', // clear fixed navbar
        height: 'clamp(280px, 38vw, 560px)',
        overflow: 'hidden',
      }}>
      <Image
        src="/images/hero.png"
        alt="KK-Fix Conveyor Belt Repair"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
    </div>
  )
}
