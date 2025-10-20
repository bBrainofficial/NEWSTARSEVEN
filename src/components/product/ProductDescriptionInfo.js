import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist, deleteFromWishlist } from "../../redux/actions/wishlistActions";
import CheckoutModal from "./CheckoutModal";
// import Rating from "./sub-components/ProductRating"; // (if needed)

// Custom hook to detect media query matches
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const ProductDescriptionInfo = ({
  product,
  addToCart,
  currentLanguageCode,
  strings,
}) => {
  const [quantityCount, setQuantityCount] = useState(1);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [isFav, setIsFav] = useState(
    product?.is_favorite || getIsFavoriteFromLocalStorage(product)
  );
  const [modalShow, setModalShow] = useState(false);

  // Get mobile/tablet state from our custom hook
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");

  // Handlers for wishlist toggle
  const handleWishlistToggle = () => {
    if (isFav) {
      dispatch(deleteFromWishlist(product, addToast));
    } else {
      dispatch(addToWishlist(product, addToast));
    }
    setIsFav((prev) => !prev);
  };

  // Handlers for quantity change
  const handleDecreaseQuantity = () => {
    if (quantityCount > 1) {
      setQuantityCount(quantityCount - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantityCount(quantityCount + 1);
  };

  return (
    <>
      <div className="product-details-content ml-70">
        <h2>
          {currentLanguageCode === "ar"
            ? product.translations[0]?.name
            : product.translations[1]?.name}
        </h2>

        <div className="product-details-price">
          {product?.discount > 0 ? (
            <>
              <span
                className="new"
                style={{
                  direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                }}
              >
                {product.price - (product.price * product.discount) / 100}{" "}
              </span>{" "}
              {strings["EG"]}
              <span
                className="old"
                style={{
                  direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                }}
              >
                {product.price}
                {strings["EG"]}
              </span>
            </>
          ) : (
            <span
              style={{
                direction: currentLanguageCode === "en" ? "ltr" : "rtl",
              }}
            >
              {product.price}
              {strings["EG"]}
            </span>
          )}
        </div>

        <div className="pro-details-list">
          <p>
            <span>{strings["weight"]} </span>
            {currentLanguageCode === "ar"
              ? product.translations[0]?.weight
              : product.translations[1]?.weight}
          </p>
          {/* Additional product details can be added here */}
        </div>

        {/* (No variation selectors provided in this version) */}
        {product.is_available === 1 && (
          <div className="pro-details-quality">
            <div className="cart-plus-minus">
              <button
                type="button"
                onClick={handleDecreaseQuantity}
                disabled={quantityCount === 1}
                className="dec qtybutton"
              >
                -
              </button>
              <input
                className="cart-plus-minus-box"
                type="text"
                value={quantityCount}
                readOnly
              />
              <button
                type="button"
                onClick={handleIncreaseQuantity}
                className="inc qtybutton"
              >
                +
              </button>
            </div>
            <div className="pro-details-cart btn-hover">
              {product.is_available ? (
                <button
                  onClick={() => addToCart(product, addToast, quantityCount)}
                  disabled={!product.is_available}
                >
                  {strings["add_to_cart"]}
                </button>
              ) : (
                <button disabled>{strings["outOfStock"]}</button>
              )}
            </div>
            <div className="pro-details-wishlist">
              <button
                className={!isFav ? "active" : ""}
                title={!isFav ? "Added to wishlist" : "Add to wishlist"}
                onClick={handleWishlistToggle}
              >
                <i
                  className={isFav ? "fa fa-heart" : "fa fa-heart-o"}
                  style={{ color: isFav ? "red" : "inherit" }}
                />
              </button>
            </div>
          </div>
        )}

        <div>
          <button className="order-now" onClick={() => setModalShow(true)}>
            <span>{strings["order_now"]}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              viewBox="0 0 24 24"
              fill="#FFF"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>

        {isMobileOrTablet && (
          <img
            src={product?.cover_path}
            alt="COVER"
            loading="lazy"
            style={{ marginBlock: "50px", width: "100%" }}
          />
        )}
      </div>

      <CheckoutModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        products={[product]}
        currentLanguageCode={currentLanguageCode}
        strings={strings}
        quantityCount={quantityCount}
      />

      {/* Sticky Toolbar */}
      <div className="sticky-toolbar">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-center">
            <div className="pro-details-quality">
              <div className="cart-plus-minus">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantityCount === 1}
                  className="dec qtybutton"
                >
                  -
                </button>
                <input
                  className="cart-plus-minus-box"
                  type="text"
                  value={quantityCount}
                  readOnly
                />
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  className="inc qtybutton"
                >
                  +
                </button>
              </div>
              <div className="pro-details-cart btn-hover">
                {product.is_available ? (
                  <button
                    onClick={() => addToCart(product, addToast, quantityCount)}
                    disabled={!product.is_available}
                  >
                    {strings["addToCart"]}
                  </button>
                ) : (
                  <button disabled>{strings["outOfStock"]}</button>
                )}
              </div>
            </div>
            <div className="col-auto d-flex flex-column gap-2">
              <span className="product-name">
                {currentLanguageCode === "ar"
                  ? product.translations[0]?.name
                  : product.translations[1]?.name}
              </span>
              <div>
                <span
                  className="price"
                  style={{
                    direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                  }}
                >
                  {product.price - (product.price * product.discount) / 100}{" "}
                </span>{" "}
                {strings["EG"]}
                <span
                  className="old"
                  style={{
                    textDecoration: "line-through",
                    direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                  }}
                >
                  {product.price}
                  {strings["EG"]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addToCart: (item, addToast, quantityCount) => {
    dispatch(addToCart(item, addToast, quantityCount));
  },
});

export default connect(null, mapDispatchToProps)(multilanguage(ProductDescriptionInfo));
