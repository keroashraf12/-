import express from 'express';
import SalesInvoice from '../models/SalesInvoice.js';
import PurchaseInvoice from '../models/PurchaseInvoice.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalSales,
      totalPurchases,
      todaySales,
      todayPurchases,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      totalSuppliers,
      unpaidSalesInvoices,
      unpaidPurchaseInvoices
    ] = await Promise.all([
      SalesInvoice.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      PurchaseInvoice.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      SalesInvoice.aggregate([
        { $match: { date: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      PurchaseInvoice.aggregate([
        { $match: { date: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Product.countDocuments(),
      Product.countDocuments({
        $expr: { $lte: ['$quantity', '$minQuantity'] }
      }),
      Customer.countDocuments(),
      Supplier.countDocuments(),
      SalesInvoice.aggregate([
        { $match: { status: { $ne: 'مدفوع' } } },
        { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
      ]),
      PurchaseInvoice.aggregate([
        { $match: { status: { $ne: 'مدفوع' } } },
        { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
      ])
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalPurchases: totalPurchases[0]?.total || 0,
      todaySales: todaySales[0]?.total || 0,
      todayPurchases: todayPurchases[0]?.total || 0,
      profit: (totalSales[0]?.total || 0) - (totalPurchases[0]?.total || 0),
      totalProducts,
      lowStockProducts,
      totalCustomers,
      totalSuppliers,
      unpaidSalesAmount: unpaidSalesInvoices[0]?.total || 0,
      unpaidPurchaseAmount: unpaidPurchaseInvoices[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent activities
router.get('/recent-activities', async (req, res) => {
  try {
    const [recentSales, recentPurchases, recentPayments] = await Promise.all([
      SalesInvoice.find()
        .populate('customer', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      PurchaseInvoice.find()
        .populate('supplier', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Payment.find()
        .populate('relatedTo')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      recentSales,
      recentPurchases,
      recentPayments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
