import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Headergpt_9.css';
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
                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i className={isMenuOpen ? "fas fa-times" : "fas fa-leaf"}></i>
                </div>

                {/* Left: Navigation */}
                <nav className={`organic-nav ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="organic-menu">
                        <li><Link to="/products">Cửa hàng</Link></li>
                        <li><Link to="/coffee">Sách cũ</Link></li>
                        <li><Link to="/about">Chuyện chúng mình</Link></li>
                    </ul>
                </nav>

                {/* Center: Logo */}
                <div className="organic-logo" onClick={() => navigate('/')}>
                    <div className="logo-circle">
                        <img src={logoImage} alt="Phuc Long Logo" />
                    </div>
                </div>

                {/* Right: Actions */}
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
        </header>
    );
};

export default Header;