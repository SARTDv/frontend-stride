import React, { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from './AuthToken';

const StrideHeader = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [ options, setOptions ] = useState(false);
  
  return (
    <>
    <div className="mobile-nav">
      <div className="amado-navbar-brand">
        <Link to="/home">
        <img src="img/core-img/logo.png" alt="Logo" />
        </Link>
        </div>
          {/* Navbar Toggler*/}
          <div className="amado-navbar-toggler" onClick={() => setOptions(!options)}>
          <span></span><span></span><span></span>
        </div>
      </div>
      <header className={`header-area clearfix ${options ? 'bp-xs-on' : ''}`}>
      <div className="nav-close" onClick={() => setOptions(false)}>
          <i className="fa fa-close" aria-hidden="true"></i>
        </div>
        {/* Logo */}
        <div className="logo">
          <Link to="/home"><img src="img/core-img/logo.png" alt="Logo" /></Link>
        </div>
        {/* Button Group */}
        {!isLoggedIn && (
              <div className="amado-btn-group mt-15 mb-30">
                <Link to="/login"  state={{ activeLink: "signup" }} className="btn amado-btn mb-15">Sign up</Link>
                <Link to="/login" state={{ activeLink: "signin" }} className="btn amado-btn active">Sign in</Link>                
              </div>
        )}        
        {/* Amado Nav */}
        <nav className="amado-nav">
          <ul>
            <li className="active"><Link to="/home">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            {isLoggedIn && (
                <li><Link to="/checkout">Checkout</Link></li>
            )}
          </ul>
        </nav>
        {/* Cart Menu */}
        <div className="cart-fav-search mb-30">
          {isLoggedIn && (
                <>
                    <Link to="/cart" className="cart-nav">
                        <img src="img/core-img/cart.png" alt="Cart" /> Cart 
                    </Link>
                    <Link to="/MyOrders" className="Acc-nav">
                        <img src="img/core-img/package-open.png" alt="My Orders" /> My Orders
                    </Link>
                    <Link to="/myAccount" className="Acc-nav">
                        <img src="img/core-img/account.png" alt="My Account" /> My Account
                    </Link>
                </>
          )}
        </div>
        {/* Social Button */}
        <div className="social-info d-flex justify-content-between">
          <a>
            <i className="fa fa-pinterest" aria-hidden="true"></i>
          </a>
          <a>
            <i className="fa fa-instagram" aria-hidden="true"></i>
          </a>
          <a>
            <i className="fa fa-facebook" aria-hidden="true"></i>
          </a>
          <a>
            <i className="fa fa-twitter" aria-hidden="true"></i>
          </a>
        </div>
      </header></>
  );
};

export default StrideHeader;
