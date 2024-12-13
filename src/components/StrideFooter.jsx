import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthToken';
import { Link, useNavigate } from "react-router-dom";

const StrideFooter = () => {
    const { isLoggedIn } = useContext(AuthContext);
  return (
    <footer className="footer_area clearfix mt-15">
        <div className="container">
            <div className="row align-items-center">
                
                <div className="col-12 col-lg-4">
                    <div className="single_widget_area">                        
                        <div className="footer-logo mr-50">
                         <Link to="/home"><img src="img/core-img/logo2.png" alt=""/></Link>
                        </div>
                        <p className="copywrite"> Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i className="fa fa-heart-o" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a> & Re-distributed by <a href="https://themewagon.com/" target="_blank">Themewagon</a></p>
                    </div>
                </div>
                
                <div className="col-12 col-lg-8">
                    <div className="single_widget_area">
                        
                        <div className="footer_menu">
                            <nav className="navbar navbar-expand-lg justify-content-end">
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#footerNavContent" aria-controls="footerNavContent" aria-expanded="false" aria-label="Toggle navigation"><i className="fa fa-bars"></i></button>
                                <div className="collapse navbar-collapse" id="footerNavContent">
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item active">
                                            <Link to="/home" className="nav-link">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/shop" className="nav-link">Shop</Link>
                                        </li>
                                        {isLoggedIn && (
                                            <>
                                            <li className="nav-item">
                                                <Link to="/cart" className="nav-link">Cart</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/checkout" className="nav-link">Checkout</Link>
                                            </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default StrideFooter;