import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="cyber-footer">
            {/* Hiệu ứng quét laser trang trí */}
            <div className="cyber-scanline"></div>
            
            <div className="cyber-container">
                <div className="cyber-grid">
                    {/* Cột chính với logo phát sáng */}
                    <div className="cyber-brand">
                        <div className="logo-glitch-container">
                            <img src={logo} alt="Novela" className="cyber-logo" />
                        </div>
                        <p className="cyber-desc">
                            Hệ thống cung cấp tri thức thế hệ mới. Trải nghiệm đọc sách trong không gian số 4.0.
                        </p>
                        <div className="cyber-social-icons">
                            <a href="#" className="cyber-icon-link"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="cyber-icon-link"><i className="fab fa-discord"></i></a>
                            <a href="#" className="cyber-icon-link"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>

                    {/* Cột danh mục với hiệu ứng gạch đầu dòng neon */}
                    <div className="cyber-nav">
                        <h4 className="cyber-title" data-text="DANH MỤC">DANH MỤC</h4>
                        <ul className="cyber-links">
                            <li><a href="#">Kho Sách Số</a></li>
                            <li><a href="#">Sách Bản Quyền</a></li>
                            <li><a href="#">Tác Giả Nổi Bật</a></li>
                        </ul>
                    </div>

                    <div className="cyber-nav">
                        <h4 className="cyber-title" data-text="GIAO DỊCH">GIAO DỊCH</h4>
                        <ul className="cyber-links">
                            <li><a href="#">Lịch Sử Đơn Hàng</a></li>
                            <li><a href="#">Ví Novela</a></li>
                            <li><a href="#">Trung Tâm Hỗ Trợ</a></li>
                        </ul>
                    </div>

                    {/* Cột liên hệ với khung viền cắt góc */}
                    <div className="cyber-contact-box">
                        <div className="contact-inner">
                            <h4 className="cyber-title">LIÊN HỆ</h4>
                            <p><i className="fas fa-microchip"></i> Server: Ho Chi Minh City</p>
                            <p><i className="fas fa-terminal"></i> cskh@novela.com.vn</p>
                            <p className="cyber-status"><span className="status-dot"></span> Online</p>
                        </div>
                    </div>
                </div>

                <div className="cyber-bottom">
                    <div className="cyber-copyright">
                        DESIGNED BY <span className="highlight">26SPIT3</span> // VERSION 4.0.1
                    </div>
                    <div className="cyber-timestamp">
                        © 2026 NOVELA_PROJECT
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;