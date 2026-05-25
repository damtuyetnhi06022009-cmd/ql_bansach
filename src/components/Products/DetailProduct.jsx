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
        if (product) return;

        const fetchProduct = async () => {
            try {
                const response = await fetch('/product.json');
                if (!response.ok) {
                    throw new Error('Không thể tải thông tin sản phẩm');
                }

                const data = await response.json();
                const found = data.find((item) => String(item.id) === String(id));

                if (!found) {
                    throw new Error('sản phẩm không tồn tại');
                }

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
    }, [id, product]);

    if (isLoading) {
        return <div className="detail-container">Đang tải chi tiết sản phẩm..</div>;
    }

    if (error) {
        return <div className="detail-container">Lỗi: {error}</div>;
    }

    if (!product) {
        return null;
    }

    return (
        <div className="detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>

            <div className="detail-card">
                <div className="detail-image">
                    <img
                        src={product.imageKey || 'https://via.placeholder.com/500x350'}
                        alt={product.name}
                    />
                </div>

                <div className="detail-info">
                    <h2>{product.name}</h2>
                    <p className="detail-price">
                        <span className="current-price">{product.currentPrice}</span>
                        {product.originalPrice && (<span className="original-price">{product.originalPrice}</span>)}
                        {product.discount && <span className="discount">{product.discount}</span>}
                    </p>

                    <div className="detail-info-container">
                        <div className="info-row">
                            <span className="info-label">Tác giả:</span>
                            <span className="info-value author-tag">{product.author}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Nhà xuất bản:</span>
                            <span className="info-value publisher-tag">{product.publisher}</span>
                        </div>
                        <div className="info-description">
                            <h4 className="description-title">Mô tả sản phẩm:</h4>
                            <p className="description-text">{product.description}</p>
                        </div>
                    </div>

                    <div className="detail-meta">
                        {product.rating && <span>⭐ {product.rating}</span>}
                        {product.sold && <span>Đã Bán {product.sold}</span>}
                    </div>

                    <button className="buy-now-button" onClick={() => {
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

                        navigate('/cart');
                    }}>
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;