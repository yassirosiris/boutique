import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { http } from "../api/http";

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, ordersCount: 0, activeProducts: 0, lowStockCount: 0 });
  useEffect(() => {
    http.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  const chartData = [
    { name: "Orders", value: stats.ordersCount },
    { name: "Low stock", value: stats.lowStockCount }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded border bg-white p-4">Revenue: {stats.totalRevenue}</div>
        <div className="rounded border bg-white p-4">Orders: {stats.ordersCount}</div>
        <div className="rounded border bg-white p-4">Products: {stats.activeProducts}</div>
        <div className="rounded border bg-white p-4">Low stock: {stats.lowStockCount}</div>
      </div>
      <div className="h-64 rounded border bg-white p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} fill="#e11d48" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
