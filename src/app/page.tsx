import Link from "next/link";
import { ChevronDown } from "lucide-react";
import rivers from "@/data/rivers/";
import { Item, ItemGroup } from "@/components/ui/item";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-foreground capitalize text-center w-full my-16">
        Rivière __________ <ChevronDown className="inline" />
      </h1>
      <ItemGroup>
        {Object.keys(rivers).map((slug) => (
          <Link key={slug} href={`/${slug}`} className="w-full">
            <Item
              variant="muted"
              className="text-xl capitalize hover:bg-level-neutral-bg hover:border-level-neutral-border hover:text-level-neutral-text"
            >
              {slug}
            </Item>
          </Link>
        ))}
        <Link
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSehHnLfEFqB4ANk8DUzP0hUmhn4uB1yTEa5eaQ71puT7r2bqQ/viewform?usp=publish-editor"
        >
          <Button
            size="lg"
            className="w-full cursor-pointer text-xl py-8 my-16"
          >
            Demander une autre rivière
          </Button>
        </Link>
      </ItemGroup>
    </>
  );
}
