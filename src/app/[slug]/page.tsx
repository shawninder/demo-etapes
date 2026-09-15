import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import River from "@/components/River";
import riverFeatures from "../../data/rivers";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";

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
      <h1 className="text-foreground my-2 w-full text-center leading-10 font-semibold tracking-tight capitalize 2xl:my-16">
        <Link
          href="/"
          className="hover:text-level-neutral-text 2xs:w-fit mx-auto block"
        >
          <Item>
            <ItemContent>
              <ItemTitle className="2xs:text-3xl">{slug}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronDown className="inline size-3 sm:size-6" />
            </ItemActions>
          </Item>
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
