import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { imageMap } from '../../utils/productImages';
import './ProductList.css';

const PRODUCTS_PER_PAGE = 8; // Thay đổi thành 8 để hiển thị vừa đủ 2 hàng (mỗi hàng 4 sản phẩm)
const jsonBase = import.meta.env.BASE_URL || '/';

// Component đếm ngược cô lập để tối ưu hiệu năng
const FlashSaleTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            const diff = endOfDay - now;
            if (diff > 0) {
                setTimeLeft({
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60)
                });
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flash-sale-timer">
            <span className="time-box">{String(timeLeft.hours).padStart(2, '0')}</span> :
            <span className="time-box">{String(timeLeft.minutes).padStart(2, '0')}</span> :
            <span className="time-box">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
    );
};

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${jsonBase}product.json`),
                    fetch(`${jsonBase}category.json`)
                ]);
                if (!productsRes.ok) throw new Error('Không thể tải dữ liệu sản phẩm');
                
                const data = await productsRes.json();
                const mappedProducts = data.map((item) => ({
                    ...item,
                    image: imageMap[item.imageKey] || item.image
                }));
                setProducts(mappedProducts);

                if (categoriesRes.ok) {
                    const catData = await categoriesRes.json();
                    setCategories(Array.isArray(catData) ? catData : []);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredProducts = selectedCategoryId == null
        ? products
        : products.filter((p) => p.categoryId === selectedCategoryId);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PRODUCTS_PER_PAGE;
    const visibleProducts = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);

    const handleCategoryChange = (id) => {
        setSelectedCategoryId(id);
        setCurrentPage(1);
    };

    const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
    const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

    if (isLoading) return <div className="loading-state">Đang tải sản phẩm...</div>;
    if (error) return <div className="error-state">Lỗi: {error}</div>;

    return (
        <div className="product-page-wrapper">
            {/* PHẦN 1: FLASH SALE */}
            <div className="flash-sale-section">
                <div className="container">
                    <div className="flash-sale-header">
                        <h2 className="flash-sale-title">FLASH SALE</h2>
                        <span className="flash-sale-text">Thời gian kết thúc:</span>
                        <FlashSaleTimer />
                    </div>
                    <div className="flash-sale-grid">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={`flash-${product.id}`} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* PHẦN 2: DANH MỤC SẢN PHẨM */}
            <div className="container">
                {categories.length > 0 && (
                    <aside className="product-list-sidebar horizontal-mode" aria-label="Lọc theo danh mục">
                        <h2 className="product-list-sidebar__title">DANH MỤC SẢN PHẨM</h2>
                        <ul className="product-list-sidebar__list">
                            <li>
                                <button
                                    type="button"
                                    className={`product-list-sidebar__btn${selectedCategoryId == null ? ' product-list-sidebar__btn--active' : ''}`}
                                    onClick={() => handleCategoryChange(null)}
                                >
                                    Tất cả
                                </button>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        type="button"
                                        className={`product-list-sidebar__btn${selectedCategoryId === cat.id ? ' product-list-sidebar__btn--active' : ''}`}
                                        onClick={() => handleCategoryChange(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>
                )}
            </div>

            {/* PHẦN 3: XU HƯỚNG MUA SẮM */}
            <div className="trending-section container">
                <div className="trending-header">
                    <h3 className="trending-title">SẢN PHẨM</h3>
                </div>
                <div className="trending-content">
                    {filteredProducts.length === 0 ? (
                        <p className="empty-state">Không có sản phẩm trong danh mục này.</p>
                    ) : (
                        <div className="trending-grid">
                            {visibleProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    {filteredProducts.length > PRODUCTS_PER_PAGE && filteredProducts.length > 0 && (
                        <div className="pagination-wrapper">
                            <button type="button" className="pagination-btn" onClick={goPrev} disabled={safePage <= 1}>
                                ← Trang trước
                            </button>
                            <span className="pagination-info">Trang {safePage} / {totalPages}</span>
                            <button type="button" className="pagination-btn" onClick={goNext} disabled={safePage >= totalPages}>
                                Trang sau →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;