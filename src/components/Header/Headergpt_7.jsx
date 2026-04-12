import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Headergpt_7.css';
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
        <header className="dark-neon-header">
            <div className="neon-container">
                {/* Logo bên trái với hiệu ứng phát sáng */}
                <div className="neon-logo" onClick={() => navigate('/')}>
                    <img src={logoImage} alt="Logo" />
                </div>

                {/* Menu chính ở giữa */}
                <nav className="neon-nav">
                    <ul className="neon-menu">
                        <li><Link to="/">HOME</Link></li>
                        <li className="neon-dropdown-parent">
                            <Link to="/coffee">COLLECTION</Link>
                            <div className="neon-dropdown">
                                <Link to="/coffee/1">Rare Books</Link>
                                <Link to="/coffee/2">New Arrivals</Link>
                            </div>
                        </li>
                        <li><Link to="/tea">BEST SELLERS</Link></li>
                        <li><Link to="/promotions">OFFERS</Link></li>
                    </ul>
                </nav>

                {/* Tiện ích bên phải */}
                <div className="neon-actions">
                    <div className="search-glass">
                        <i className="fas fa-search"></i>
                    </div>
                    <div className="user-neon" onClick={() => navigate('/login')}>
                        <i className="far fa-moon"></i>
                        <span>{currentUser ? (currentUser.name || currentUser.user) : 'Login'}</span>
                    </div>
                    <div className="cart-neon-box" onClick={() => navigate('/cart')}>
                        <i className="fas fa-shopping-basket"></i>
                        <span className="neon-badge">{cartCount}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;