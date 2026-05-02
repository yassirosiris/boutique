interface Order {
  _id: string;
  orderStatus: string;
  total: number;
}

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    http.get<Order[]>("/orders/mine").then((res) => setOrders(res.data));
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
