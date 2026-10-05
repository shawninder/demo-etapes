import type { Metadata } from "next";
import Link from "next/link";
import { Map, MoveLeft, WavesHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
        <nav className="mb-4 flex flex-wrap justify-center gap-2">
          {river.gaugeUrl ? (
            <Link
              target="_blank"
              href={river.gaugeUrl}
              aria-label="Niveau d'eau"
              title="Niveau d'eau"
              className={buttonVariants({ variant: "outline", size: "icon-lg" })}
            >
              <WavesHorizontal />
            </Link>
          ) : null}
          {river.mapUrls.map((url, i) => {
            const label = `Carte-guide${river.mapUrls.length > 1 ? ` ${i + 1}` : ""}`;
            return (
              <Link
                key={url}
                target="_blank"
                href={url}
                aria-label={label}
                title={label}
                className={buttonVariants({ variant: "outline", size: "icon-lg" })}
              >
                <Map />
              </Link>
            );
          })}
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
