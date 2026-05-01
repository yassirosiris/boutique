import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { http } from "../api/http";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
}

export const CatalogPage = () => {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    http
      .get("/products", { params: Object.fromEntries(params.entries()) })
      .then((res) => setProducts(res.data.products ?? []))
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="rounded-xl border bg-white p-4">
        <h3 className="font-semibold">Filtres</h3>
        <select
          className="mt-3 w-full rounded border p-2"
          value={params.get("category") ?? ""}
          onChange={(e) => setParams({ ...Object.fromEntries(params.entries()), category: e.target.value })}
        >
          <option value="">Toutes categories</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="enfant">Enfant</option>
        </select>
      </aside>
      <section>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-48 animate-pulse rounded bg-gray-200" />)}</div>
        ) : products.length === 0 ? (
          <p>Aucun produit trouve.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="rounded-xl border bg-white p-3">
                <img src={product.images[0]} alt={product.name} className="h-40 w-full rounded object-cover" />
                <h4 className="mt-2 font-medium">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="font-semibold">{product.price} DT</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
