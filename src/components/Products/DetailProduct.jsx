import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { imageMap } from '../../utils/productImages';
import './DetailProduct.css';

const DetailProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(location.state?.product || null);
    const [isLoading, setIsLoading] = useState(!location.state?.product);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch('/product.json');
                if (!response.ok) throw new Error('Không thể tải thông tin sản phẩm');
                const data = await response.json();
                const found = data.find((item) => String(item.id) === String(id));
                if (!found) throw new Error('Sản phẩm không tồn tại');

                setProduct({
                    ...found,
                    image: imageMap[found.imageKey] || found.image
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Hàm định dạng giá tiền: 120.000 đ
    const formatPrice = (price) => {
        if (!price) return '0 đ';
        const numericPrice = typeof price === 'string' 
            ? parseFloat(price.replace(/[^\d]/g, '')) 
            : parseFloat(price) || 0;
        return new Intl.NumberFormat('vi-VN').format(numericPrice) + ' đ';
    };

    // Hàm xử lý nút mua hàng/thêm vào giỏ
    const handleAddToCart = (shouldNavigate = false) => {
        const savedCart = localStorage.getItem('cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];
        const existingItemIndex = cart.findIndex(item => String(item.id) === String(product.id));
        
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        if (shouldNavigate) {
            navigate('/cart');
        } else {
            alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
        }
    };

    if (isLoading) {
        return <div className="detail-page-wrapper"><div className="detail-inner-container">Đang tải chi tiết sản phẩm..</div></div>;
    }

    if (error) {
        return <div className="detail-page-wrapper"><div className="detail-inner-container">Lỗi: {error}</div></div>;
    }

    if (!product) {
        return null;
    }

    const productImage = product.image || 'https://via.placeholder.com/500x350';
    
    // Xử lý số lượng sao từ JSON (Làm tròn số và đặt fallback là 5 sao nếu rỗng)
    const ratingNumber = Math.round(parseFloat(product.rating)) || 5;

    return (
        <div className="detail-page-wrapper">
            <div className="detail-inner-container">
                
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Quay lại
                </button>

                <div className="detail-card">
                    {/* BÊN TRÁI: CHỈ GIỮ LẠI KHUNG ẢNH CHÍNH */}
                    <div className="detail-image-section">
                        <div className="detail-image">
                            <img src={productImage} alt={product.name} />
                        </div>
                    </div>

                    {/* BÊN PHẢI: THÔNG TIN CHI TIẾT SẢN PHẨM */}
                    <div className="detail-info">
                        <h2 className="product-title-heading">{product.name}</h2>
                        
                        <div className="meta-info-lines">
                            <p className="info-line">
                                Nhà xuất bản: <span className="info-value">{product.publisher}</span>
                            </p>
                            <p className="info-line">
                                Tác giả: <span className="info-value">{product.author}</span>
                            </p>
                        </div>

                        {/* Số sao ★ động theo trường rating từ JSON */}
                        <div className="product-stars-rating">
                            {[...Array(ratingNumber)].map((_, index) => (
                                <span key={index}>★</span>
                            ))}
                        </div>

                        <div className="detail-price-box">
                            <span className="current-price-red">{formatPrice(product.currentPrice || product.price)}</span>
                        </div>

                        <div className="detail-action-buttons">
                            <button className="add-to-cart-button" onClick={() => handleAddToCart(false)}>
                                Thêm vào giỏ hàng
                            </button>
                            <button className="buy-now-button-red" onClick={() => handleAddToCart(true)}>
                                Mua ngay
                            </button>
                        </div>

                        {product.description && (
                            <div className="info-description-box">
                                <h4 className="description-title">Mô tả sản phẩm:</h4>
                                <p className="description-text">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailProduct;