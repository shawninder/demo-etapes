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
        <ItemSeparator />
      </ItemGroup>
      <p className="my-4 text-lg">
        J'ai plusieurs idées pour amélioré cet outil:
      </p>
      <ul className="list-disc pl-6">
        <li>
          Intégration avec la carte-guide pour analyser la rivière en
          choisissant ses dodos
        </li>
        <li>
          Intégration avec Google Maps (ou autre) pour intégrer les journées
          navettes à la réflexion.
        </li>
        <li>Dodos avec plan B, plan C…, pour rester flexible</li>
        <li>etc.</li>
      </ul>
      <p className="my-4 text-lg">
        Pour l'instant, par contre, le nerf de la guerre c'est d'ajouter des
        rivières!
      </p>
      <p className="my-4 text-lg">
        Il s'agit de regarder la carte-guide et produire un fichier avec tous
        les <i>features</i>, quelque chose comme:
      </p>
      <pre className="pl-7">
        {`km 410.0: GC
km 407.7: R1
km 407.4: R2`}
      </pre>
      <p className="my-4 text-lg">
        Pour la première rivière (Broadback), j'ai fait ça à la mitaine (
        <Link
          target="_blank"
          href="https://github.com/shawninder/demo-etapes/blob/main/src/data/rivers/broadback.ts"
          className="text-level-fun-text hover:text-level-active-text"
        >
          voir le fichier en question
        </Link>
        ).
      </p>
      <p className="my-4 text-lg">C'est long!</p>
      <p className="my-4 text-center text-lg">
        <span className="bg-level-active-bg text-level-active-text inline-block px-2">
          Appel à l'aide
        </span>
        <br />
        Des idées pour accélérer la production de ces fichiers? Je suis preneur!
        <br />↓
      </p>
    </>
  );
}
