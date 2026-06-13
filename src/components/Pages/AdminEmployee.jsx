import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const jsonBase = import.meta.env.BASE_URL || '/';

// Khởi tạo form trống tương ứng chuẩn tệp employee.json
const emptyForm = () => ({
  id: '',
  name: '',
  phone: '',
  email: '',
  salary: '',
  status: 'Đang làm việc',
  posittion: '',
});

// Đồng bộ hóa dữ liệu từ JSON vào Form chỉnh sửa
function rowToForm(e) {
  return {
    id: String(e.id),
    name: e.name ?? '',
    phone: e.phone !== null && e.phone !== undefined ? String(e.phone) : '',
    email: e.email ?? '',
    salary: e.salary !== null && e.salary !== undefined ? String(e.salary) : '',
    status: e.status ?? 'Đang làm việc',
    posittion: e.posittion ?? '', // Chuẩn chữ hai chữ 't' theo file json gốc
  };
}

// Chuyển đổi ngược từ Form về định dạng Object để lưu vào file JSON
function formToRow(form, nextId) {
  return {
    id: form.id ? Number(form.id) : nextId,
    name: form.name.trim(),
    phone: form.phone.trim() ? Number(form.phone) : 0,
    email: form.email.trim(),
    salary: form.salary ? Number(form.salary) : 0,
    status: form.status.trim(),
    posittion: form.posittion.trim(),
  };
}

function AdminEmployee({ embedded = false }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(embedded);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyForm());
  const [isNew, setIsNew] = useState(false);
  const [searchIdInput, setSearchIdInput] = useState('');
  const [appliedSearchId, setAppliedSearchId] = useState('');

  const displayedRows = useMemo(() => {
    const q = appliedSearchId.trim();
    if (!q) return rows;
    return rows.filter((r) => String(r.id) === q);
  }, [rows, appliedSearchId]);

  // Sửa cơ chế lưu: Chuyển từ API ảo sang cập nhật file cục bộ trong thư mục public
  const persist = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      await axios.put('./public/employee.json', nextList, {
        headers: { 'Content-Type': 'application/json' },
      });
      setRows(nextList);
      setView('list');
      setForm(emptyForm());
      setIsNew(false);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK' || err.response?.status === 404
          ? 'Chỉ lưu được khi chạy bằng Vite (npm run dev) và cấu hình cho phép ghi tệp.'
          : null) ||
        'Không lưu được dữ liệu vào employee.json.';
      setSaveError(msg);
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
      // Nếu bạn muốn cả admin và staff đều vào được, sửa điều kiện tại đây thành:
      // if (u.role !== 'staff' && u.role !== 'admin')
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
        const res = await fetch(`${jsonBase}employee.json`);
        if (!res.ok) throw new Error('Không tải được file employee.json. Đảm bảo file nằm trong thư mục public.');
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setLoadError(e.message || 'Lỗi tải dữ liệu');
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

  const openEdit = (e) => {
    setIsNew(false);
    setForm(rowToForm(e));
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
    if (!form.name.trim()) {
      setSaveError('Vui lòng nhập tên nhân viên');
      return;
    }
    const nextId = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
    const built = formToRow(form, nextId);
    let nextList;
    if (isNew) {
      nextList = [...rows, built];
    } else {
      const idx = rows.findIndex((r) => String(r.id) === String(form.id));
      if (idx === -1) {
        setSaveError('Không tìm thấy bản ghi nhân viên để cập nhật');
        return;
      }
      nextList = rows.map((r) => (String(r.id) === String(form.id) ? built : r));
    }
    persist(nextList);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Xóa nhân viên này khỏi hệ thống?')) return;
    persist(rows.filter((r) => String(r.id) !== String(id)));
  };

  const applyIdSearch = () => setAppliedSearchId(searchIdInput.trim());
  const clearIdSearch = () => {
    setSearchIdInput('');
    setAppliedSearchId('');
  };

  const bodyContent = (
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
              <label htmlFor="admin-employee-search-id">Tìm ID: </label>
              <input
                id="admin-employee-search-id"
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
                  <th>Họ và Tên</th>
                  <th>Chức vụ</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Mức lương</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="admin-table_empty">
                      {appliedSearchId.trim()
                        ? `Không tìm thấy nhân viên có ID "${appliedSearchId.trim()}".`
                        : 'Hiện tại chưa có nhân viên nào.'}
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td><strong>{r.name}</strong></td>
                      <td>{r.posittion || 'Chưa cập nhật'}</td>
                      <td>{r.phone || '---'}</td>
                      <td>{r.email || '---'}</td>
                      <td>{r.salary ? Number(r.salary).toLocaleString('vi-VN') + ' đ' : '---'}</td>
                      <td>
                        <span className={`status-badge ${r.status === 'Đang làm việc' ? 'active' : 'inactive'}`}>
                          {r.status || 'Đang làm việc'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table_actions">
                          <button
                            type="button"
                            className="admin-table_link"
                            onClick={() => openEdit(r)}
                            disabled={saving}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="admin-table_link admin-table_link--danger"
                            onClick={() => handleDelete(r.id)}
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
          <h2>{isNew ? 'Thêm nhân viên mới' : 'Cập nhật thông tin nhân viên'}</h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                Mã nhân viên (ID)
                <input value={form.id} readOnly style={{ backgroundColor: '#e9ecef' }} />
              </label>
            )}
            <label>
              Họ và tên nhân viên
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </label>
            <label>
              Chức vụ / Vị trí
              <input
                type="text"
                value={form.posittion}
                onChange={(e) => handleFormChange('posittion', e.target.value)}
                placeholder="Ví dụ: Nhân viên bán hàng"
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
              Địa chỉ Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
              />
            </label>
            <label>
              Mức lương (VNĐ)
              <input
                type="number"
                value={form.salary}
                onChange={(e) => handleFormChange('salary', e.target.value)}
              />
            </label>
            <label>
              Trạng thái công việc
              <select
                value={form.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </select>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? 'Đang cập nhật...' : 'Xác nhận Lưu'}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm} disabled={saving}>
              Hủy bỏ
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return allowed ? <div className="admin-employee-container">{bodyContent}</div> : null;
}

export default AdminEmployee;