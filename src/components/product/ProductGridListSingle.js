import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
import ProductModal from "./ProductModal";
// !DEL // PRODUCTCARD
const ProductGridListSingle = ({
  product,
  currency,
  cartItem,
  sliderClassName,
  spaceBottomClass,
  currentLanguageCode,
  addToCart,
  strings,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();
  console.log('.....',product)
  const [isFav, setIsFav] = useState(
    product.is_favorite || getIsFavoriteFromLocalStorage(product)
  );
  // Separate hover state for grid and list views
  const [isGridHovered, setIsGridHovered] = useState(false);
  const [isListHovered, setIsListHovered] = useState(false);
  // New state for hover
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const handleWishlistToggle = () => {
    if (isFav) {
      dispatch(deleteFromWishlist(product, addToast));
    } else {
      dispatch(addToWishlist(product, addToast));
    }
    setIsFav((prev) => !prev);
  };

  // Default image and hover image URLs
  const defaultImage =
    product.image_path ||
    "https://www.imgenerate.com/generate?width=400&height=400";
  const hoverImage =
    product.media && product.media.length > 0
      ? `https://e-commerce.test.do-go.net/images/${product.media[0].image}`
      : defaultImage;

  const discountedPrice =
    product?.price - (product?.price * product?.discount) / 100;
  return (
    <Fragment>
      <div
        className={`col-xl-4 col-sm-6 ${sliderClassName ? sliderClassName : ""
          }`}
        style={{ height: "100%" }}
      >
        <div
          className={`product-wrap  ${spaceBottomClass ? spaceBottomClass : ""}`}
          style={{ height: "100%" }}
        >

          <div className="product-img" style={{ position: "relative", overflow: "hidden", height: "100%" }}>
            <Link to={`/product/${product.id}`}>
              <div className="product-list-image-container" style={{ height: "100%" }}>
                <img
                  className="default-img"
                  src={defaultImage ||'https://www.imgenerate.com/generate?width=400&height=400'}
                  alt={product.name}
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
                {product.media?.length > 0 && (
                  <img
                    className="hover-img"
                    src={hoverImage}
                    alt={product.name}
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                )}
              </div>

            </Link>
            {product.discount ? (
              <div className="product-img-badges">
                <span className="pink" style={{ color: "#FFF" }}>
                  -{product.discount}%
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
                <button
                  className={!isFav ? "active" : ""}
                  title={!isFav ? "Added to wishlist" : "Add to wishlist"}
                  onClick={() => handleWishlistToggle()}
                >
                  <i
                    className={isFav ? "fa fa-heart" : "fa fa-heart-o"}
                    style={{
                      color: isFav ? "red" : "inherit",
                    }}
                  />
                </button>
              </div>
              <div className="pro-same-action pro-cart">
                {/* {product.is_available === 1 ? ( */}
                  <button
                    onClick={() => addToCart(product, addToast, 1)}
                    className={
                      cartItem !== undefined && cartItem?.quantity > 0
                        ? "active"
                        : ""
                    }
                    disabled={cartItem !== undefined && cartItem?.quantity > 0}
                    title={
                      cartItem !== undefined
                        ? "Added to cart"
                        : strings['add_to_cart']
                    }
                  >
                    <i className="pe-7s-cart" style={{ marginRight: "4px" }}></i>
                    {cartItem !== undefined && cartItem?.quantity > 0
                      ? "Added"
                      : strings['add_to_cart']}
                  </button>

                {/* // ) 
                // : (
                //   <button disabled className="active">
                //     {strings["out_of_stock"]}
                //   </button>
                // )}
               */}
              </div>
              <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-content text-center">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                {currentLanguageCode === "ar"
                  ? product.translations[0]?.name
                  : product.translations[1]?.name}
              </Link>
            </h3>

            <div className="product-price">
              {product?.discount > 0 ? (
                <>
                  {/* Original price */}
                  <span
                    style={{
                      direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                    }}
                  >
                    <span
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      {product.price}
                    </span>
                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      {discountedPrice}
                    </span>
                    {strings["EG"]}
                  </span>

                  {/* Discounted price */}
                </>
              ) : (
                <span
                  style={{
                    direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                  }}
                >
                  {product?.price}
                  {strings["EG"]}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="shop-list-wrap mb-30">
          <div className="row">
            <div className="col-xl-4 col-md-5 col-sm-6 h-full">
              <div className="product-list-image-wrap h-full">
                {/* <div
            className="product-img"
            style={{ position: "relative", overflow: "hidden" }}
          > */}
                <div className="product-img h-full">
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id} style={{ height: '280px', display: 'flex' }}>
                    <img
                      src={isListHovered ? hoverImage : defaultImage}
                      alt={product.name}
                      loading="lazy"
                      // onError={(e) =>
                      // (e.target.src =
                      //   "https://via.placeholder.com/300x300?text=No+Image")
                      // }
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transition: "opacity 0.4s ease-in-out",
                      }}
                      onMouseEnter={() => setIsListHovered(true)}
                      onMouseLeave={() => setIsListHovered(false)}
                    />
                  </Link>

                  {/* Product Badges */}
                  {/* {product.discount && (
                    <div className="product-img-badges">
                      <span className="pink" style={{ color: "#FFF" }}>
                        -{product.discount}%
                      </span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-md-7 col-sm-6">
              <div className="shop-list-content d-flex flex-column justify-content-between align-items-start h-100 pb-4">
                <h3>
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    {currentLanguageCode === "ar"
                      ? product.translations[0]?.name || ""
                      : product.translations[1]?.name || ""}
                  </Link>
                </h3>

                {/* price */}
                <div className="shop-list-price-wrap d-flex flex-column justify-content-between align-items-start">
                  {product?.price}  {currentLanguageCode === "ar" ? "ج م" : "EGP"}
                </div>
                <p>
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    {currentLanguageCode === "ar"
                      ? product.translations[0]?.description
                      : product.translations[1]?.description}
                  </Link>
                </p>
                <div className="product-list-price">
                  {/* {discountedPrice !== null ? (
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
                  {product.rating && product.rating > 0 ? (
                    <div className="rating-review">
                      <div className="product-list-rating">
                        <Rating ratingValue={product.rating} />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {product.shortDescription ? (
                    <p>{product.shortDescription}</p>
                  ) : (
                    ""
                  )} */}

                  <div className="shop-list-actions d-flex align-items-center">
                    <div className="shop-list-btn btn-hover">
                      {product.is_available === 1 ? (
                        <button
                          onClick={() => addToCart(product, addToast, 1)}
                          className={
                            cartItem !== undefined && cartItem?.quantity > 0
                              ? "active"
                              : ""
                          }
                          disabled={
                            cartItem !== undefined && cartItem?.quantity > 0
                          }
                          title={
                            cartItem !== undefined
                              ? "Added to cart"
                              : strings['add_to_cart']
                          }
                        >

                          <i className="pe-7s-cart"></i>
                          {cartItem !== undefined && cartItem?.quantity > 0
                            ? "Added"
                            : strings['add_to_cart']}
                        </button>
                      ) : (
                        <button disabled className="active">
                          Out of Stock
                        </button>
                      )}
                    </div>

                    <div className="shop-list-wishlist ml-20">
                      <button
                        className={!isFav ? "active" : ""}
                        title={!isFav ? "Added to wishlist" : "Add to wishlist"}
                        onClick={() => handleWishlistToggle()}
                      >
                        <i
                          className={isFav ? "fa fa-heart" : "fa fa-heart-o"}
                          style={{
                            color: isFav ? "red" : "inherit",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add CSS to your stylesheet */}
      <style jsx>{`
        .product-img-container, .product-list-image-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
        
        .product-img-container img,
        .product-list-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease-in-out;
        }

        .hover-img {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }

        .product-img-container:hover .default-img,
        .product-list-image-container:hover .default-img {
          opacity: 0;
        }

        .product-img-container:hover .hover-img,
        .product-list-image-container:hover .hover-img {
          opacity: 1;
        }
      `}</style>

      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        // discountedprice={discountedPrice}
        // finalproductprice={finalProductPrice}
        // finaldiscountedprice={finalDiscountedPrice}
        cartitem={cartItem}
        addtowishlist={addToWishlist}
        addtoast={addToast}
        addToCart={addToCart}
      />
    </Fragment>
  );
};

export default multilanguage(ProductGridListSingle);
