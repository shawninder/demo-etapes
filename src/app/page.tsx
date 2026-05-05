import rivers from "./[slug]/features/";

export default function Home() {
  return (
    <div>
      <main>
        <ul className='list-disc'>
          {Object.keys(rivers).map((slug) => (
            <li key={slug}>
              <a
                href={`/${slug}`}
              >
                {slug}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
