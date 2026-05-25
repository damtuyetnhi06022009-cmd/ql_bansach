import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      setError('Không được để trống tên đăng nhập và mật khẩu');
      return;
    }

    try {
      const normalizedUsername = trimmedUser.toLowerCase();
      const response = await fetch('/account.json');
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu tài khoản');
      }
      const accounts = await response.json();
      
      // SỬA: Tìm kiếm tài khoản trên mảng accounts đã nhận từ JSON
      const matchedAccount = accounts.find(
        (acc) => acc.user.toLowerCase() === normalizedUsername && acc.pass === trimmedPass
      );

      if (matchedAccount) {
        // SỬA: Đóng gói JSON string giúp Profile giải mã không bị lỗi crash
        localStorage.setItem('currentUser', JSON.stringify({ username: matchedAccount.user }));
        window.dispatchEvent(new Event('authChange'));
        navigate('/profile');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
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
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <h1 className="login-title">Quên mật khẩu</h1>
            <div className="form-group">
              <input type="text" className="form-input" placeholder="Tên tài khoản" value={fpUser} onChange={(e) => setFpUser(e.target.value)} />
            </div>
            <button type="button" className="continue-shopping-btn" onClick={() => setForgotMode(false)}>Quay lại đăng nhập</button>
          </form>
        ) : (
          <>
            <h1 className="login-title">Đăng nhập</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
              </div>
              <div className="form-group">
                <input type="password" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
              <div className="forgot-row">
                <button type="button" className="forgot-link" onClick={openForgot}>Forgot password?</button>
              </div>
              {error && <div className="login-error">{error}</div>}
              <button type="submit" className="login-button">LOGIN</button>
            </form>
            <div className="login-divider">Or login with</div>
            <div className="social-login">
              <button type="button" className="social-btn facebook"><span>Facebook</span></button>
              <button type="button" className="social-btn google"><span>Google</span></button>
            </div>
            <div className="login-footer">
              <span>Not a member? </span>
              <Link to="/signup" className="signup-link">Signup now</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;