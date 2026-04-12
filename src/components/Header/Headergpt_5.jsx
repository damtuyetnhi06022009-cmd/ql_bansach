import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Headergpt_5.css';
import logoImage from '../../img/logo.png';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Hiệu ứng đổi màu Header khi cuộn trang
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateData = () => {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalItems = savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(totalItems);

            const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            setCurrentUser(savedUser);
        };

        updateData();
        window.addEventListener('cartUpdated', updateData);
        window.addEventListener('userUpdated', updateData);
        window.addEventListener('storage', updateData);

        return () => {
            window.removeEventListener('cartUpdated', updateData);
            window.removeEventListener('userUpdated', updateData);
            window.removeEventListener('storage', updateData);
        };
    }, []);

    return (
        <header className={`modern-header ${scrolled ? 'is-scrolled' : ''}`}>
            <div className="container-fluid">
                <div className="header-wrapper">
                    
                    {/* Left: Navigation Links */}
                    <nav className="main-nav">
                        <ul className="nav-list">
                            <li><Link to="/products">SẢN PHẨM</Link></li>
                            <li><Link to="/tea">BÁN CHẠY</Link></li>
                            <li className="has-submenu">
                                <Link to="/coffee">SÁCH CŨ <i className="fas fa-chevron-down icon-small"></i></Link>
                                <ul className="submenu">
                                    <li><Link to="/coffee/hanh-trinh">Hành trình tách cà phê</Link></li>
                                    <li><Link to="/coffee/hat-ca-phe">Hạt cà phê Phúc Long</Link></li>
                                    <li><Link to="/coffee/nghe-thuat">Nghệ thuật pha chế</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>

                    {/* Center: Logo */}
                    <div className="brand-logo" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="Phuc Long Logo" />
                    </div>

                    {/* Right: Actions */}
                    <div className="user-controls">
                        <div className="search-box-minimal">
                            <i className="fas fa-search"></i>
                        </div>

                        <div className="auth-section" onClick={() => navigate('/login')}>
                            <i className="far fa-user"></i>
                            <span className="user-name">
                                {currentUser ? (currentUser.name || currentUser.user) : 'Tài khoản'}
                            </span>
                        </div>

                        <div className="cart-minimal" onClick={() => navigate('/cart')}>
                            <div className="cart-icon-wrapper">
                                <i className="fas fa-shopping-bag"></i>
                                {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
                            </div>
                            <span className="cart-label">Giỏ hàng</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;