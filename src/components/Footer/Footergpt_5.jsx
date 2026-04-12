import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="retro-footer">
            <div className="footer-ornament-top">
                <span className="ornament-line"></span>
                <i className="fas fa-feather-alt"></i>
                <span className="ornament-line"></span>
            </div>

            <div className="footer-retro-container">
                <div className="footer-retro-grid">
                    {/* Cột 1: Câu trích dẫn & Thương hiệu */}
                    <div className="retro-column brand-column">
                        <img src={logo} alt="Novela Logo" className="retro-logo" />
                        <blockquote className="retro-quote">
                            "Một cuốn sách hay cho ta một người bạn tốt, một thư viện lớn cho ta một kho tàng."
                        </blockquote>
                    </div>

                    {/* Cột 2: Danh mục cổ điển */}
                    <div className="retro-column">
                        <h4 className="retro-title">LƯU TRỮ</h4>
                        <nav className="retro-nav">
                            <a href="#">Bản Thảo Cổ</a>
                            <a href="#">Sách Hiếm</a>
                            <a href="#">Bộ Sưu Tập</a>
                            <a href="#">Tác Giả</a>
                        </nav>
                    </div>

                    {/* Cột 3: Thông tin hữu ích */}
                    <div className="retro-column">
                        <h4 className="retro-title">CHỈ DẪN</h4>
                        <nav className="retro-nav">
                            <a href="#">Giao Nhận</a>
                            <a href="#">Hoàn Trả</a>
                            <a href="#">Bảo Mật</a>
                            <a href="#">Câu Hỏi Thường Gặp</a>
                        </nav>
                    </div>

                    {/* Cột 4: Liên hệ truyền thống */}
                    <div className="retro-column contact-column">
                        <h4 className="retro-title">LIÊN LẠC</h4>
                        <p className="retro-contact-item">
                            <i className="fas fa-map-marker-alt"></i> 60-62 Lê Lợi, Q.1
                        </p>
                        <p className="retro-contact-item">
                            <i className="fas fa-paper-plane"></i> cskh@novela.com.vn
                        </p>
                        <div className="retro-socials">
                            <a href="#"><i className="fab fa-facebook"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-pinterest"></i></a>
                        </div>
                    </div>
                </div>

                <div className="footer-retro-bottom">
                    <p className="retro-copyright">
                        Thành lập năm 2025 — Được thiết kế bởi 26SPIT3
                    </p>
                    <p className="retro-motto">Sapiens Qui Vigilat</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;