import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // File CSS chứa toàn bộ giao diện bên dưới

const Signup = () => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const trimmedPhone = phone.trim();
        const trimmedEmail = email.trim();
        const trimmedPass = password.trim();

        if (!trimmedPhone || !trimmedEmail || !trimmedPass) {
            setError('Vui lòng nhập đầy đủ Số điện thoại, Email và Mật khẩu');
            return;
        }

        if (trimmedPass.length < 3) {
            setError('Mật khẩu tối thiểu 3 ký tự');
            return;
        }

        try {
            await axios.post('/api/register', {
                phone: trimmedPhone,
                email: trimmedEmail,
                pass: trimmedPass,
            });
            navigate('/login');
        } catch (err) {
            const msg =
                err.response?.data?.error ||
                (err.response?.status === 404
                    ? 'Chỉ hoạt động khi chạy npm run dev hoặc npm run preview (API ghi file trên server).'
                    : 'Đã có lỗi xảy ra khi đăng ký.');
            setError(msg);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">ĐĂNG KÝ</h1>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Trường 1: Số điện thoại */}
                    <div className="form-group">
                        <label className="form-label">Số điện thoại</label>
                        <input 
                            type="text"
                            className="form-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="tel"
                        />
                    </div>

                    {/* Trường 2: Email */}
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    {/* Trường 3: Mật khẩu */}
                    <div className="form-group-password">
                        <label className="form-label">Mật khẩu</label>
                        <div className="password-input-container">
                            <input 
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password" 
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {/* THAY ĐỔI ICON Ở ĐÂY: Tự động đổi trạng thái con mắt */}
                                {showPassword ? (
                                    /* Icon Mắt Mở - Khi đang HIỆN mật khẩu */
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                ) : (
                                    /* Icon Mắt Gạch Chéo - Khi đang ẨN mật khẩu */
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && <div className="login-error">{error}</div>}
                    
                    {/* Nút bấm Đăng ký */}
                    <div className="button-container">
                        <button type="submit" className="login-button">
                            Đăng ký
                        </button>
                    </div>
                </form>

                <div className="login-footer login-footer--spaced">
                    <span>Đã có tài khoản? </span>
                    <Link to="/login" className="signup-link">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;