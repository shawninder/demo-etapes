import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import River from "@/components/River";
import riverFeatures from "../../data/rivers";

type RiverPageProps = {
  slug: string;
};

export default async function RiverPage({
  params,
}: {
  params: Promise<RiverPageProps>;
}) {
  const { slug } = await params;
  const features = riverFeatures[slug].map(({ ...keys }) => ({
    ...keys,
    id: crypto.randomUUID(),
  }));

  return (
    <>
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-foreground capitalize text-center w-full my-16">
        <Link href="/" className="hover:text-level-neutral-text">
          Rivière {slug} <ChevronDown className="inline" />
        </Link>
      </h1>
      <River features={features} />
    </>
  );
}

export function generateStaticParams() {
  return [{ slug: "broadback" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RiverPageProps>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Rivière ${slug[0].toUpperCase()}${slug.slice(1)}`,
  };
}
