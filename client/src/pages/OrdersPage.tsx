import { useEffect, useState } from "react";
import { http } from "../api/http";

export const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    http.get("/orders/mine").then((res) => setOrders(res.data));
  }, []);
  if (!orders.length) return <p>Aucune commande pour le moment.</p>;
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <article key={order._id} className="rounded border bg-white p-4">
          <p className="font-semibold">Commande #{order._id.slice(-6)}</p>
          <p>Statut: {order.orderStatus}</p>
          <p>Total: {order.total} DT</p>
        </article>
      ))}
    </div>
  );
};
