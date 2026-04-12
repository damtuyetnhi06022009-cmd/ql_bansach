import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="novela-modern-footer">
            {/* Hiệu ứng dải màu trang trí phía trên */}
            <div className="footer-gradient-line"></div>

            <div className="footer-container">
                <div className="footer-main-grid">
                    
                    {/* Cột 1: Thương hiệu & Giới thiệu */}
                    <div className="footer-brand-section">
                        <img src={logo} alt="Novela Logo" className="footer-logo-modern" />
                        <p className="footer-tagline">
                            Khám phá thế giới tri thức qua từng trang sách. Novela đồng hành cùng bạn trên hành trình chinh phục đam mê.
                        </p>
                        <div className="footer-social-glass">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                            <a href="#"><i className="fab fa-tiktok"></i></a>
                        </div>
                    </div>

                    {/* Cột 2: Danh mục */}
                    <div className="footer-nav-group">
                        <h4 className="footer-heading">Khám Phá</h4>
                        <ul className="footer-list">
                            <li><a href="/about">Giới thiệu Novela</a></li>
                            <li><a href="/services">Dịch vụ hội viên</a></li>
                            <li><a href="/news">Tin tức mới nhất</a></li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ */}
                    <div className="footer-nav-group">
                        <h4 className="footer-heading">Hỗ Trợ</h4>
                        <ul className="footer-list">
                            <li><a href="/shipping">Chính sách vận chuyển</a></li>
                            <li><a href="/return">Đổi trả & Bảo hành</a></li>
                            <li><a href="/privacy">Bảo mật thông tin</a></li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên hệ & Newsletter */}
                    <div className="footer-contact-section">
                        <h4 className="footer-heading">Liên Hệ</h4>
                        <div className="contact-info">
                            <p><i className="fas fa-map-marker-alt"></i> 60-62 Lê Lợi, Q.1, TP. HCM</p>
                            <p><i className="fas fa-envelope"></i> cskh@novela.com.vn</p>
                            <p><i className="fas fa-phone-alt"></i> 0965 441 669</p>
                        </div>
                    </div>
                </div>

                {/* Phần bản đồ thu nhỏ cách điệu */}
                <div className="footer-bottom-bar">
                    <p className="copyright-text">© 2026 <span>Novela</span>. Thiết kế bởi 26SPIT3.</p>
                    <div className="footer-bottom-links">
                        <a href="/terms">Điều khoản</a>
                        <span className="separator">|</span>
                        <a href="/sitemap">Sơ đồ web</a>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <button className="floating-chat-btn">
                <i className="fas fa-paper-plane"></i>
            </button>
        </footer>
    );
};

export default Footer;