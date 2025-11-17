import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Suppliers
export const getSuppliers = () => api.get('/suppliers');
export const getSupplier = (id) => api.get(`/suppliers/${id}`);
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);

// Customers
export const getCustomers = () => api.get('/customers');
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getLowStockProducts = () => api.get('/products/low-stock');

// Purchase Invoices
export const getPurchaseInvoices = () => api.get('/purchase-invoices');
export const getPurchaseInvoice = (id) => api.get(`/purchase-invoices/${id}`);
export const createPurchaseInvoice = (data) => api.post('/purchase-invoices', data);
export const updatePurchaseInvoice = (id, data) => api.put(`/purchase-invoices/${id}`, data);
export const deletePurchaseInvoice = (id) => api.delete(`/purchase-invoices/${id}`);

// Sales Invoices
export const getSalesInvoices = () => api.get('/sales-invoices');
export const getSalesInvoice = (id) => api.get(`/sales-invoices/${id}`);
export const createSalesInvoice = (data) => api.post('/sales-invoices', data);
export const updateSalesInvoice = (id, data) => api.put(`/sales-invoices/${id}`, data);
export const deleteSalesInvoice = (id) => api.delete(`/sales-invoices/${id}`);

// Payments
export const getPayments = () => api.get('/payments');
export const getPaymentsByType = (type) => api.get(`/payments/type/${type}`);
export const createPayment = (data) => api.post('/payments', data);
export const deletePayment = (id) => api.delete(`/payments/${id}`);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRecentActivities = () => api.get('/dashboard/recent-activities');

export default api;
