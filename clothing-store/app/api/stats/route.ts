import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalSuppliers,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      totalPurchases,
      totalSales,
      pendingPurchases,
      pendingSales,
      purchases,
      sales,
    ] = await Promise.all([
      prisma.supplier.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.product.count({ where: { quantity: { lte: prisma.product.fields.minQuantity } } }),
      prisma.purchase.count(),
      prisma.sale.count(),
      prisma.purchase.count({ where: { status: "pending" } }),
      prisma.sale.count({ where: { status: "pending" } }),
      prisma.purchase.findMany({ select: { totalAmount: true } }),
      prisma.sale.findMany({ select: { totalAmount: true } }),
    ]);

    const totalExpenses = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

    return NextResponse.json({
      totalSuppliers,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      totalPurchases,
      totalSales,
      pendingPurchases,
      pendingSales,
      totalRevenue,
      totalExpenses,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
