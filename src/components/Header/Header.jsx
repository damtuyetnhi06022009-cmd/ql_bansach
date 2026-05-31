import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/logo.png'; 

const Header = () => {
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const updateCart = () => {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0));
        };
        updateCart();
        window.addEventListener('storage', updateCart);
        return () => window.removeEventListener('storage', updateCart);
    }, []);

    return (
        <header className="novela-header">
            {/* Thanh màu đỏ trên cùng */}
            <div className="top-banner"></div>

            {/* Khung chứa Logo, Search, Icon */}
            <div className="header-main">
                <div className="header-container">
                    
                    {/* BÊN TRÁI: Chỉ giữ lại logo (Bỏ hoàn toàn nút 3 gạch) */}
                    <div className="header-left">
                        <div className="brand-logo" onClick={() => navigate('/')}>
                            <img src={logoImage} alt="Novela Logo" />
                        </div>
                    </div>

                    {/* Ở GIỮA: Thanh tìm kiếm */}
                    <div className="header-center">
                        <div className="search-bar">
                            <i className="fas fa-search search-icon"></i>
                            <input type="text" placeholder="search" />
                        </div>
                    </div>

                    {/* BÊN PHẢI: Các nút tính năng */}
                    <div className="header-right">
                        <div className="action-box" onClick={() => navigate('/contact')}>
                            <i className="fas fa-phone-alt"></i>
                            <span>Liên hệ</span>
                        </div>
                        <div className="action-box" onClick={() => navigate('/cart')}>
                            <i className="fas fa-shopping-cart"></i>
                            <span>Giỏ hàng</span>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </div>
                        <div className="action-box" onClick={() => navigate('/login')}>
                            <i className="fas fa-user"></i>
                            <span>Tài khoản</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- THANH MENU ĐIỀU HƯỚNG CỐ ĐỊNH (Luôn hiển thị dạng hàng ngang) --- */}
            <nav className="novela-nav-bar">
                <ul className="nav-menu">
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/products">Cửa hàng</Link></li>
                    <li><Link to="/new-books">Sách mới</Link></li>
                    <li><Link to="/best-sellers">Bán chạy</Link></li>
                    <li><Link to="/contact">Liên hệ</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;