import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'Headergpt_10.css';
import logoImage from '../../img/logo.png';

const Header = () => {
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const updateData = () => {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalItems = savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(totalItems);
            const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            setCurrentUser(savedUser);
        };
        updateData();
        window.addEventListener('storage', updateData);
        return () => window.removeEventListener('storage', updateData);
    }, []);

    return (
        <header className="vintage-header">
            {/* Top Bar: Hotline & Account */}
            <div className="vintage-top-bar">
                <div className="vintage-container">
                    <div className="top-bar-left">
                        <i className="fas fa-feather-alt"></i>
                        <span>Giao hàng toàn quốc - Hotline: 0965 441 669</span>
                    </div>
                    <div className="top-bar-right">
                        <span onClick={() => navigate('/login')}>
                            <i className="fas fa-user-edit"></i> 
                            {currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập'}
                        </span>
                        <span className="sep">|</span>
                        <div className="vintage-cart" onClick={() => navigate('/cart')}>
                            <i className="fas fa-bookmark"></i>
                            <span>Giỏ hàng ({cartCount})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Section: Logo Central */}
            <div className="vintage-main-section">
                <div className="vintage-logo" onClick={() => navigate('/')}>
                    <img src={logoImage} alt="Logo" />
                    <div className="logo-line"></div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="vintage-nav">
                <ul className="vintage-menu">
                    <li><Link to="/">TRANG CHỦ</Link></li>
                    <li><Link to="/products">SẢN PHẨM</Link></li>
                    <li className="v-has-child">
                        <Link to="/coffee">SÁCH CŨ</Link>
                        <ul className="v-dropdown">
                            <li><Link to="/coffee/1">Hành trình tách cà phê</Link></li>
                            <li><Link to="/coffee/2">Hạt cà phê Phúc Long</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/tea">BÁN CHẠY</Link></li>
                    <li><Link to="/promotions">KHUYẾN MÃI</Link></li>
                    <li><Link to="/about">LIÊN HỆ</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;