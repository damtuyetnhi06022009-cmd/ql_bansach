import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="highlands-footer">
            {/* Green strip at the top */}
            <div className="footer-green-strip"></div>

            <div className="footer-content">
                {/* Left Section: Logo and Copyright */}
                <div className="footer-left">
                    <div className="footer-logo">
                        <img src={logo} alt="Highlands Coffee" className="footer-logo-img" />
                    </div>
                    <p className="footer-copyright">
                        ©2025 Novela. All rights reserved
                    </p>
                </div>

                {/* Middle Section: Navigation Links */}
                <div className="footer-middle">
                    {/* Column 1: VỀ GALAXYCAFE */}
                    <div className="footer-column">
                        <h3 className="footer-column-title">DỊCH VỤ</h3>
                        <ul className="footer-links">
                            <li><a href="/origin">Điều khoản sử dụng</a></li>
                            <li><a href="/services">Chính sách bảo mật thông tin</a></li>
                            <li><a href="/careers">Giới thiệu Novela</a></li>
                        </ul>
                    </div>

                    {/* Column 2: HỆ THỐNG CỬA HÀNG */}
                    <div className="footer-column">
                        <h3 className="footer-column-title">HỖ TRỢ</h3>
                        <ul className="footer-links">
                            <li>
                                <a href="/find-store">Chính sách đổi - trả</a>
                                <br />
                                <a href="/find-store">Chính sách bảo hành</a>
                                <br />
                                <a href="/find-store">Chính sách vận chuyển</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: TIN TỨC */}
                    <div className="footer-column">
                        <h3 className="footer-column-title">LIÊN HỆ</h3>
                        <ul className="footer-links">
                             <li>
                                <a href="/find-store"> 60-62 Lê Lợi, Q.1, TP. HCM</a>
                                <br />
                                <a href="/find-store"> cskh@novela.com.vn</a>
                                <br />
                                <a href="/find-store"> 0965441669</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Section: Social Media */}
                <div className="footer-right">
                    <h3 className="footer-column-title">THEO DÕI CHÚNG TÔI</h3>
                    <div className="footer-social-icons">
                        <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://youtube.com" className="social-icon" aria-label="YouTube">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://tiktok.com" className="social-icon" aria-label="TikTok">
                            <i className="fab fa-tiktok"></i>
                        </a>
                    </div>

                    <div className="footer-map">
                        <iframe
                            title="Bản đồ địa điểm Galaxy Cafe"
                            className="footer-map__iframe"
                            src="https://www.google.com/maps?q=10.743902,106.6340446&z=17&output=embed&hl=vi"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                        <a 
                            className="footer-map__link"
                            href="https://maps.app.goo.gl/6RuUrqKaYFSpPe57"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Mở trong Google Maps
                        </a>
                    </div>
                </div>
            </div>

            {/* Chat Icon */}
            <div className="footer-chat-icon" title="Chat với chúng tôi">
                <i className="fas fa-comment-dots"></i>
            </div>
        </footer>
    );
};

export default Footer;