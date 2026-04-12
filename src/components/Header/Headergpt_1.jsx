import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Headergpt_1.css'; // Đảm bảo bạn cập nhật file CSS theo phong cách mới
import logoImage from '../../img/logo.png';

const Header = () => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const updateData = () => {
            // Cập nhật Cart
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(total);

            // Cập nhật User
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            setCurrentUser(user);
        };

        updateData();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('cartUpdated', updateData);
        window.addEventListener('userUpdated', updateData);
        window.addEventListener('storage', updateData);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('cartUpdated', updateData);
            window.removeEventListener('userUpdated', updateData);
            window.removeEventListener('storage', updateData);
        };
    }, []);

    return (
        <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
            {/* Top Bar: Minimalist style */}
            <div className="top-utility-bar">
                <div className="container">
                    <div className="contact-info">
                        <span><i className="fas fa-headset"></i> Support: 0965441669</span>
                    </div>
                    <div className="user-meta">
                        <div className="lang-switcher">
                            <span className="active">VN</span>
                            <span>EN</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="main-nav-container">
                <div className="container nav-wrapper">
                    <div className="logo-section" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="Brand Logo" />
                    </div>

                    <nav className="nav-links">
                        <Link to="/" className="nav-item">TRANG CHỦ</Link>
                        
                        <div 
                            className="nav-item dropdown-trigger"
                            onMouseEnter={() => setHoveredMenu('books')}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            <Link to="/old-books">SÁCH CŨ <i className="fas fa-chevron-down"></i></Link>
                            {hoveredMenu === 'books' && (
                                <div className="modern-dropdown">
                                    <Link to="/category/van-hoc">Văn học cổ điển</Link>
                                    <Link to="/category/lich-su">Lịch sử & Triết học</Link>
                                    <Link to="/category/su-tam">Sách sưu tầm hiếm</Link>
                                </div>
                            )}
                        </div>

                        <Link to="/bestseller" className="nav-item">BÁN CHẠY</Link>
                        <Link to="/sale" className="nav-item highlight-link">FLASH SALE</Link>
                        <Link to="/about" className="nav-item">VỀ CHÚNG TÔI</Link>
                    </nav>

                    <div className="action-icons">
                        <div className="search-box-minimal">
                            <i className="fas fa-search"></i>
                        </div>
                        
                        <div className="user-account" onClick={() => navigate('/login')}>
                            <i className="far fa-user"></i>
                            <span className="user-name">
                                {currentUser ? (currentUser.name || currentUser.user) : 'Tài khoản'}
                            </span>
                        </div>

                        <div className="cart-wrapper" onClick={() => navigate('/cart')}>
                            <div className="cart-icon-container">
                                <i className="fas fa-shopping-bag"></i>
                                <span className="badge-count">{cartCount}</span>
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