import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import supplierRoutes from './routes/suppliers.js';
import customerRoutes from './routes/customers.js';
import productRoutes from './routes/products.js';
import purchaseInvoiceRoutes from './routes/purchaseInvoices.js';
import salesInvoiceRoutes from './routes/salesInvoices.js';
import paymentRoutes from './routes/payments.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing_wholesale')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchase-invoices', purchaseInvoiceRoutes);
app.use('/api/sales-invoices', salesInvoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Clothing Wholesale Management System API' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
