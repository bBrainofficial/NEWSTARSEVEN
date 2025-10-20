import React, { Fragment } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import LayoutOne from "../../layouts/LayoutOne";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
  getWishlist,
} from "../../redux/actions/wishlistActions";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
// !DEL
const Wishlist = ({
  location,
  addToCart,
  wishlistItems,
  deleteFromWishlist,
  currentLanguageCode,
  strings,
}) => {
  const { addToast } = useToasts();
  const { pathname } = location;
console.log(wishlistItems)
  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["StarSeven"]} | {strings["wishlist"]}
        </title>
        <meta
          name="description"
          content="Wishlist page of StarSeven react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["wishlist"]}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems && wishlistItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">
                  {strings["wishlist_page_title"]}
                </h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>{strings["image"]}</th>
                            <th>{strings["product_name"]}</th>
                            <th>{strings["unit_price"]}</th>
                            <th>{strings["add_to_cart"]}</th>
                            <th>{strings["action"]}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems.map((wishlistItem, key) => {
                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem?.id
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        wishlistItem?.image_path || "/deal.png"
                                      }
                                      alt="ITEMS"
                                    />
                                  </Link>
                                </td>

                                <td className="product-name text-center">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem?.id
                                    }
                                  >
                                    {currentLanguageCode === "en"
                                      ? wishlistItem?.translations[1].name
                                      : wishlistItem?.translations[0].name ||
                                        "NO MAME"}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  {wishlistItem?.price}{" "}
                                </td>

                                <td className="product-wishlist-cart">
                                  {/* {wishlistItem?.affiliateLink ? (
                                    <a
                                      href={wishlistItem?.affiliateLink}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {" "}
                                      Buy now{" "}
                                    </a>
                                  ) : wishlistItem?.variation &&
                                    wishlistItem?.variation.length >= 1 ? (
                                    <Link
                                      to={`${process.env.PUBLIC_URL}/product/${wishlistItem?.id}`}
                                    >
                                      Select option
                                    </Link>
                                  ) : wishlistItem?.stock &&
                                    wishlistItem?.stock > 0 ? ( */}
                                  <button
                                    onClick={() =>
                                      addToCart(wishlistItem, addToast)
                                    }
                                    // className={
                                    //   cartItem !== undefined &&
                                    //   cartItem.quantity > 0
                                    //     ? "active"
                                    //     : ""
                                    // }
                                    // disabled={
                                    //   cartItem !== undefined &&
                                    //   cartItem.quantity > 0
                                    // }
                                    title={
                                      wishlistItem !== undefined
                                        ? "Added to cart"
                                        : "Add to cart"
                                    }
                                  >
                                    {/* {cartItem !== undefined &&
                                    cartItem?.quantity > 0 
                                      ? "Added"
                                      : "Add to cart"} */}
                                    {strings["add_to_cart"]}
                                  </button>
                                  {/* ) : (
                                    <button disabled className="active">
                                      Out of stock
                                    </button>
                                  )} */}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      deleteFromWishlist(wishlistItem, addToast)
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
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
                          {strings["continue_shopping"]}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {strings["EMPTY_TITLE"]} <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        {strings["shop"]}
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
    wishlistItems: state.wishlistData,
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    addToWishlist: (item, addToast, quantityCount) => {
      dispatch(addToWishlist(item, addToast, quantityCount));
    },
    deleteFromWishlist: (item, addToast, quantityCount) => {
      dispatch(deleteFromWishlist(item, addToast, quantityCount));
    },
    getWishlist: () => {
      dispatch(getWishlist());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(Wishlist));
