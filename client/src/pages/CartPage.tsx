import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export const CartPage = () => {
  const { items, removeItem, updateQty } = useCartStore();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  if (!items.length) return <p>Votre panier est vide.</p>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 rounded border bg-white p-4">
          <img src={item.image} alt={item.name} className="h-20 w-20 rounded object-cover" />
          <div className="flex-1">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">{item.size} - {item.color}</p>
            <input
              type="number"
              min={1}
              className="mt-2 w-20 rounded border p-1"
              value={item.qty}
              onChange={(e) => updateQty(item.productId, item.size, item.color, Number(e.target.value))}
            />
          </div>
          <button onClick={() => removeItem(item.productId, item.size, item.color)}>Supprimer</button>
        </div>
      ))}
      <div className="rounded border bg-white p-4">
        <p className="text-lg font-semibold">Sous-total: {subtotal} DT</p>
        <Link to="/checkout" className="mt-3 inline-block rounded bg-primary px-4 py-2 text-white">Commander</Link>
      </div>
    </div>
  );
};
