import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist, deleteFromWishlist } from "../../redux/actions/wishlistActions";

const Product = ({ product, currentLanguageCode, strings }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [isFav, setIsFav] = useState(
    product.is_favorite || getIsFavoriteFromLocalStorage(product)
  );

  // Default image (first image)
  const defaultImage = product.image_path || "https://via.placeholder.com/300x300?text=No+Image";

  // Hover image from media (if available)
  const hoverImage =
    product.media && product.media.length > 0
      ? `https://e-commerce.test.do-go.net/images/${product.media[0].image}`
      : defaultImage;

  // Debugging logs
  console.log("Default Image:", defaultImage);
  console.log("Hover Image:", hoverImage);
  console.log("Product Media:", product.media);
console.log(product)
  const handleWishlistToggle = () => {
    if (isFav) {
      dispatch(deleteFromWishlist(product, addToast));
    } else {
      dispatch(addToWishlist(product, addToast));
    }
    setIsFav((prev) => !prev);
  };

  return (
    <div
      className="col-xl-3 col-md-6 col-lg-4 col-sm-6 col-12"
      style={{
        direction: currentLanguageCode === "en" ? "ltr" : "rtl",
      }}
    >
      <div className="product-wrap-2 mb-25">
        <div className="product-img" style={{ position: "relative", overflow: "hidden" }}>
          <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
            {/* Default Image */}
            <img
              className="default-img img-fluid"
              src={defaultImage}
              alt={product.name}
              loading="lazy"
              width={400}
              height={400}
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
                width={400}
                height={400}
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

          {product.discount ? (
            <div className="product-img-badges">
              <span className="pink" style={{ color: "#FFF" }}>
                -{product.discount}%
              </span>
            </div>
          ) : null}

          <div className="product-action-2">
            {product.is_available === 1 ? (
              <button
                onClick={() => dispatch(addToCart(product, addToast, 1))}
                title={strings['add_to_cart']}
              >
                <i className="fa fa-shopping-cart"></i>
              </button>
            ) : (
              <button disabled className="active" title="Out of stock">
                <i className="fa fa-shopping-cart"></i>
              </button>
            )}

            <button
              className={isFav ? "active" : ""}
              onClick={handleWishlistToggle}
              title={isFav ? "Remove from wishlist" : "Add to wishlist"}
            >
              <i className={isFav ? "fa fa-heart" : "fa fa-heart-o"} />
            </button>
          </div>
        </div>

        <div className="product-content-2">
          <div className="title-price-wrap-2">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                {currentLanguageCode === "ar"
                  ? product.translations[0]?.name
                  : product.translations[1]?.name}
              </Link>
            </h3>
            <div className="product-details-price">
              {product?.discount > 0 ? (
                <>
                  <span className="new" style={{ color: "red" }}>
           
                    {product?.price - (product?.price * product?.discount) / 100}{" "}
                    {strings["EG"]}
                  </span>
                  {"  "}
                  <span className="old" style={{ textDecoration: "line-through" }}>
                    {product?.price}
                    {strings["EG"]}
                  </span>
                </>
              ) : (
                <span>
                  {product?.price}
                  {strings["EG"]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
  };
};

export default connect(null, mapDispatchToProps)(multilanguage(Product));
