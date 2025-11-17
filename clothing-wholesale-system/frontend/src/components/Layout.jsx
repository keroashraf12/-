import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '📊 لوحة التحكم', icon: '📊' },
    { path: '/suppliers', label: '🏭 الموردين', icon: '🏭' },
    { path: '/customers', label: '👥 العملاء', icon: '👥' },
    { path: '/products', label: '👕 المنتجات', icon: '👕' },
    { path: '/purchase-invoices', label: '📥 فواتير الشراء', icon: '📥' },
    { path: '/sales-invoices', label: '📤 فواتير البيع', icon: '📤' },
    { path: '/payments', label: '💰 الدفعات', icon: '💰' }
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>👔 معرض الملابس</h1>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
