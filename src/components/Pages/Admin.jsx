import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminProduct from './AdminProduct';
import AdminCategory from './AdminCategory';
import AdminCustomer from './AdminCustomer';
import AdminEmployee from './AdminEmployee';
import AdminBill from './AdminBill';
import AdminInvoiceDetails from './AdminInvoiceDetails';

import './Admin.css';

const jsonBase = import.meta.env.BASE_URL || '/';
const cleanJsonBase = jsonBase.endsWith('/') ? jsonBase : `${jsonBase}/`;

const SECTION_LABEL = {
  dashboard: 'Dashboard',
  products: 'Sản phẩm',
  category: 'Danh mục',
  customer: 'Khách hàng',
  employee: 'Nhân viên', // Giữ nguyên chữ hiển thị lỗi chính tả theo đúng file mockup giao diện gốc của bạn
  bill: 'Hóa đơn',
  invoiceDetails: 'Chi tiết hóa đơn',
};

const SECTION_ICONS = {
  dashboard: 'fa-solid fa-tachometer-alt',
  products: 'fa-solid fa-book', 
  category: 'fa-solid fa-folder', 
  customer: 'fa-solid fa-users', 
  employee: 'fa-solid fa-user-tie', 
  bill: 'fa-solid fa-file-invoice-dollar', 
  invoiceDetails: 'fa-solid fa-receipt', 
};

function fmtNumber(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Đổi sang dấu chấm phân cách hàng nghìn cho chuẩn Tiếng Việt
}

function fmtCurrency(n) {
  return `${fmtNumber(Number(n) || 0)} đ`;
}

/* =========================
   BILL STATUS
========================= */
const BILL_STATUS_MAP = {
  delivered: { label: 'Đã giao hàng', cls: 'done' },
  shipping: { label: 'Vận chuyển', cls: 'shipping' },
  pending: { label: 'Chưa giải quyết', cls: 'pending' },
  processing: { label: 'Xử lý', cls: 'processing' },
};

function billStatusFromJson(statusRaw) {
  const key = String(statusRaw || '').trim().toLowerCase();
  if (BILL_STATUS_MAP[key]) {
    return { key, ...BILL_STATUS_MAP[key] };
  }
  return {
    key: 'unknown',
    label: key ? String(statusRaw).trim() : 'Chưa xác định',
    cls: 'unknown',
  };
}

/* =========================
   COMPONENT
========================= */
const Admin = () => {
  const navigate = useNavigate();

  const [allowed, setAllowed] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [adminSection, setAdminSection] = useState('dashboard');

  const userMenuRef = useRef(null);

  /* =========================
     AUTH CHECK (SỬA LỖI PHÂN QUYỀN)
  ========================= */
  useEffect(() => {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const u = JSON.parse(raw);
      // Chấp nhận cả tài khoản 'admin' và 'staff' để tránh lỗi đá người dùng ra trang chủ
      if (u.role !== 'staff' && u.role !== 'admin') {
        navigate('/');
        return;
      }
      setAllowed(true);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  /* =========================
     LOAD DATA (SỬA LỖI ĐƯỜNG DẪN 404)
  ========================= */
  useEffect(() => {
    if (!allowed) return;

    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        // Kiểm tra xem dữ liệu tạm từ AdminProduct có đang nằm ở LocalStorage hay không để đồng bộ con số lên Dashboard
        const cachedProducts = localStorage.getItem('cached_products');

        const [pRes, cRes, bRes, cuRes, eRes, iRes] = await Promise.all([
          cachedProducts ? null : fetch(`${cleanJsonBase}product.json`), // Sửa từ 'products.json' thành 'product.json'
          fetch(`${cleanJsonBase}category.json`),
          fetch(`${cleanJsonBase}bill.json`),
          fetch(`${cleanJsonBase}customer.json`),
          fetch(`${cleanJsonBase}employee.json`),
          fetch(`${cleanJsonBase}invoicedetails.json`),
        ]);

        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
        } else if (pRes && pRes.ok) {
          const pdata = await pRes.json();
          setProducts(Array.isArray(pdata) ? pdata : []);
        }

        if (cRes && cRes.ok) {
          const cdata = await cRes.json();
          setCategories(Array.isArray(cdata) ? cdata : []);
        }
        if (bRes && bRes.ok) {
          const bdata = await bRes.json();
          setBills(Array.isArray(bdata) ? bdata : []);
        }
        if (cuRes && cuRes.ok) {
          const cudata = await cuRes.json();
          setCustomers(Array.isArray(cudata) ? cudata : []);
        }
        if (eRes && eRes.ok) {
          const edata = await eRes.json();
          setEmployees(Array.isArray(edata) ? edata : []);
        }
        if (iRes && iRes.ok) {
          const idata = await iRes.json();
          setInvoiceDetails(Array.isArray(idata) ? idata : []);
        }
      } catch (e) {
        setLoadError(e.message || 'Lỗi tải dữ liệu hệ thống');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [allowed]);

  /* =========================
     USER MENU
  ========================= */
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  /* =========================
     USER INFO
  ========================= */
  const staffInitials = useMemo(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return 'AD';
      const u = JSON.parse(raw);
      const name = String(u.user || u.name || 'staff').trim();
      const parts = name.split(/\s+/).filter(Boolean);
      if (!parts.length) return 'AD';
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } catch {
      return 'AD';
    }
  }, []);

  const staffDisplayName = useMemo(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return 'Administrator';
      const u = JSON.parse(raw);
      return String(u.user || u.name || 'staff').trim() || 'Administrator';
    } catch {
      return 'Administrator';
    }
  }, []);

  /* =========================
     STATS
  ========================= */
  const stats = useMemo(() => {
    const total = products.length;
    const revenue = bills.reduce((sum, bill) => sum + Number(bill.total || 0), 0);
    return { total, revenue };
  }, [products, bills]);

  const goHome = () => navigate('/');
  const logout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/login');
    setLogoutModalOpen(false);
  };
  const closeMobileNav = () => setMobileSidebarOpen(false);

  if (!allowed) {
    return <div className="ruang-boot" aria-hidden />;
  }

  return (
    <div className="ruang-layout">
      {/* OVERLAY */}
      <div
        className={`ruang-overlay ${mobileSidebarOpen ? 'is-visible' : ''}`}
        onClick={closeMobileNav}
        aria-hidden={!mobileSidebarOpen}
      />

      {/* SIDEBAR */}
      <aside className={`ruang-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}>
        <div className="ruang-sidebar__brand">
          <span className="ruang-sidebar__brand-icon">
            <i className="fa-solid fa-book" />
          </span>
          <span>Novela</span>
        </div>

        <hr className="ruang-sidebar__divider" />

        <div className="ruang-sidebar__heading">Quản lý</div>

        <ul className="ruang-sidebar__nav">
          {Object.entries(SECTION_LABEL).map(([key, label]) => (
            <li key={key}>
              <button
                type="button"
                className={`ruang-sidebar__link ${adminSection === key ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  textAlign: 'left',
                }}
                onClick={() => {
                  setAdminSection(key);
                  closeMobileNav();
                }}
              >
                <i 
                  className={SECTION_ICONS[key]} 
                  style={{ width: '20px', textAlign: 'center', fontSize: '15px' }} 
                />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN */}
      <div className="ruang-shell">
        {/* TOPBAR */}
        <header className="ruang-topbar">
          <button
            type="button"
            className="ruang-topbar__toggle"
            onClick={() => setMobileSidebarOpen((v) => !v)}
          >
            <i className="fa-solid fa-bars" />
          </button>

          <div className="ruang-topbar__right">
            <div className="ruang-user" ref={userMenuRef}>
              <button
                type="button"
                className="ruang-user__toggle"
                onClick={() => setUserMenuOpen((v) => !v)}
              >
                <span className="ruang-user__avatar">{staffInitials}</span>
                <span className="ruang-user__name">{staffDisplayName}</span>
              </button>

              {userMenuOpen && (
                <div className="ruang-user__menu">
                  <button type="button" onClick={goHome}>Trang chủ</button>
                  <button type="button" onClick={() => setLogoutModalOpen(true)}>Đăng xuất</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="ruang-main">
          {loadError && <div className="admin-msg admin-msg--error">{loadError}</div>}

          {loading ? (
            <div className="ruang-loading">Đang tải thông tin hệ thống...</div>
          ) : (
            <>
              {adminSection === 'products' && <AdminProduct embedded />}
              {adminSection === 'category' && <AdminCategory embedded />}
              {adminSection === 'customer' && <AdminCustomer embedded />}
              {adminSection === 'employee' && <AdminEmployee embedded />}
              {adminSection === 'bill' && <AdminBill embedded />}
              {adminSection === 'invoiceDetails' && <AdminInvoiceDetails embedded />}

              {adminSection === 'dashboard' && (
                <div style={{ padding: '10px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#5a5c69' }}>Dashboard</h2>
                  
                  {/* CSS GRID BAO QUANH 3 CARDS THỐNG KÊ */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                    gap: '24px',
                    marginBottom: '24px'
                  }}>
                    
                    {/* CARD 1: DOANH THU (ĐƯỜNG VIỀN XANH DƯƠNG) */}
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '20px',
                      borderRadius: '5px',
                      borderLeft: '4px solid #4e73df',
                      boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4e73df', textTransform: 'uppercase', marginBottom: '5px' }}>Doanh thu</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#5a5c69' }}>{fmtCurrency(stats.revenue)}</div>
                      </div>
                      <i className="fa-solid fa-calendar fa-2x" style={{ color: '#dddfeb' }}></i>
                    </div>

                    {/* CARD 2: SẢN PHẨM (ĐƯỜNG VIỀN XANH LÁ) */}
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '20px',
                      borderRadius: '5px',
                      borderLeft: '4px solid #1cc88a',
                      boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1cc88a', textTransform: 'uppercase', marginBottom: '5px' }}>Sản phẩm</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#5a5c69' }}>{fmtNumber(stats.total)}</div>
                      </div>
                      <i className="fa-solid fa-book fa-2x" style={{ color: '#dddfeb' }}></i>
                    </div>

                    {/* CARD 3: KHÁCH HÀNG (ĐƯỜNG VIỀN XANH LAM NHẠT) */}
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '20px',
                      borderRadius: '5px',
                      borderLeft: '4px solid #36b9cc',
                      boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#36b9cc', textTransform: 'uppercase', marginBottom: '5px' }}>Khách hàng</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#5a5c69' }}>{fmtNumber(customers.length || 1)}</div>
                      </div>
                      <i className="fa-solid fa-users fa-2x" style={{ color: '#dddfeb' }}></i>
                    </div>

                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* FOOTER */}
        <footer className="ruang-footer">Copyright © Novela</footer>
      </div>

      {/* MODAL */}
      {logoutModalOpen && (
        <div className="ruang-modal-backdrop">
          <div className="ruang-modal">
            <div className="ruang-modal__header">
              <h5>Đăng xuất</h5>
              <button type="button" onClick={() => setLogoutModalOpen(false)}>×</button>
            </div>
            <div className="ruang-modal__body">Bạn có chắc muốn đăng xuất?</div>
            <div className="ruang-modal__footer">
              <button type="button" onClick={() => setLogoutModalOpen(false)}>Hủy</button>
              <button type="button" onClick={logout}>Đăng xuất</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;