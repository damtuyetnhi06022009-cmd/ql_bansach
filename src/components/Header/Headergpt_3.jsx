import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Headergpt_3.css';
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
        <header className="cyber-header">
            <div className="cyber-scanline"></div>
            <div className="cyber-wrapper">
                {/* Logo với hiệu ứng Glitch */}
                <div className="cyber-logo-box" onClick={() => navigate('/')}>
                    <img src={logoImage} alt="Cyber Logo" className="cyber-logo" />
                    <div className="cyber-glitch-layers">
                        <span>PHUC LONG</span>
                        <span>PHUC LONG</span>
                    </div>
                </div>

                {/* Nav với các góc cắt chéo (Clipping) */}
                <nav className="cyber-nav">
                    <Link to="/books" className="cyber-nav-item" data-text="ARCHIVE">SÁCH CŨ</Link>
                    <Link to="/sale" className="cyber-nav-item item-hot" data-text="FLASH">FLASH SALE</Link>
                    <Link to="/about" className="cyber-nav-item" data-text="INFO">THÔNG TIN</Link>
                </nav>

                {/* Các nút bấm như bảng điều khiển */}
                <div className="cyber-controls">
                    <div className="cyber-user-status" onClick={() => navigate('/login')}>
                        <div className="status-indicator online"></div>
                        <span className="user-label">
                            {currentUser ? (currentUser.name || 'PILOT') : 'GUEST_ACCESS'}
                        </span>
                    </div>

                    <div className="cyber-cart-container" onClick={() => navigate('/cart')}>
                        <div className="cart-glitch-box">
                            <i className="fas fa-terminal"></i>
                            <span className="cart-val">[{cartCount}]</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;