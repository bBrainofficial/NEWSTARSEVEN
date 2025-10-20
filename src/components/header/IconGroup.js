import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteFromCart, getCartItems } from "../../redux/actions/cartActions";
import { getWishlist } from "../../redux/actions/wishlistActions";
import MenuCart from "./sub-components/MenuCart";
import { multilanguage } from "redux-multilanguage";
const IconGroup = ({
  cartData,
  wishlistData,
  deleteFromCart,
  iconWhiteClass,
  userPoints,
  strings
}) => {
  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector("#offcanvas-mobile-menu");
    offcanvasMobileMenu.classList.add("active");
  };

  return (
    <div className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ""}`}>
      {/* User account icon with user points */}
      <div className="same-style header-user" style={{ display: "flex", alignItems: "center" }}>
        <Link
          to={
            process.env.PUBLIC_URL +
            `${
              localStorage.getItem("authToken")
                ? "/my-account"
                : "/login-register"
            }`
          }
        >
          <i className="pe-7s-user-female"  />
        </Link>
        <span
          className="user-points"
          style={{
            marginLeft: "8px",
             
        
            fontSize: "14px",
          }}
        >
          {`${strings['points']}: ${userPoints}`}
        </span>
      </div>

      {/* Wishlist */}
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like"  />
          <span className="count-style">
            {wishlistData && wishlistData.length ? wishlistData.length : 0}
          </span>
        </Link>
      </div>

      {/* Cart (Desktop) */}
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-shopbag"  />
          <span className="count-style">
            {cartData?.items?.length ? cartData.items.length : 0}
          </span>
        </button>
        {/* Menu cart */}
        <MenuCart cartData={cartData} deleteFromCart={deleteFromCart} />
      </div>

      {/* Cart (Mobile) */}
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag"  />
          <span className="count-style">
            {cartData?.items?.length ? cartData.items.length : 0}
          </span>
        </Link>
      </div>

      {/* Mobile Off Canvas Menu */}
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button className="mobile-aside-button" onClick={triggerMobileMenu}>
          <i className="pe-7s-menu"  />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  cartData: PropTypes.object,
  wishlistData: PropTypes.array,
  deleteFromCart: PropTypes.func,
  iconWhiteClass: PropTypes.string,
  userPoints: PropTypes.number,
};

const mapStateToProps = (state) => ({
  cartData: state.cartData,
  wishlistData: state.wishlistData,
});

const mapDispatchToProps = (dispatch) => ({
  deleteFromCart: (item, addToast) => dispatch(deleteFromCart(item, addToast)),
  getWishlist: () => dispatch(getWishlist()),
  getCartItems: () => dispatch(getCartItems()),
});

export default connect(mapStateToProps, mapDispatchToProps)(multilanguage(IconGroup));
