import { z } from "zod";
import toast from "react-hot-toast";
import { http } from "../api/http";
import { useCartStore } from "../store/cartStore";

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  street: z.string().min(3),
  city: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(3)
});

export const CheckoutPage = () => {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const result = schema.safeParse(payload);
    if (!result.success) return toast.error("Formulaire invalide");

    const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);
    const checkout = await http.post("/cart/checkout", { amount: Math.round(total * 100), currency: "eur" });
    await http.post("/orders", {
      items: items.map((item) => ({
        product: item.productId,
        variant: { size: item.size, color: item.color },
        qty: item.qty,
        price: item.price
      })),
      shippingAddress: result.data,
      total,
      stripePaymentId: checkout.data.paymentIntentId
    });
    clear();
    toast.success("Commande creee");
  };

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-3 rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      {["fullName", "phone", "street", "city", "country", "postalCode"].map((field) => (
        <input key={field} name={field} placeholder={field} className="rounded border p-2" />
      ))}
      <button className="rounded bg-primary px-4 py-2 text-white">Valider</button>
    </form>
  );
};
