// import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Modal } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
// !DEL
function ProductModal({
  product,
  currentLanguageCode,
  addToCart,
  show,
  onHide,
  strings,
}) {
  const [isFav, setIsFav] = useState(
    product.is_favorite || getIsFavoriteFromLocalStorage(product)
  );
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const handleWishlistToggle = () => {
    if (isFav) {
      // Remove from wishlist if it is already favorited
      dispatch(deleteFromWishlist(product, addToast));
      setIsFav((prev) => !prev);
    } else {
      // Add to wishlist if it is not yet favorited
      dispatch(addToWishlist(product, addToast));
      setIsFav((prev) => !prev);
    }
  };
  const [quantityCount, setQuantityCount] = useState(1);

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
              <div className="product-large-image-wrapper">
                <div className="single-image">
                  <img
                    src={product.image_path}
                    className="img-fluid"
                    alt="img"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="product-details-content quickview-content">
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
                          direction:
                            currentLanguageCode === "en" ? "ltr" : "rtl",
                        }}
                      >
                        {product?.price -
                          (product?.price * product?.discount) / 100}{" "}
                        {/* Calculate new price */}
                      </span>{" "}
                      {strings["EG"]}
                      {/* New price after discount */}
                      <span
                        className="old"
                        style={{
                          direction:
                            currentLanguageCode === "en" ? "ltr" : "rtl",
                        }}
                      >
                        {product?.price}
                        {strings["EG"]}
                      </span>
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
                <p>
                  <span>{strings["weight"]} </span>
                  {currentLanguageCode === "ar"
                    ? product.translations[0]?.weight
                    : product.translations[1].weight}
                </p>

                <div className="pro-details-list">
                  <p>
                    {currentLanguageCode === "ar"
                      ? product.translations[0]?.description
                      : product.translations[1]?.description}
                  </p>
                </div>

                {product.is_available ===1 && (
                  <div className="pro-details-quality">
                    <div className="cart-plus-minus">
                      <button
                        type="button"
                        onClick={() => setQuantityCount(quantityCount - 1)} // Directly increment the quantity
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
                        onClick={() => setQuantityCount(quantityCount + 1)} // Directly increment the quantity
                        className="inc qtybutton"
                      >
                        +
                      </button>
                    </div>
                    <div className="pro-details-cart btn-hover">
                      {product.is_available === 1 ? (
                        <button
                          onClick={() =>
                            addToCart(product, addToast, quantityCount)
                          }
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
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    cartitems: state.cartData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(ProductModal));
