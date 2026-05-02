import { useState } from "react";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

interface Variant {
  size: string;
  color: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants?: Variant[];
}

export const ProductDetailPage = () => {
  const product = useLoaderData() as Product;
  const [size, setSize] = useState(product.variants?.[0]?.size ?? "M");
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <img src={product.images?.[0]} alt={product.name} className="w-full rounded-xl border object-cover" />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-gray-600">{product.description}</p>
        <p className="mt-4 text-2xl font-semibold">{product.price} DT</p>
        <select className="mt-4 rounded border p-2" value={size} onChange={(e) => setSize(e.target.value)}>
          {product.variants?.map((v: Variant) => (
            <option key={`${v.size}-${v.color}`} value={v.size}>{v.size} - {v.color}</option>
          ))}
        </select>
        <button
          className="mt-4 rounded bg-primary px-4 py-2 text-white"
          onClick={() => {
            addItem({
              productId: product._id,
              name: product.name,
              image: product.images?.[0],
              price: product.price,
              size,
              color: "default",
              qty: 1
            });
            toast.success("Ajoute au panier");
          }}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};
