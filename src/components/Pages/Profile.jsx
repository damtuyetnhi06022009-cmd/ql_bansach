import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function readStoredUser() {
    try {
        const raw = localStorage.getItem('currentUser');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => readStoredUser()); // SỬA: Destructure đầy đủ state setter

    const [curPass, setCurPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [pwMsg, setPwMsg] = useState('');
    const [pwErr, setPwErr] = useState('');

    const [delPass, setDelPass] = useState('');
    const [delErr, setDelErr] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [navigate, user]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwErr(''); setPwMsg('');

        if (!curPass.trim() || !newPass.trim() || !confirmPass.trim()) {
            setPwErr('Vui lòng nhập đủ các thông tin mật khẩu');
            return;
        }
        if (newPass !== confirmPass) {
            setPwErr('Mật khẩu mới không khớp');
            return;
        }

        try {
            await axios.post('/api/change-password', {
                user: user.username,
                oldPass: curPass,
                newPass: newPass
            });
            setPwMsg('Đổi mật khẩu thành công!');
            setCurPass(''); setNewPass(''); setConfirmPass('');
        } catch (err) {
            setPwErr(err.response?.data?.error || 'Có lỗi hệ thống xảy ra.');
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDelErr('');

        if (!delPass.trim()) {
            setDelErr('Vui lòng nhập mật khẩu để xóa tài khoản');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
            try {
                await axios.post('/api/delete-account', {
                    user: user.username,
                    pass: delPass
                });
                localStorage.removeItem('currentUser');
                window.dispatchEvent(new Event('authChange'));
                navigate('/login', { replace: true });
            } catch (err) {
                setDelErr(err.response?.data?.error || 'Mật khẩu xác nhận không đúng.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        window.dispatchEvent(new Event('authChange'));
        navigate('/login', { replace: true });
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h1 className="profile-title">Thông tin cá nhân</h1>
                <section className="profile-section">
                    <dl className="profile-fields">
                        <dt>Tài khoản:</dt>
                        <dd>{user.username}</dd>
                    </dl>
                    <button className="profile-back" onClick={handleLogout}>Đăng xuất</button>
                </section>

                <section className="profile-section" style={{ marginTop: '30px' }}>
                    <h2 className="profile-section-title">Đổi mật khẩu</h2>
                    <form className="profile-form" onSubmit={handleChangePassword}>
                        <label className="profile-label">Mật khẩu hiện tại
                            <input type="password" className="profile-input" value={curPass} onChange={(e) => setCurPass(e.target.value)} />
                        </label>
                        <label className="profile-label">Mật khẩu mới
                            <input type="password" className="profile-input" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                        </label>
                        <label className="profile-label">Xác nhận mật khẩu mới
                            <input type="password" className="profile-input" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                        </label>
                        {pwErr && <p className="profile-msg profile-msg--error">{pwErr}</p>}
                        {pwMsg && <p className="profile-msg profile-msg--success">{pwMsg}</p>}
                        <button type="submit" className="profile-btn profile-btn--primary">Cập nhật mật khẩu</button>
                    </form>
                </section>

                <section className="profile-section profile-section--danger" style={{ marginTop: '30px' }}>
                    <h2 className="profile-section-title">Xóa tài khoản</h2>
                    <form className="profile-form" onSubmit={handleDeleteAccount}>
                        <label className="profile-label">Mật khẩu xác nhận
                            <input type="password" className="profile-input" value={delPass} onChange={(e) => setDelPass(e.target.value)} />
                        </label>
                        {delErr && <p className="profile-msg profile-msg--error">{delErr}</p>}
                        <button type="submit" className="profile-btn profile-btn--danger">Xóa tài khoản</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Profile;