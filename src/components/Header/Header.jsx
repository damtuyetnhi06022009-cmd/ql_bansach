import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/logo.png';

const Header = () => {
    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <header className="organic-header">
            <div className="organic-container">

                <div className="header-top-bar">
                    <div className="top-left-spacer">
                        <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <i className={isMenuOpen ? "fas fa-times" : "fas fa-leaf"}></i>
                        </div>
                    </div>

                    <div className="organic-logo" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="Logo" />
                    </div>

                    <div className="organic-actions">
                        <div className="action-item search-minimal">
                            <i className="fas fa-search"></i>
                        </div>
                        <div className="action-item user-profile" onClick={() => navigate('/login')}>
                            <i className="far fa-user-circle"></i>
                        </div>
                        <div className="action-item cart-pill" onClick={() => navigate('/cart')}>
                            <i className="fas fa-shopping-bag"></i>
                            <span className="cart-count">{cartCount}</span>
                        </div>
                    </div>
                </div>

                {/* --- HÀNG DƯỚI: MENU ĐIỀU HƯỚNG --- */}
                <nav className={`organic-nav ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="organic-menu">
                        <li><Link to="/">Trang chủ</Link></li>
                        <li><Link to="/products">Cửa hàng</Link></li>
                        <li><Link to="/new-books">Sách mới</Link></li>
                        <li><Link to="/best-sellers">Bán chạy</Link></li>
                        <li><Link to="/contact">Liên hệ</Link></li>
                    </ul>
                </nav>

            </div>
        </header>
    );
};

export default Header;