import Link from "next/link";
import rivers from "@/data/rivers/";
import { Item, ItemGroup, ItemSeparator } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <>
      <h1 className="text-foreground mt-16 mb-4 w-full text-center text-2xl leading-10 font-semibold tracking-tight">
        <span className="bg-level-active-bg text-level-active-text inline-block px-2">
          Preuve de Concept:
        </span>{" "}
        Étapes
      </h1>
      <div className="mb-8 text-lg italic">
        Un outil aidant au dénombrement des jours en rivière.
      </div>
      <div className="xs:flex-row flex flex-col items-center justify-between">
        <div>
          <p className="my-4 text-lg">
            Choisis tes dodos et obtient un sommaire pour chaque journée, avec:
          </p>
          <ul className="list-disc pl-6">
            <li>Distance totale parcourue</li>
            <li>Résumé des rapides et portages</li>
            <li>
              Beaucoup plus dans le future
              <br />(
              <Link
                target="_blank"
                href="https://docs.google.com/forms/d/e/1FAIpQLScOsLgjGb0QD1r621ZM4k7vkjsRDu8dpeFQcJyX77DF72s1tw/viewform?usp=publish-editor"
                className="text-level-fun-text hover:text-level-active-text"
              >
                envoie nous tes idées
              </Link>
              !)
            </li>
          </ul>
        </div>
        <div>
          <img
            src="/screenshot-light.png"
            alt="Aperçu de l'application, montrant les journées calculées à partir des dodos cochés"
            className="mx-auto my-4 max-w-full rounded border dark:hidden"
          />
          <img
            src="/screenshot-dark.png"
            alt="Aperçu de l'application, montrant les journées calculées à partir des dodos cochés"
            className="mx-auto my-4 hidden max-w-full rounded border dark:block"
          />
        </div>
      </div>

      <p className="my-4 text-lg">
        Pour essayer, choisis une rivière ci-dessous:
      </p>

      <ItemGroup className="capitalize">
        {Object.keys(rivers).map((slug) => (
          <Link key={slug} href={`/${slug}`} className="w-full">
            <Item
              variant="muted"
              className="bg-level-neutral-bg border-level-neutral-border text-level-neutral-text hover:bg-level-helpful-bg hover:border-level-helpful-border hover:text-level-helpful-text 2xs:text-2xl"
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
            variant="outline"
            size="lg"
            className="hover:text-level-helpful-text 2xs:pt-8 2xs:pb-4 flex h-fit w-full cursor-pointer flex-col py-2 whitespace-normal"
          >
            <PlusCircle className="size-5" />
            Demander une autre rivière
          </Button>
        </Link>
      </ItemGroup>
      <p className="mt-8 text-center text-lg">
        <br />
        Questions, commentaires, idées…
        <br />↓
      </p>
    </>
  );
}
