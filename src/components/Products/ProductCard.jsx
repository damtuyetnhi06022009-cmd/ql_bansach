import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const productsUrl = `${import.meta.env.BASE_URL}product.json`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========================================================
  // HÀM ĐỊNH DẠNG GIÁ TIỀN (Thêm dấu chấm và chữ đ)
  // ========================================================
  const formatPrice = (price) => {
    if (price === undefined || price === null || price === '') return '';
    
    // Ép kiểu về số (loại bỏ ký tự lạ nếu có)
    const num = Number(String(price).replace(/[^0-9]/g, '')); 
    
    // Nếu ép kiểu thất bại (không phải số) thì trả về chuỗi gốc
    if (isNaN(num)) return price; 
    
    // Thêm dấu chấm phân cách theo chuẩn Việt Nam và thêm chữ đ
    return num.toLocaleString('vi-VN') + ' đ'; 
  };

  const handleBuy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(productsUrl);
      if (!response.ok) {
        throw new Error('Không thể tải thông tin sản phẩm');
      }

      const data = await response.json();
      const matchedProduct = data.find((item) => item.id === product.id);
      if (!matchedProduct) {
        throw new Error('Sản phẩm không tồn tại');
      }
      
      navigate(`/product/${product.id}`, {
        state: { product: { ...matchedProduct, imageKey: product.imageKey } }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="product-image"
        />
      </div>
      <h3 className="product-name">{product.name}</h3>

      <div className="product-pricing">
        {/* SỬA: Đã bọc hàm formatPrice để tự động thêm dấu chấm */}
        <span className="current-price">
          {formatPrice(product.currentPrice)}
        </span>
        <div className="original-price-section">
          {product.originalPrice && (
            <span className="original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}          
          {product.discount && <span className="discount">{product.discount}</span>}
        </div>
      </div>

      <div className="product-rating-sales">
        <span className="rating">★ {product.rating}</span>
        <span className="sales">Đã bán {product.sold}</span>
      </div>

      <button className="compare-button" onClick={handleBuy} disabled={isLoading}>
        {isLoading ? 'Đang mở...' : 'Mua'}
      </button>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

export default ProductCard;