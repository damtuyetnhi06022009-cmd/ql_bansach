import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Headergpt_2.css';
import logoImage from '../../img/logo.png';

const Header = () => {
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const updateData = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 0), 0));
            setCurrentUser(JSON.parse(localStorage.getItem('currentUser') || 'null'));
        };

        updateData();
        window.addEventListener('cartUpdated', updateData);
        window.addEventListener('userUpdated', updateData);
        return () => {
            window.removeEventListener('cartUpdated', updateData);
            window.removeEventListener('userUpdated', updateData);
        };
    }, []);

    return (
        <header className="eco-header">
            <div className="eco-container">
                {/* Logo bên trái */}
                <div className="eco-logo" onClick={() => navigate('/')}>
                    <img src={logoImage} alt="Phuc Long Logo" />
                    <span className="logo-text">BOOK & TEA</span>
                </div>

                {/* Menu chính ở giữa */}
                <nav className="eco-nav">
                    <Link to="/products" className="eco-link">CỬA HÀNG</Link>
                    <Link to="/best-seller" className="eco-link">BÁN CHẠY</Link>
                    <Link to="/news" className="eco-link">TIN TỨC</Link>
                    <Link to="/about" className="eco-link">CHÚNG TÔI</Link>
                </nav>

                {/* Nhóm chức năng bên phải */}
                <div className="eco-actions">
                    <div className="eco-user" onClick={() => navigate('/login')}>
                        {currentUser ? (
                            <span className="user-greeting">Hi, {currentUser.name || 'User'}</span>
                        ) : (
                            <i className="feather-user"></i>
                        )}
                    </div>
                    
                    <button className="eco-cart-btn" onClick={() => navigate('/cart')}>
                        <div className="cart-icon-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            <span className="eco-badge">{cartCount}</span>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;