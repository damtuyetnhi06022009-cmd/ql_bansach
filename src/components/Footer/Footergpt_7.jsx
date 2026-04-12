import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="zen-footer">
            <div className="zen-container">
                <div className="zen-top-content">
                    {/* Cột 1: Triết lý thương hiệu */}
                    <div className="zen-brand">
                        <img src={logo} alt="Novela" className="zen-logo-img" />
                        <p className="zen-philosophy">
                            "Đọc một cuốn sách, gieo một mầm tâm hồn."
                        </p>
                        <div className="zen-social-minimal">
                            <a href="#">FB</a>
                            <a href="#">IG</a>
                            <a href="#">PT</a>
                        </div>
                    </div>

                    {/* Cột 2 & 3: Navigation dạng thanh mảnh */}
                    <div className="zen-nav-grid">
                        <div className="zen-nav-col">
                            <span className="zen-nav-label">THƯ VIỆN</span>
                            <a href="#">Sách Mới</a>
                            <a href="#">Văn Học Nhật</a>
                            <a href="#">Tản Văn</a>
                        </div>
                        <div className="zen-nav-col">
                            <span className="zen-nav-label">DỊCH VỤ</span>
                            <a href="#">Vận Chuyển</a>
                            <a href="#">Đổi Trả</a>
                            <a href="#">Liên Hệ</a>
                        </div>
                    </div>

                    {/* Cột 4: Thông tin địa chỉ kiểu dọc */}
                    <div className="zen-address">
                        <p>60-62 LÊ LỢI, QUẬN 1</p>
                        <p>THÀNH PHỐ HỒ CHÍ MINH</p>
                        <p className="zen-mail">CSKH@NOVELA.VN</p>
                    </div>
                </div>

                <div className="zen-bottom-bar">
                    <div className="zen-line"></div>
                    <div className="zen-copyright-wrapper">
                        <p className="zen-copyright">© 2026 NOVELA — 26SPIT3</p>
                        <div className="zen-lang-selector">
                            <span>VN</span> / <span>EN</span> / <span>JP</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Họa tiết vòng tròn Zen ẩn hiện phía sau */}
            <div className="zen-circle-bg"></div>
        </footer>
    );
};

export default Footer;