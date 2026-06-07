import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/logo.png';
import { imageMap } from '../../utils/productImages';
import { rankProductsBySearch } from '../../utils/productSearch';

const Header = () => {
    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const userMenuRef = useRef(null);

    const searchMatches = useMemo(() =>
        rankProductsBySearch(products, searchQuery, 5),
        [products, searchQuery]
    );


    useEffect(() => {
        const updateState = () => {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0));
            const savedUser = localStorage.getItem('currentUser');
            setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
        };

        updateState();
        window.addEventListener('storage', updateState);
        return () => window.removeEventListener('storage', updateState);
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetch('/product.json');
                const data = await res.json();
                setProducts(data.map(item => ({ ...item, image: imageMap[item.imageKey] })));
            } catch (err) { console.error('Lỗi tải dữ liệu:', err); }
        };
        loadProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setUserMenuOpen(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    return (
        <header className="novela-header">
            <div className="top-banner"></div>
            <div className="header-main">
                <div className="header-container">

                    <div className="header-left">
                        <div className="brand-logo" onClick={() => navigate('/')}>
                            <img src={logoImage} alt="Novela Logo" />
                        </div>
                    </div>


                    <div className="header-center" onBlur={() => setTimeout(() => setSearchFocused(false), 200)}>
                        <div className="search-bar">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                            />
                        </div>
                        {searchFocused && searchQuery.trim().length > 0 && (
                            <ul className="header-search-dropdown">
                                {searchMatches.length > 0 ? searchMatches.map(p => (
                                    <li
                                        key={p.id}
                                        onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                                    >
                                        <img
                                            src={p.image || 'https://via.placeholder.com/50'}
                                            alt={p.name}
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <span>{p.name}</span>
                                    </li>
                                )) : <li className="no-result" style={{ padding: '10px' }}>Không tìm thấy sản phẩm</li>}
                            </ul>
                        )}
                    </div>


                    <div className="header-right">
                        <div className="action-box" onClick={() => navigate('/contact')}>
                            <i className="fas fa-phone-alt"></i> <span>Liên hệ</span>
                        </div>
                        <div className="action-box" onClick={() => navigate('/cart')}>
                            <i className="fas fa-shopping-cart"></i>
                            <span>Giỏ hàng</span>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </div>

                        <div className="action-box user-menu-wrapper" ref={userMenuRef}>
                            {currentUser ? (
                                <div onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <i className="fas fa-user"></i> <span>{currentUser.name}</span>
                                    {userMenuOpen && (
                                        <div className="header-user-dropdown">
                                            <div onClick={() => navigate('/profile')}>Hồ sơ</div>
                                            {currentUser.role === 'staff' && <div onClick={() => navigate('/admin')}>Quản trị</div>}
                                            <div onClick={handleLogout}>Đăng xuất</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="action-box" onClick={() => navigate('/login')}>
                                    <i className="fas fa-user"></i>
                                    <span>Tài khoản</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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