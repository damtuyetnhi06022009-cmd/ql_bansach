import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Trạng thái ẩn/hiện
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [fpUser, setFpUser] = useState('');
  const [fpNew, setFpNew] = useState('');
  const [fpConfirm, setFpConfirm] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpSuccess, setFpSuccess] = useState('');
  const navigate = useNavigate();

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
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu tài khoản');
      }
      const accounts = await response.json();
      
      const matchedAccount = accounts.find(
        (acc) => acc.user.toLowerCase() === normalizedUsername && acc.pass === trimmedPass
      );

      if (matchedAccount) {
        localStorage.setItem('currentUser', JSON.stringify({ username: matchedAccount.user }));
        window.dispatchEvent(new Event('authChange'));
        navigate('/profile');
      } else {
        setError('Số điện thoại hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi hệ thống xảy ra');
    }
  };

  const openForgot = () => {
    setForgotMode(true);
    setFpUser(''); setFpNew(''); setFpConfirm(''); setFpError(''); setFpSuccess('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {forgotMode ? (
          /* ========================================================
             GIAO DIỆN QUÊN MẬT KHẨU CẬP NHẬT THEO ẢNH MẪU MỚI
             ======================================================== */
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            {/* Tiêu đề in hoa đậm màu đỏ */}
            <h1 className="login-title" style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '15px' }}>
              BẠN QUÊN MẬT KHẨU ?
            </h1>
            
            {/* Dòng text hướng dẫn phụ căn trái */}
            <div style={{ color: '#333', fontSize: '15px', marginBottom: '25px', lineHeight: '1.5' }}>
              <div>Nhập địa chỉ email của bạn</div>
              <div>chúng tôi sẽ gửi bạn mã để thiết lập lại mật khẩu</div>
            </div>

            {/* Ô nhập Email */}
            <div className="form-group">
              <label className="form-label">Nhập email</label>
              <input 
                type="email" 
                className="form-input" 
                value={fpUser} 
                onChange={(e) => setFpUser(e.target.value)} 
              />
            </div>

            {/* Nút gửi mật khẩu mới căn giữa */}
            <div className="button-container" style={{ marginTop: '25px' }}>
              <button type="submit" className="login-button" style={{ padding: '8px 50px' }}>
                Gửi mật khẩu mới
              </button>
            </div>

            {/* Link quay về trang chủ/đăng nhập chữ đỏ căn giữa */}
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button 
                type="button" 
                className="forgot-red-link" 
                style={{ float: 'none', margin: '0 auto' }} 
                onClick={() => setForgotMode(false)}
              >
                Trở về trang chủ
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================
             GIAO DIỆN ĐĂNG NHẬP GỐC (GIỮ NGUYÊN)
             ======================================================== */
          <>
            <h1 className="login-title">ĐĂNG NHẬP</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  autoComplete="username" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    autoComplete="current-password" 
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
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

              <div className="forgot-row-right">
                <button type="button" className="forgot-red-link" onClick={openForgot}>
                  Quên mật khẩu ?
                </button>
              </div>

              {error && <div className="login-error">{error}</div>}

              <div className="button-container">
                <button type="submit" className="login-button">Đăng nhập</button>
              </div>
            </form>

            <div className="login-footer">
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