"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalSuppliers: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  totalPurchases: number;
  totalSales: number;
  pendingPurchases: number;
  pendingSales: number;
  totalRevenue: number;
  totalExpenses: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSuppliers: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalPurchases: 0,
    totalSales: 0,
    pendingPurchases: 0,
    pendingSales: 0,
    totalRevenue: 0,
    totalExpenses: 0,
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  const cards = [
    { title: "الموردين", value: stats.totalSuppliers, color: "bg-blue-500", link: "/suppliers" },
    { title: "العملاء", value: stats.totalCustomers, color: "bg-green-500", link: "/customers" },
    { title: "المنتجات", value: stats.totalProducts, color: "bg-purple-500", link: "/products" },
    { title: "منتجات قليلة المخزون", value: stats.lowStockProducts, color: "bg-red-500", link: "/products" },
    { title: "فواتير الشراء", value: stats.totalPurchases, color: "bg-orange-500", link: "/purchases" },
    { title: "فواتير البيع", value: stats.totalSales, color: "bg-teal-500", link: "/sales" },
    { title: "مشتريات معلقة", value: stats.pendingPurchases, color: "bg-yellow-500", link: "/purchases" },
    { title: "مبيعات معلقة", value: stats.pendingSales, color: "bg-pink-500", link: "/sales" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">نظام إدارة معرض الملابس</h1>
            <div className="flex gap-4">
              <Link href="/suppliers" className="text-gray-600 hover:text-gray-900 transition">الموردين</Link>
              <Link href="/customers" className="text-gray-600 hover:text-gray-900 transition">العملاء</Link>
              <Link href="/products" className="text-gray-600 hover:text-gray-900 transition">المنتجات</Link>
              <Link href="/purchases" className="text-gray-600 hover:text-gray-900 transition">المشتريات</Link>
              <Link href="/sales" className="text-gray-600 hover:text-gray-900 transition">المبيعات</Link>
              <Link href="/payments" className="text-gray-600 hover:text-gray-900 transition">الدفعات</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم</h2>
          <p className="text-gray-600">نظرة عامة على نشاط المعرض</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <Link key={index} href={card.link}>
              <div className={`${card.color} rounded-lg shadow-lg p-6 text-white hover:scale-105 transition-transform cursor-pointer`}>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-4xl font-bold">{card.value}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">الإيرادات والمصروفات</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-semibold">إجمالي الإيرادات</span>
                <span className="text-2xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <span className="text-gray-700 font-semibold">إجمالي المصروفات</span>
                <span className="text-2xl font-bold text-red-600">{stats.totalExpenses.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-semibold">صافي الربح</span>
                <span className="text-2xl font-bold text-blue-600">
                  {(stats.totalRevenue - stats.totalExpenses).toFixed(2)} ج.م
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">روابط سريعة</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/suppliers/new" className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-center font-semibold">
                إضافة مورد
              </Link>
              <Link href="/customers/new" className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center font-semibold">
                إضافة عميل
              </Link>
              <Link href="/products/new" className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-center font-semibold">
                إضافة منتج
              </Link>
              <Link href="/purchases/new" className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-center font-semibold">
                فاتورة شراء
              </Link>
              <Link href="/sales/new" className="p-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-center font-semibold">
                فاتورة بيع
              </Link>
              <Link href="/payments/new" className="p-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-center font-semibold">
                تسجيل دفعة
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
