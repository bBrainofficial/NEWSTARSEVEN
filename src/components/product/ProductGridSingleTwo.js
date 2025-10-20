import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../helpers/product";
import ProductModal from "./ProductModal";
// !DEL
const ProductGridSingleTwo = ({
  product,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItem,
  wishlistItem,
  compareItem,
  sliderClassName,
  spaceBottomClass,
  colorClass,
  titlePriceClass,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();

  // Function to calculate the discounted price
  const getDiscountPrice = (price, discount) => {
    if (!price || !discount) return price; // If either is missing, return the original price
    return price - (price * discount) / 100; // Apply the discount as a percentage
  };
  const defaultImage = product.image_path || "https://via.placeholder.com/300x300?text=No+Image";
  // Hover image from media (if available)
  const hoverImage =
    product.media && product.media.length > 0
      ? `https://e-commerce.test.do-go.net/images/${product.media[0].image}`
      : defaultImage;
  // Usage
  const discountedPrice = getDiscountPrice(product?.price, product?.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);

  return (
    <Fragment>
      <div
        className={`col-xl-3 col-md-6 col-lg-4 col-sm-6 ${sliderClassName ? sliderClassName : ""
          }`}
      >
        <div
          className={`product-wrap-2 ${spaceBottomClass ? spaceBottomClass : ""
            } ${colorClass ? colorClass : ""} `}
        >
           <div className="product-img" style={{ position: "relative", overflow: "hidden" }}>
                   <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                     {/* Default Image */}
                     <img
                       className="default-img img-fluid"
                       src={defaultImage}
                       alt={product.name}
                       loading="lazy"
                       onError={(e) => (e.target.src = "https://via.placeholder.com/300x300?text=No+Image")}
                       style={{
                         width: "100%",
                         height: "auto",
                         objectFit: "cover",
                         transition: "opacity 0.3s ease-in-out",
                       }}
                       onMouseEnter={(e) => (e.target.style.opacity = "0")}
                       onMouseLeave={(e) => (e.target.style.opacity = "1")}
                     />
                     {/* Hover Image */}
                     {product.media && product.media.length > 0 && (
                       <img
                         className="hover-img img-fluid"
                         src={hoverImage}
                         alt={product.name}
                         loading="lazy"
                         onError={(e) => (e.target.src = "https://via.placeholder.com/300x300?text=No+Image")}
                         style={{
                           width: "100%",
                           height: "auto",
                           objectFit: "cover",
                           position: "absolute",
                           top: 0,
                           left: 0,
                           transition: "opacity 0.3s ease-in-out",
                           opacity: 0,
                         }}
                         onMouseEnter={(e) => (e.target.style.opacity = "1")}
                         onMouseLeave={(e) => (e.target.style.opacity = "0")}
                       />
                     )}
                   </Link>
         

            {product.discount || product.new ? (
              <div className="product-img-badges">
                {product.discount ? (
                  <span className="pink" style={{ color: "#FFF" }}>
                    -{product.discount}%
                  </span>
                ) : (
                  ""
                )}
                {product.new ? <span className="purple">New</span> : ""}
              </div>
            ) : (
              ""
            )}

            <div className="product-action-2">
              {product.affiliateLink ? (
                <a
                  href={product.affiliateLink}
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Buy now"
                >
                  {" "}
                  <i className="fa fa-shopping-cart"></i>{" "}
                </a>
              ) : product.variation && product.variation.length >= 1 ? (
                <Link
                  to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                  title="Select options"
                >
                  <i className="fa fa-cog"></i>
                </Link>
              ) : product.stock && product.stock > 0 && product.is_available === 1 ? (
                <button
                  onClick={() => addToCart(product, addToast)}
                  className={
                    cartItem !== undefined && cartItem.quantity > 0
                      ? "active"
                      : ""
                  }
                  disabled={cartItem !== undefined && cartItem.quantity > 0}
                  title={
                    cartItem !== undefined ? "Added to cart" : "Add to cart"
                  }
                >
                  {" "}
                  <i className="fa fa-shopping-cart"></i>{" "}
                </button>
              ) : (
                <button disabled className="active" title="Out of stock">
                  <i className="fa fa-shopping-cart"></i>
                </button>
              )}

              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="fa fa-eye"></i>
              </button>

              {/* <button
                className={compareItem !== undefined ? "active" : ""}
                disabled={compareItem !== undefined}
                title={
                  compareItem !== undefined
                    ? "Added to compare"
                    : "Add to compare"
                }
                onClick={() => addToCompare(product, addToast)}
              >
                <i className="fa fa-retweet"></i>
              </button> */}
            </div>
          </div>
          <div className="product-content-2">
            <div
              className={`title-price-wrap-2 ${titlePriceClass ? titlePriceClass : ""
                }`}
            >
              <h3>
                <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                  {product.name}
                </Link>
              </h3>
              <div className="price-2">
                {discountedPrice !== null ? (
                  <Fragment>
                    <span>
                      {currency.currencySymbol + finalDiscountedPrice}
                    </span>{" "}
                    <span className="old">
                      {currency.currencySymbol + finalProductPrice}
                    </span>
                  </Fragment>
                ) : (
                  <span>{currency.currencySymbol + finalProductPrice} </span>
                )}
              </div>
            </div>
            <div className="pro-wishlist-2">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                disabled={wishlistItem !== undefined}
                title={
                  wishlistItem !== undefined
                    ? "Added to wishlist"
                    : "Add to wishlist"
                }
                onClick={() => addToWishlist(product, addToast)}
              >
                <i className="fa fa-heart-o" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedprice={discountedPrice}
        finalproductprice={finalProductPrice}
        finaldiscountedprice={finalDiscountedPrice}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        addtocompare={addToCompare}
        addtoast={addToast}
      />
    </Fragment>
  );
};

ProductGridSingleTwo.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  wishlistItem: PropTypes.object,
};

export default ProductGridSingleTwo;
