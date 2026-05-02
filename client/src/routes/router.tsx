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
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AdminRoute } from "../components/AdminRoute";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <MainLayout />, // base layout for the app
    children: [
      // Public routes
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      // Protected routes – require authentication
      {
        element: <ProtectedRoute />,
        children: [
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

          // Admin routes – require admin role
          {
            element: <AdminRoute />,
            children: [
              { path: "/admin", element: <AdminDashboardPage /> }
            ]
          }
        ]
      }
    ]
  }
]);
