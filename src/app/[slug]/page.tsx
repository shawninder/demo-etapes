import River from '@/components/River'
import riverFeatures from './features'

type RiverPageProps = {
  slug: string
}

export default async function RiverPage ({ params }: {
  params: Promise<RiverPageProps>
}) {
  const { slug } = await params
  const features = riverFeatures[slug]

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 capitalize">
          Rivière {slug}
        </h1>
        <River features={features} />
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return [
    { slug: 'broadback' }
  ]
}
