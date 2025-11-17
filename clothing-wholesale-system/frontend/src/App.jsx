import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Products from './pages/Products';
import PurchaseInvoices from './pages/PurchaseInvoices';
import SalesInvoices from './pages/SalesInvoices';
import Payments from './pages/Payments';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/purchase-invoices" element={<PurchaseInvoices />} />
          <Route path="/sales-invoices" element={<SalesInvoices />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
