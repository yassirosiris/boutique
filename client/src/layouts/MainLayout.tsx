import { Link, Outlet } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export const MainLayout = () => {
  const count = useCartStore((s) => s.items.reduce((acc, item) => acc + item.qty, 0));
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <Link to="/" className="text-xl font-bold text-primary">Boutique</Link>
          <div className="flex gap-4 text-sm">
            <Link to="/catalog">Catalogue</Link>
            <Link to="/orders">Mes commandes</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/cart">Panier ({count})</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl p-4">
        <Outlet />
      </main>
    </div>
  );
};
