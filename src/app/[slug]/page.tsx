import type { Metadata } from "next";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import River from "@/components/River";
import rivers from "@/data/rivers";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";

type RiverPageProps = {
  slug: string;
};

export default async function RiverPage({
  params,
}: {
  params: Promise<RiverPageProps>;
}) {
  const { slug } = await params;
  const river = rivers[slug];

  return (
    <>
      <h1 className="text-foreground my-2 w-full text-center leading-10 font-semibold tracking-tight capitalize 2xl:my-16">
        <Item>
          <ItemContent className="flex-row items-center justify-between">
            <Link href="/" className="hover:text-level-neutral-text">
              <MoveLeft />
            </Link>
            <div>
              <ItemTitle className="2xs:text-3xl">{river.name}</ItemTitle>
            </div>
          </ItemContent>
        </Item>
      </h1>
      {river.gaugeUrl || river.mapUrls.length > 0 ? (
        <nav className="mb-4 flex flex-wrap justify-center gap-4 text-sm">
          {river.gaugeUrl ? (
            <Link
              target="_blank"
              href={river.gaugeUrl}
              className="text-level-neutral-text hover:text-level-helpful-text"
            >
              Niveau d&apos;eau
            </Link>
          ) : null}
          {river.mapUrls.map((url, i) => (
            <Link
              key={url}
              target="_blank"
              href={url}
              className="text-level-neutral-text hover:text-level-helpful-text"
            >
              Carte-guide{river.mapUrls.length > 1 ? ` ${i + 1}` : ""}
            </Link>
          ))}
        </nav>
      ) : null}
      <River river={river} />
    </>
  );
}

export function generateStaticParams() {
  return Object.keys(rivers).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RiverPageProps>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Rivière ${rivers[slug].name}`,
  };
}
