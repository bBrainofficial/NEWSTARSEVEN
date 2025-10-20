import React, { Fragment, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";

import LayoutOne from "../../layouts/LayoutOne";
import {
  addToCart,
  deleteAllFromCart,
  deleteFromCart,
  updateQuantity,
  getCartItems
} from "../../redux/actions/cartActions";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
// !DEL
const Cart = ({
  location,
  deleteAllFromCart,
  strings,
  currentLanguageCode,
  cartItems,
}) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (localStorage.getItem("authToken")) {
      // Initial fetch
      dispatch(getCartItems());

      const interval = setInterval(() => {
        dispatch(getCartItems());
      }, 30000); // Adjust the interval as needed

      return () => clearInterval(interval);
    }
  }, [dispatch]); 
  const cartTotalPrice = cartItems?.items?.reduce((total, item) => {
    const qty = item.pivot?.qty || item.qty || 1; // Safely fallback to 0 if qty is undefined
    return total + (item?.price - (item?.price * item?.discount) / 100) * qty;
  }, 0);

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["StarSeven"]} | {strings["CART_Title"]}
        </title>
        <meta
          name="description"
          content="Cart page of StarSeven react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["CART_HOME"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["CART_Title"]}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems?.items?.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">
                  {strings["CART_PAGE_TITLE"]}
                </h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>{strings["CART_TABLE_IMAGE"]}</th>
                            <th>{strings["CART_TABLE_PRODUCT_NAME"]}</th>
                            <th>{strings["CART_TABLE_UNIT_PRICE"]}</th>
                            <th>{strings["CART_TABLE_QTY"]}</th>
                            <th>{strings["CART_TABLE_SUBTOTAL"]}</th>
                            <th>{strings["CART_TABLE_ACTION"]}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems?.items?.map((cartItem) => (
                            <TR
                              cartItem={cartItem}
                              key={cartItem.id}
                              currentLanguageCode={currentLanguageCode}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to={process.env.PUBLIC_URL + "/shop"}>
                          {strings["CART_CONTINUE_SHOPPING"]}
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => deleteAllFromCart(addToast)}>
                          {strings["CART_CLEAR_CART"]}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {/* <div className="col-lg-4 col-md-6">
                    <div className="cart-tax">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Estimate Shipping And Tax
                        </h4>
                      </div>
                      <div className="tax-wrapper">
                        <p>
                          Enter your destination to get a shipping estimate.
                        </p>
                        <div className="tax-select-wrapper">
                          <div className="tax-select">
                            <label>* Country</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Region / State</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Zip/Postal Code</label>
                            <input type="text" />
                          </div>
                          <button className="cart-btn-2" type="submit">
                            Get A Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Use Coupon Code
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Enter your coupon code if you have one.</p>
                        <form>
                          <input type="text" required name="name" />
                          <button className="cart-btn-2" type="submit">
                            Apply Coupon
                          </button>
                        </form>
                      </div>
                    </div>
                  </div> */}

                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          {strings["CART_GRAND_TOTAL"]}
                        </h4>
                      </div>
                      {/* <h5>
                        {strings["CART_TOTAL_PRODUCTS"]}{" "}
                        <span>{cartTotalPrice.toFixed(2)}</span>
                      </h5> */}

                      <h4 className="grand-totall-title">
                        {strings["CART_GRAND_TOTAL"]}{" "}
                        <span>{cartTotalPrice.toFixed(2)}</span>
                      </h4>
                      <Link to={process.env.PUBLIC_URL + "/checkout"}>
                        {strings["CART_PROCEED_TO_CHECKOUT"]}
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {strings["CART_EMPTY_TITLE"]} <br />
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        {strings["CART_EMPTY_BUTTON"]}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    updateQuantity: (item, addToast, quantityCount) => {
      dispatch(updateQuantity(item, addToast, quantityCount));
    },
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
    deleteAllFromCart: (addToast) => {
      dispatch(deleteAllFromCart(addToast));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(Cart));

const TR = ({ cartItem, currentLanguageCode }) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const discountPercentage =
    cartItem?.price - (cartItem?.price * cartItem?.discount) / 100;
  const [qty, setQty] = useState(cartItem.pivot?.qty || cartItem?.qty || 1);
  const itemTotalPrice = discountPercentage * qty;
  return (
    <tr key={cartItem.id}>
      <td className="product-thumbnail">
        <Link to={process.env.PUBLIC_URL + "/product/" + cartItem.id}>
          <img
            className="img-fluid"
            src={cartItem.image_path}
            alt={cartItem.name}
            width={110}
            height={140}
          />
        </Link>
      </td>

      <td className="product-name">
        <Link to={process.env.PUBLIC_URL + "/product/" + cartItem.id}>
          {currentLanguageCode === "ar"
            ? cartItem.translations[0]?.name
            : cartItem.translations[1]?.name}
        </Link>
      </td>

      <td className="product-price-cart">
        {cartItem.price ? (
          <div className="product-img-badges">
            <span className="pink" style={{ color: "#FFF" }}>
              {cartItem.price}
            </span>
          </div>
        ) : (
          ""
        )}
      </td>

      <td className="product-quantity">
        <div className="cart-plus-minus">
          <button
            className="dec qtybutton"
            onClick={() => {
              setQty(qty - 1);
              dispatch(updateQuantity(cartItem, addToast, qty));
            }} // Directly increment the quantity
            disabled={qty <= 1} // Disable if quantity is 1 or less
          >
            -
          </button>
          <input
            type="text"
            className="cart-plus-minus-box"
            value={qty}
            readOnly
          />
          <button
            className="inc qtybutton"
            onClick={() => {
              setQty(qty + 1);
              dispatch(updateQuantity(cartItem, addToast, qty));
            }}
            disabled={!cartItem.is_available}
          >
            +
          </button>
        </div>
      </td>
      <td className="product-subtotal">
        {itemTotalPrice.toFixed(2)}
        <br />
        <span className="purple">-{cartItem.discount}%</span>
      </td>

      <td className="product-remove">
        <button onClick={() => dispatch(deleteFromCart(cartItem, addToast))}>
          <i className="fa fa-times"></i>
        </button>
      </td>
    </tr>
  );
};
