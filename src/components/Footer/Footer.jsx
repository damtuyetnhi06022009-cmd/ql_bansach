import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png'; 
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="novela-footer">
            <div className="footer-content">
                
                {/* --- CỘT 1: DỊCH VỤ --- */}
                <div className="footer-column">
                    <h3 className="footer-title">DỊCH VỤ</h3>
                    <ul className="footer-links">
                        <li><a href="/origin">Điều khoản sử dụng</a></li>
                        <li><a href="/services">Chính sách bảo mật thông tin cá nhân</a></li>
                        <li><a href="/services">Chính sách bảo mật thanh toán</a></li>
                        <li><a href="/careers">Giới thiệu Novela</a></li>
                    </ul>
                    <div className="footer-contact">
                        <h3 className="footer-title">LIÊN HỆ</h3>
                        <p><i className="fas fa-map-marker-alt"></i> 60-62 Lê Lợi, Q.1, TP. HCM</p>
                    </div>
                </div>

                {/* --- CỘT 2: HỖ TRỢ --- */}
                <div className="footer-column">
                    <h3 className="footer-title">HỖ TRỢ</h3>
                    <ul className="footer-links">
                        <li><a href="/find-store">Chính sách đổi - trả - hoàn tiền</a></li>
                        <li><a href="/find-store">Chính sách bảo hành</a></li>
                        <li><a href="/find-store">Chính sách vận chuyển</a></li>
                    </ul>
                    <div className="footer-hotline">
                        <i className="fas fa-phone-alt"></i>
                        <span>1900234567</span>
                    </div>
                </div>

                {/* --- CỘT 3: TÀI KHOẢN CỦA TÔI --- */}
                <div className="footer-column">
                    <h3 className="footer-title">TÀI KHOẢN CỦA TÔI</h3>
                    <ul className="footer-links">
                        <li><a href="/find-store">Đăng nhập/tạo tài khoản mới</a></li>
                        <li><a href="/find-store">Thay đổi địa chỉ khách hàng</a></li>
                        <li><a href="/find-store">Chi tiết tài khoản</a></li>
                        <li><a href="/find-store">Lịch sử mua hàng</a></li>
                    </ul>
                    <div className="footer-social-icons">
                        <a href="https://facebook.com" aria-label="Facebook">
                            <i className="fab fa-facebook-square"></i>
                        </a>
                        <a href="https://instagram.com" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://youtube.com" aria-label="YouTube">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://pinterest.com" aria-label="Pinterest">
                            <i className="fab fa-pinterest"></i>
                        </a>
                    </div>
                </div>
                
            </div>
        </footer>
    );
};

export default Footer;