import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageMap } from '../../utils/productImages';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
            setSelectedItems(parsedCart.map(item => item.id));
        }
    }, []);

    const updateCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const increaseQuantity = (productId) => {
        const updatedCart = cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        updateCart(updatedCart);
    };

    const decreaseQuantity = (productId) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === productId) {
                if (item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                } else {
                    setSelectedItems(selectedItems.filter(id => id !== productId));
                    return null; 
                }
            }
            return item;
        }).filter(Boolean);
        updateCart(updatedCart);
    };

    const removeItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        updateCart(updatedCart);
        setSelectedItems(selectedItems.filter(id => id !== productId));
    };

    const handleToggleItem = (productId) => {
        if (selectedItems.includes(productId)) {
            setSelectedItems(selectedItems.filter(id => id !== productId));
        } else {
            setSelectedItems([...selectedItems, productId]);
        }
    };

    const handleToggleAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.id));
        }
    };

    // TỐI ƯU HÀM TÍNH TỔNG TIỀN
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            // Nếu sản phẩm không được tích chọn thì bỏ qua không cộng tiền
            if (!selectedItems.includes(item.id)) return total;
            
            // Đề phòng trường hợp object sản phẩm dùng thuộc tính 'price' thay vì 'currentPrice'
            const rawPrice = item.currentPrice || item.price || 0;
            
            const price = typeof rawPrice === 'string' 
                ? parseFloat(rawPrice.replace(/[^\d]/g, '')) 
                : parseFloat(rawPrice) || 0;
                
            return total + (price * item.quantity);
        }, 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <div className="cart-empty">
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
                    <button className="continue-shopping-btn" onClick={() => navigate('/')}>
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <div className="cart-inner-container">
                
                <h1 className="cart-main-title">
                    GIỎ HÀNG <span className="title-count">({cartItems.length} sản phẩm)</span>
                </h1>

                <div className="cart-layout-container">
                    {/* KHU VỰC BÊN TRÁI: DANH SÁCH SẢN PHẨM */}
                    <div className="cart-left-section">
                        <div className="cart-select-all-bar">
                            <label className="checkbox-container">
                                <input 
                                    type="checkbox" 
                                    checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                                    onChange={handleToggleAll}
                                />
                                <span className="checkbox-text">Chọn tất cả ({cartItems.length} sản phẩm)</span>
                            </label>
                            <div className="bar-right-labels">
                                <span className="label-qty">Số lượng</span>
                                <span className="label-price">Giá tiền</span>
                            </div>
                        </div>

                        <div className="cart-items-list">
                            {cartItems.map((item) => {
                                const rawPrice = item.currentPrice || item.price || 0;
                                const price = typeof rawPrice === 'string' 
                                    ? parseFloat(rawPrice.replace(/[^\d]/g, '')) 
                                    : parseFloat(rawPrice) || 0;
                                const itemTotal = price * item.quantity;
                                const isChecked = selectedItems.includes(item.id);

                                return (
                                    <div key={item.id} className="cart-item-card">
                                        <div className="card-left-info">
                                            <input 
                                                type="checkbox" 
                                                className="item-checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleItem(item.id)}
                                            />
                                            <div className="item-image-box">
                                                <img
                                                    src={imageMap[item.imageKey] || item.image || 'https://via.placeholder.com/150'}
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div className="item-text-details">
                                                <h3 className="item-name-heading">{item.name}</h3>
                                                <p className="item-unit-price">{formatPrice(price)}</p>
                                            </div>
                                        </div>

                                        <div className="card-right-actions">
                                            {/* Bộ tăng giảm số lượng hình tam giác lật ngang */}
                                            <div className="custom-quantity-picker">
                                                <button className="qty-btn" onClick={() => decreaseQuantity(item.id)}> ◀ </button>
                                                <span className="qty-number">{item.quantity}</span>
                                                <button className="qty-btn" onClick={() => increaseQuantity(item.id)}> ▶ </button>
                                            </div>

                                            {/* Tổng giá tiền sản phẩm hiển thị màu đỏ đậm */}
                                            <span className="item-total-red-text">{formatPrice(itemTotal)}</span>

                                            {/* Icon thùng rác xóa sản phẩm */}
                                            <button className="trash-delete-btn" onClick={() => removeItem(item.id)} title="Xóa sản phẩm">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* KHU VỰC BÊN PHẢI: KHỐI TỔNG TIỀN */}
                    <div className="cart-right-section">
                        <div className="total-summary-box">
                            <div className="summary-row-top">
                                <span className="summary-label-text">Tổng số tiền</span>
                                <span className="summary-total-value-red">{formatPrice(calculateTotal())}</span>
                            </div>
                            <div className="checkout-button-wrapper">
                                <button className="gray-payment-btn">Thanh toán</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;