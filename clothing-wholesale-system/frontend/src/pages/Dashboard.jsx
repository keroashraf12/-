import React, { useState, useEffect } from 'react';
import { getDashboardStats, getRecentActivities } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        getDashboardStats(),
        getRecentActivities()
      ]);
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>لوحة التحكم</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <h3>إجمالي المبيعات</h3>
          <div className="value">{stats?.totalSales?.toLocaleString()} ج.م</div>
        </div>
        <div className="stat-card red">
          <h3>إجمالي المشتريات</h3>
          <div className="value">{stats?.totalPurchases?.toLocaleString()} ج.م</div>
        </div>
        <div className="stat-card">
          <h3>صافي الربح</h3>
          <div className="value">{stats?.profit?.toLocaleString()} ج.م</div>
        </div>
        <div className="stat-card orange">
          <h3>مبيعات اليوم</h3>
          <div className="value">{stats?.todaySales?.toLocaleString()} ج.م</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>المنتجات</h3>
          <div className="value">{stats?.totalProducts}</div>
        </div>
        <div className="stat-card red">
          <h3>منتجات منخفضة المخزون</h3>
          <div className="value">{stats?.lowStockProducts}</div>
        </div>
        <div className="stat-card">
          <h3>العملاء</h3>
          <div className="value">{stats?.totalCustomers}</div>
        </div>
        <div className="stat-card">
          <h3>الموردين</h3>
          <div className="value">{stats?.totalSuppliers}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card orange">
          <h3>فواتير بيع غير مدفوعة</h3>
          <div className="value">{stats?.unpaidSalesAmount?.toLocaleString()} ج.م</div>
        </div>
        <div className="stat-card orange">
          <h3>فواتير شراء غير مدفوعة</h3>
          <div className="value">{stats?.unpaidPurchaseAmount?.toLocaleString()} ج.م</div>
        </div>
      </div>

      {activities && (
        <div className="table-container">
          <h3 style={{ marginBottom: '20px' }}>آخر النشاطات</h3>

          <h4>آخر فواتير البيع</h4>
          <table>
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>العميل</th>
                <th>المبلغ</th>
                <th>الحالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {activities.recentSales.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customer?.name}</td>
                  <td>{invoice.total.toLocaleString()} ج.م</td>
                  <td>
                    <span className={`badge badge-${
                      invoice.status === 'مدفوع' ? 'success' :
                      invoice.status === 'جزئي' ? 'warning' : 'danger'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>{new Date(invoice.date).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
