import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const jsonBase = import.meta.env.BASE_URL || '/';
const cleanJsonBase = jsonBase.endsWith('/') ? jsonBase : `${jsonBase}/`;

const emptyForm = () => ({
  id: '',
  name: '',
  phone: '',
  email: '',
  salary: '',
  status: 'Đang làm việc',
  posittion: '', // Giữ nguyên chữ posittion 2 chữ 't' theo đúng file employee.json của bạn
});

function employeeToForm(e) {
  return {
    id: String(e.id),
    name: e.name ?? '',
    phone: e.phone !== null && e.phone !== undefined ? String(e.phone) : '',
    email: e.email ?? '',
    salary: e.salary !== null && e.salary !== undefined ? String(e.salary) : '',
    status: e.status ?? 'Đang làm việc',
    posittion: e.posittion ?? '',
  };
}

function formToEmployee(form, nextId) {
  const id = form.id ? Number(form.id) : nextId;
  return {
    id,
    name: form.name.trim(),
    phone: form.phone.trim() ? Number(form.phone) : 0,
    email: form.email.trim(),
    salary: form.salary.trim() ? Number(form.salary) : 0,
    status: form.status.trim() || 'Đang làm việc',
    posittion: form.posittion.trim(),
  };
}

function validateEmployee(built) {
  if (!built.name) return 'Vui lòng nhập tên nhân viên';
  if (!built.posittion) return 'Vui lòng nhập chức vụ/vị trí';
  if (Number.isNaN(built.salary) || built.salary < 0) return 'Lương phải là số hợp lệ';
  return null;
}

export default function AdminEmployee({ embedded = false }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(embedded);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyForm());
  const [isNew, setIsNew] = useState(false);
  const [searchIdInput, setSearchIdInput] = useState('');
  const [appliedSearchId, setAppliedSearchId] = useState('');

  const displayedEmployees = useMemo(() => {
    const q = appliedSearchId.trim();
    if (!q) return employees;
    return employees.filter((e) => String(e.id) === q);
  }, [employees, appliedSearchId]);

  // Đồng bộ dữ liệu cục bộ giả lập backend (Tránh triệt để lỗi crash HTML '<')
  const persist = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      setEmployees(nextList);
      localStorage.setItem('cached_employees', JSON.stringify(nextList));
      setView('list');
      setForm(emptyForm());
      setIsNew(false);
    } catch (err) {
      setSaveError('Không thể cập nhật thông tin nhân viên.');
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    if (embedded) {
      setAllowed(true);
      return;
    }
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const u = JSON.parse(raw);
      if (u.role !== 'staff' && u.role !== 'admin') {
        navigate('/');
        return;
      }
      setAllowed(true);
    } catch {
      navigate('/login');
    }
  }, [navigate, embedded]);

  useEffect(() => {
    if (!allowed) return;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const cached = localStorage.getItem('cached_employees');
        if (cached) {
          setEmployees(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const res = await fetch(`${cleanJsonBase}employee.json`);
        const contentType = res.headers.get('content-type');
        if (!res.ok || (contentType && !contentType.includes('application/json'))) {
          throw new Error('Không tải được file employee.json. Kiểm tra lại thư mục public/');
        }

        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (e) {
        setLoadError(e.message || 'Lỗi tải dữ liệu nhân viên');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [allowed]);

  const openCreate = () => {
    setIsNew(true);
    setForm(emptyForm());
    setView('form');
    setSaveError('');
  };

  const openEdit = (emp) => {
    setIsNew(false);
    setForm(employeeToForm(emp));
    setView('form');
    setSaveError('');
  };

  const cancelForm = () => {
    setView('list');
    setForm(emptyForm());
    setIsNew(false);
    setSaveError('');
  };

  const handleFormChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const nextId = employees.reduce((m, emp) => Math.max(m, Number(emp.id) || 0), 0) + 1;
    const built = formToEmployee(form, nextId);
    const invalid = validateEmployee(built);
    if (invalid) {
      setSaveError(invalid);
      return;
    }

    let nextList;
    if (isNew) {
      nextList = [...employees, built];
    } else {
      const idx = employees.findIndex((emp) => String(emp.id) === String(form.id));
      if (idx === -1) {
        setSaveError('Không tìm thấy nhân viên trên hệ thống');
        return;
      }
      nextList = employees.map((emp) => (String(emp.id) === String(form.id) ? built : emp));
    }
    persist(nextList);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?')) return;
    persist(employees.filter((emp) => String(emp.id) !== String(id)));
  };

  const applyIdSearch = () => setAppliedSearchId(searchIdInput.trim());
  const clearIdSearch = () => {
    setSearchIdInput('');
    setAppliedSearchId('');
  };

  if (!allowed) return null;

  return (
    <div className="admin-product-container">
      <div className="admin-row">
        {loadError && <div className="admin-msg admin-msg--error">{loadError}</div>}
        {saveError && <div className="admin-msg admin-msg--error">{saveError}</div>}
        
        {loading ? (
          <p>Đang tải danh sách nhân viên...</p>
        ) : view === 'list' ? (
          <>
            <div className="admin-toolbar admin-toolbar--row">
              <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
                + Thêm nhân viên
              </button>
              <div className="admin-toolbar-search">
                <label htmlFor="admin-emp-search-id">Tìm kiếm ID: </label>
                <input
                  id="admin-emp-search-id"
                  type="text"
                  inputMode="numeric"
                  value={searchIdInput}
                  onChange={(e) => setSearchIdInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyIdSearch();
                    }
                  }}
                />
                <button type="button" className="admin-btn" onClick={applyIdSearch} disabled={saving}>
                  Tìm
                </button>
                {appliedSearchId.trim() !== '' && (
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={clearIdSearch} disabled={saving}>
                    Hiện tất cả
                  </button>
                )}
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên nhân viên</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Chức vụ</th>
                    <th>Mức lương</th>
                    <th>Trạng thái</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {displayedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="admin-table_empty">
                        {appliedSearchId.trim()
                          ? `Không tìm thấy nhân viên nào có ID "${appliedSearchId.trim()}".`
                          : 'Chưa có dữ liệu nhân viên.'}
                      </td>
                    </tr>
                  ) : (
                    displayedEmployees.map((e) => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td style={{ fontWeight: '500' }}>{e.name}</td>
                        <td>{e.phone || 'Chưa cập nhật'}</td>
                        <td>{e.email || 'Chưa cập nhật'}</td>
                        <td><span className="admin-badge admin-badge--info">{e.posittion}</span></td>
                        <td>{e.salary ? `${Number(e.salary).toLocaleString('vi-VN')} đ` : '0 đ'}</td>
                        <td>
                          <span className={`admin-status-text ${e.status === 'Đang làm việc' ? 'status-active' : 'status-inactive'}`}>
                            {e.status}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table_actions">
                            <button
                              type="button"
                              className="admin-table_link"
                              onClick={() => openEdit(e)}
                              disabled={saving}
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              className="admin-table_link admin-table_link--danger"
                              onClick={() => handleDelete(e.id)}
                              disabled={saving}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <form className="admin-form-card" onSubmit={handleSubmitForm}>
            <h2>{isNew ? 'Thêm Nhân Viên Mới' : 'Cập Nhật Thông Tin Nhân Viên'}</h2>
            <div className="admin-form-grid">
              {!isNew && (
                <label>
                  Mã nhân viên (ID)
                  <input value={form.id} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </label>
              )}
              <label className="admin-form-grid_full">
                Tên nhân viên
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                />
              </label>
              <label>
                Số điện thoại
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                />
              </label>
              <label>
                Email công việc
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                />
              </label>
              <label>
                Chức vụ / Vị trí (posittion)
                <input
                  type="text"
                  value={form.posittion}
                  onChange={(e) => handleFormChange('posittion', e.target.value)}
                  required
                />
              </label>
              <label>
                Mức lương cơ bản (đ)
                <input
                  type="number"
                  value={form.salary}
                  onChange={(e) => handleFormChange('salary', e.target.value)}
                  required
                />
              </label>
              <label>
                Trạng thái làm việc
                <select
                  value={form.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d3e2',
                    borderRadius: '4px',
                    fontSize: '14px',
                    height: '38px',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="Đang làm việc">Đang làm việc</option>
                  <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                  <option value="Tạm hoãn hợp đồng">Tạm hoãn hợp đồng</option>
                </select>
              </label>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm} disabled={saving}>
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}