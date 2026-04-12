import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="magazine-footer">
            <div className="magazine-top-row">
                <h1 className="huge-footer-text">NOVELA</h1>
                <div className="magazine-brand-info">
                    <img src={logo} alt="Novela" className="magazine-logo" />
                    <p>Hệ sinh thái tri thức số được xây dựng bởi tâm huyết của người Việt.</p>
                </div>
            </div>

            <div className="magazine-middle-row">
                <div className="magazine-column">
                    <span className="magazine-label">MỤC LỤC</span>
                    <ul className="magazine-nav">
                        <li><a href="#">TRANG CHỦ</a></li>
                        <li><a href="#">DANH MỤC SÁCH</a></li>
                        <li><a href="#">BÀI VIẾT MỚI</a></li>
                        <li><a href="#">SÁCH BÁN CHẠY</a></li>
                    </ul>
                </div>

                <div className="magazine-column">
                    <span className="magazine-label">PHÁP LÝ</span>
                    <ul className="magazine-nav">
                        <li><a href="#">ĐIỀU KHOẢN</a></li>
                        <li><a href="#">BẢO MẬT</a></li>
                        <li><a href="#">VẬN CHUYỂN</a></li>
                        <li><a href="#">THANH TOÁN</a></li>
                    </ul>
                </div>

                <div className="magazine-column">
                    <span className="magazine-label">LIÊN HỆ</span>
                    <div className="magazine-contact">
                        <p>60-62 LÊ LỢI, QUẬN 1, TP. HCM</p>
                        <p>0965.441.669</p>
                        <p className="magazine-email">INFO@NOVELA.VN</p>
                    </div>
                </div>

                <div className="magazine-column social-column">
                    <span className="magazine-label">THEO DÕI</span>
                    <div className="magazine-social-links">
                        <a href="#">FACEBOOK</a>
                        <a href="#">INSTAGRAM</a>
                        <a href="#">PINTEREST</a>
                    </div>
                </div>
            </div>

            <div className="magazine-bottom-row">
                <div className="magazine-credits">
                    DESIGNED BY <span className="designer-name">26SPIT3</span>
                </div>
                <div className="magazine-year">
                    EST. 2026 // ALL RIGHTS RESERVED
                </div>
            </div>
        </footer>
    );
};

export default Footer;