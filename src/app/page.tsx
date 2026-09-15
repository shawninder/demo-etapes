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
      <ItemGroup>
        {Object.keys(rivers).map((slug) => (
          <Link key={slug} href={`/${slug}`} className="w-full">
            <Item
              variant="muted"
              className="hover:bg-level-neutral-bg hover:border-level-neutral-border hover:text-level-neutral-text capitalize"
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
            className="my-16 h-fit w-full cursor-pointer py-8 whitespace-normal"
          >
            <PlusCircle className="4xs:inline hidden" />
            Demander une autre rivière
          </Button>
        </Link>
      </ItemGroup>
    </>
  );
}
