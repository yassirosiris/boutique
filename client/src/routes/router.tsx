import { createBrowserRouter } from "react-router-dom";
import { http } from "../api/http";
import { MainLayout } from "../layouts/MainLayout";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { CartPage } from "../pages/CartPage";
import { CatalogPage } from "../pages/CatalogPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { OrdersPage } from "../pages/OrdersPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { RegisterPage } from "../pages/RegisterPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <CatalogPage /> },
      {
        path: "/products/:id",
        element: <ProductDetailPage />,
        loader: async ({ params }) => {
          const { data } = await http.get(`/products/${params.id}`);
          return data;
        }
      },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/admin", element: <AdminDashboardPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> }
    ]
  }
]);
