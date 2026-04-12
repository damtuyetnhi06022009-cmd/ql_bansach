import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="gatsby-footer">
            {/* Họa tiết Art Deco chạy ngang */}
            <div className="deco-border-top"></div>

            <div className="gatsby-container">
                <div className="gatsby-main-content">
                    {/* Cột giữa: Logo trung tâm */}
                    <div className="gatsby-brand">
                        <div className="deco-frame">
                            <img src={logo} alt="Novela" className="gatsby-logo" />
                        </div>
                        <h2 className="gatsby-site-name">NOVELA</h2>
                        <p className="gatsby-subtitle">ELITE BOOKSTORE</p>
                    </div>

                    <div className="gatsby-grid">
                        <div className="gatsby-col">
                            <h4>BỘ SƯU TẬP</h4>
                            <a href="#">Sách Đặc Biệt</a>
                            <a href="#">Tác Phẩm Kinh Điển</a>
                            <a href="#">Ấn Bản Giới Hạn</a>
                        </div>
                        
                        <div className="gatsby-col">
                            <h4>QUY ĐỊNH</h4>
                            <a href="#">Đặc Quyền Thành Viên</a>
                            <a href="#">Chính Sách Giao Nhận</a>
                            <a href="#">Bảo Mật Tuyệt Đối</a>
                        </div>

                        <div className="gatsby-col">
                            <h4>LIÊN KẾT</h4>
                            <div className="gatsby-socials">
                                <a href="#"><i className="fab fa-facebook-f"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                                <a href="#"><i className="fab fa-pinterest-p"></i></a>
                            </div>
                            <p className="gatsby-phone">0965 441 669</p>
                        </div>
                    </div>
                </div>

                <div className="gatsby-bottom">
                    <div className="deco-line"></div>
                    <p className="gatsby-copyright">
                        EST. 2025 — CURATED BY 26SPIT3
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;