import Link from "next/link";
import rivers from "@/data/rivers/";
import { Item, ItemGroup } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <>
      <h1 className="text-foreground my-16 w-full text-center text-2xl leading-10 font-semibold tracking-tight">
        rivières
      </h1>
      <ItemGroup className="capitalize">
        {Object.keys(rivers).map((slug) => (
          <Link key={slug} href={`/${slug}`} className="w-full">
            <Item
              variant="muted"
              className="hover:bg-level-neutral-bg hover:border-level-neutral-border hover:text-level-neutral-text 2xs:text-2xl"
            >
              {slug}
            </Item>
          </Link>
        ))}
        <Link
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSehHnLfEFqB4ANk8DUzP0hUmhn4uB1yTEa5eaQ71puT7r2bqQ/viewform?usp=publish-editor"
          title="Demander une autre rivière"
        >
          <Button
            variant="ghost"
            size="lg"
            className="hover:text-level-helpful-text 2xs:py-8 h-fit w-full cursor-pointer py-2 whitespace-normal"
          >
            <PlusCircle className="size-5" />
          </Button>
        </Link>
      </ItemGroup>
    </>
  );
}
