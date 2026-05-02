import { Link } from "react-router-dom";


export const HomePage = () => (
  <>
  <div className="space-y-10">
    <section className="rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-white">
      <h1 className="text-3xl font-bold">Nouvelle collection</h1>
      <p className="mt-2 max-w-xl">Des pieces modernes pour homme, femme et enfant.</p>
      <Link to="/catalog" className="mt-4 inline-block rounded bg-white px-4 py-2 font-semibold text-black">
        Voir le catalogue
      </Link>
    </section>
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Categories</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {["homme", "femme", "enfant"].map((c) => (
          <Link key={c} to={`/catalog?category=${c}`} className="rounded-xl border bg-white p-6 capitalize">
            {c}
          </Link>
        ))}
      </div>
    </section>
  </div>
  </>
);
