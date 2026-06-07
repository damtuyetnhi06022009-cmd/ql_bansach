import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Trạng thái quên mật khẩu
  const [forgotMode, setForgotMode] = useState(false);
  const [fpUser, setFpUser] = useState('');
  const [fpNew, setFpNew] = useState('');
  const [fpConfirm, setFpConfirm] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpSuccess, setFpSuccess] = useState('');

  const navigate = useNavigate();

  // Xử lý Đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Không được để trống số điện thoại và mật khẩu');
      return;
    }

    try {
      const normalizedUsername = trimmedUser.toLowerCase();
      const response = await fetch('/account.json');
      if (!response.ok) throw new Error('Không thể tải dữ liệu tài khoản');

      const accounts = await response.json();
      const matchedAccount = accounts.find((acc) => {
        const accUser = String(acc.user || '').trim().toLowerCase();
        const accPass = String(acc.pass || '').trim();
        return accUser === normalizedUsername && accPass === trimmedPass;
      });

      if (matchedAccount) {
        const publicInfo = { ...matchedAccount };
        delete publicInfo.pass;
        localStorage.setItem('currentUser', JSON.stringify(publicInfo));
        window.dispatchEvent(new Event('authChange'));

        // Điều hướng dựa trên role
        navigate(matchedAccount.role === 'staff' ? '/admin' : '/');
      } else {
        setError('Số điện thoại hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError('Có lỗi hệ thống xảy ra');
    }
  };

  // Xử lý Quên mật khẩu
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setFpError('');
    setFpSuccess('');

    if (!fpUser.trim() || !fpNew.trim() || !fpConfirm.trim()) {
      setFpError('Vui lòng điền đầy đủ các trường');
      return;
    }
    if (fpNew !== fpConfirm) {
      setFpError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const { data } = await axios.post('/api/reset-password', {
        user: fpUser.trim(),
        newPass: fpNew.trim(),
      });
      setFpSuccess(data.message || 'Đổi mật khẩu thành công!');
    } catch (err) {
      setFpError('Lỗi khi đổi mật khẩu (API có thể chưa được cấu hình)');
    }
  };

  const openForgot = () => {
    setForgotMode(true);
    setFpError(''); setFpSuccess('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {forgotMode ? (
          <form className="login-form" onSubmit={handleForgotSubmit}>
            <h1 className="login-title" style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '15px' }}>
              BẠN QUÊN MẬT KHẨU ?
            </h1>

            <div className="form-group">
              <label className="form-label">Số điện thoại / Tên đăng nhập</label>
              <input type="text" className="form-input" value={fpUser} onChange={(e) => setFpUser(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu mới</label>
              <input type="password" className="form-input" value={fpNew} onChange={(e) => setFpNew(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input type="password" className="form-input" value={fpConfirm} onChange={(e) => setFpConfirm(e.target.value)} />
            </div>

            {fpError && <div className="login-error">{fpError}</div>}
            {fpSuccess && <div className="login-success" style={{ color: 'green' }}>{fpSuccess}</div>}

            <div className="button-container" style={{ marginTop: '25px' }}>
              <button type="submit" className="login-button">Gửi yêu cầu</button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button type="button" className="forgot-red-link" onClick={() => setForgotMode(false)}>
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="login-title">ĐĂNG NHẬP</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <div className="password-input-container" style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}

                  </button>
                </div>
              </div>

              <div className="forgot-row-right" style={{ textAlign: 'right', marginBottom: '10px' }}>
                <button type="button" className="forgot-red-link" onClick={openForgot} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>
                  Quên mật khẩu ?
                </button>
              </div>

              {error && <div className="login-error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

              <div className="button-container">
                <button type="submit" className="login-button" style={{ width: '100%', padding: '10px' }}>Đăng nhập</button>
              </div>
            </form>

            <div className="login-footer" style={{ textAlign: 'center', marginTop: '20px' }}>
              <span>Chưa có tài khoản? </span>
              <Link to="/signup" className="signup-link">Đăng ký ngay</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;