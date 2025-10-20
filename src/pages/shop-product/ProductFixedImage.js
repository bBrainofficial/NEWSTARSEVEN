import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";

import { Link } from "react-router-dom";
import axiosInstance from "../../api/api";
import LayoutOne from "../../layouts/LayoutOne";
import { multilanguage } from "redux-multilanguage";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
// Redux actions (ensure these exist in your project)
import { addToCart } from "../../redux/actions/cartActions";
import { connect, useDispatch, useSelector } from "react-redux";

import { addToCompare, deleteFromCompare } from "../../redux/actions/compareActions";
import { useHistory } from 'react-router-dom';
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
import { useToasts } from "react-toast-notifications";
// Import a rating component (adjust path as needed)
import Rating from "../../components/product/sub-components/ProductRating";
import ReviewsSection from "../other/Reviews";
import ReviewsPage from "../other/ReviewsList";
// import { addToCompare } from "../../redux/actions/compareActions";
const ProductFixedImage = ({
  location,
  currentLanguageCode,
  strings,
  addToCart,
  // deleteFromCompare,
  // addToCompare,

  currency,
  cartItems,
  wishlistItem,
  // compareItem
}) => {

  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { pathname } = location;
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const compareItem = useSelector(state =>
    state.compareData.find(item => item.id === product?.id)
  );
  const history = useHistory();
  // State for variations (if any)
  const [selectedProductColor, setSelectedProductColor] = useState("");
  const [selectedProductSize, setSelectedProductSize] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [quantityCount, setQuantityCount] = useState(1);
  // const [selectedImage, setSelectedImage] = useState(product && product.image);
  const [selectedSize, setSelectedSize] = useState(null);
  const PRODUCT_ID = pathname.split("/")[2];
  const [isFav, setIsFav] = useState(getIsFavoriteFromLocalStorage(product));

  // Handlers for quantity change
  // const handleDecreaseQuantity = () => {
  //   if (quantityCount > 1) {
  //     setQuantityCount(quantityCount - 1);
  //   }
  // };

  // const handleIncreaseQuantity = () => {
  //   setQuantityCount(quantityCount + 1);
  // };
  const [selectedImage, setSelectedImage] = useState("");
  const [compareHighlight, setCompareHighlight] = useState(false);
  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/item/${PRODUCT_ID}`);
        if (!response.data.item) {
          history.push('/404');  // Redirect to 404 page if product is not found
          return;  // Prevent further rendering after redirect
        }
  
        const fetchedProduct = response.data.item;
        setProduct(fetchedProduct);
        setRelatedProduct(response.data.related);
        setSelectedImage(fetchedProduct.image_path);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        history.push('/404');  // Redirect to 404 page if product is not found
        return;  // Prevent further rendering after redirect
        // setError("This product is unavailable or does not exist.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [PRODUCT_ID, history]);
  

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

  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/item/${PRODUCT_ID}`);
        
        if (!response.data.item) {
          history.push('/404');
          return null;  // Early return to prevent further rendering
        }
  
        const fetchedProduct = response.data.item;
        setProduct(fetchedProduct);
        setRelatedProduct(response.data.related);
        setSelectedImage(fetchedProduct.image_path);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("This product is unavailable or does not exist.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [PRODUCT_ID]);
  
  if (loading) {
    return (
      <div className="StarSeven-preloader-wrapper">
        <div className="StarSeven-preloader">
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  // Price calculations
  let discountedPrice = null;
  let finalProductPrice = product.price;
  let finalDiscountedPrice = product.price;
  if (product.discount && product.discount > 0) {
    discountedPrice = product.price - (product.price * product.discount) / 100;
    finalDiscountedPrice = discountedPrice;
  }

  // (Optional) Calculate the quantity already in the cart.
  // If you have a helper (e.g. getProductCartQuantity), use it here.
  const productCartQty = 0;
  console.log(product)

  // Calculate average rating and review count
  // Calculate average rating
  const reviewCount = product.reviews ? product.reviews.length : 0;
  const averageRating = reviewCount > 0
    ? product.reviews.reduce((acc, review) => acc + review.rate, 0) / reviewCount
    : 0;

    if (loading) {
      return (
        <div className="StarSeven-preloader-wrapper">
          <div className="StarSeven-preloader">
            <span></span>
            <span></span>
          </div>
        </div>
      );
    }
    
    // If error occurs (product not found or API fails)
    if (error) {
      return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2 style={{ color: "red" }}>{error}</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/shop-grid-standard" style={{ color: "blue", textDecoration: "underline" }}>
            Go back to Shop
          </Link>
        </div>
      );
    }
    
    // If no product is found, prevent blank page
    if (!product) {
      return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2 style={{ color: "red" }}>Product Not Found</h2>
          <p>We couldn't find the product you are looking for.</p>
          <Link to="/shop-grid-standard" style={{ color: "blue", textDecoration: "underline" }}>
            Browse Products
          </Link>
        </div>
      );
    }

  return (
    <Fragment>
      <MetaTags>
        <title>
          {currentLanguageCode === "ar"
            ? product?.translations[0]?.name
            : product?.translations[1]?.name || product.name}
        </title>
        <meta
          name="description"
          content={
            currentLanguageCode === "ar"
              ? product?.translations[0]?.description
              : product?.translations[1]?.description || product.description
          }
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["shopProduct"]}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />

        {/* New Product Details Layout */}
        {/* Product Details */}
        <div className="product-details-wrapper pt-100 pb-100">
          <div className="container">
            <div className="row ">

              {/* Left: Thumbnail Images */}
              <div className="md:col-2 product-thumbnails"
                style={{
                  padding:'20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  height: "400px",  // Match main product image height
                  overflowY: "auto", // Enable scrolling if more images
                  scrollbarWidth: "none", // Hide scrollbar for Firefox
                  msOverflowStyle: "none" // Hide scrollbar for IE/Edge
                }}
              >
                {/* Hide scrollbar for WebKit (Chrome, Safari) */}
                <style>{`
    .product-thumbnails::-webkit-scrollbar {
      display: none;
    }
  `}</style>

                {/* Main Product Image as the first thumbnail */}
                <img
                  src={product.image_path}
                  alt="Main Product"
                  className={`thumbnail ${selectedImage === product.image_path ? "active" : ""}`}
                  onClick={() => setSelectedImage(product.image_path)}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: selectedImage === product.image_path ? "2px solid #000" : "none",
                    objectPosition: "center"
                  }}
                />

                {/* Show media images if available */}
                {product.media && product.media.length > 0 &&
                  product.media.map((mediaItem, index) => (
                    <img
                      key={index}
                      src={`https://e-commerce.test.do-go.net/images/${mediaItem.image}`}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${selectedImage === `https://e-commerce.test.do-go.net/images/${mediaItem.image}` ? "active" : ""}`}
                      onClick={() => setSelectedImage(`https://e-commerce.test.do-go.net/images/${mediaItem.image}`)}
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: selectedImage === `https://e-commerce.test.do-go.net/images/${mediaItem.image}` ? "2px solid #000" : "none",
                        objectPosition: "center"
                      }}
                    />
                  ))}
              </div>

              {/* Center: Main Image */}
              <div className="col-md-4 mx-auto">

                <div className="product-large-image-wrapper w-full " style={{ width: '100%' }}>
                  <img
                    src={selectedImage}
                    className="img-fluid main-product-image mx-auto w-full"
                    alt="Product Main"
                    style={{
                      width: "100%",
                      height: "400px", // Fixed height to ensure square ratio
                      objectFit: "cover", // Prevent distortion
                      borderRadius: "10px", // Optional: make edges look clean
                      objectPosition: 'center'
                    }}
                  />
                </div>
              </div>
              {/* Right Column: Product Details */}
              <div className="col-md-5 col-sm-12">
                <div className="product-details-content ml-70">
                  <h2>
                    {currentLanguageCode === "ar"
                      ? product?.translations[0]?.name
                      : product?.translations[1]?.name || product.name}
                  </h2>


                  {/* Rating display */}
                  <div className="product-rating" style={{ margin: '10px 0px' }}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} className={index < Math.round(averageRating) ? 'starFilled' : 'star'}>
                        ★
                      </span>
                    ))}
                    <span className="review-count"> ({reviewCount} Reviews)</span>
                  </div>



                  <p className="product-description">{product.description}</p>
                  <div className="product-details-price">
                    {discountedPrice !== null ? (
                      <Fragment>
                        <span>{currency.currencySymbol + finalDiscountedPrice}</span>{" "}
                        <span className="old">
                          {currency.currencySymbol + finalProductPrice}
                        </span>
                      </Fragment>
                    ) : (
                      <span>{currency.currencySymbol + finalProductPrice}</span>
                    )}
                  </div>

                  {product.rating && product.rating > 0 && (
                    <div className="pro-details-rating-wrap">
                      <div className="pro-details-rating">
                        <Rating ratingValue={product.rating} />
                      </div>
                    </div>
                  )}

                  <div className="pro-details-list">
                    <p>
                      {currentLanguageCode === "ar"
                        ? product?.translations[0]?.description
                        : product?.translations[1]?.description || product.description}
                    </p>
                  </div>

                  {/* Variation selectors (if any) */}
                  {product.variation && product.variation.length > 0 && (
                    <div className="pro-details-size-color">
                      <div className="pro-details-color-wrap">
                        <span>Color</span>
                        <div className="pro-details-color-content">
                          {product.variation.map((single, key) => (
                            <label
                              className={`pro-details-color-content--single ${single.color}`}
                              key={key}
                            >
                              <input
                                type="radio"
                                value={single.color}
                                name="product-color"
                                checked={single.color === selectedProductColor}
                                onChange={() => {
                                  setSelectedProductColor(single.color);
                                  setSelectedProductSize(single.size[0].name);
                                  setProductStock(single.size[0].stock);
                                  setQuantityCount(1);
                                }}
                              />
                              <span className="checkmark"></span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="pro-details-size">
                        <span>Size</span>
                        <div className="pro-details-size-content">
                          {product.variation.map(single => {
                            return single.color === selectedProductColor
                              ? single.size.map((singleSize, key) => (
                                <label
                                  className="pro-details-size-content--single"
                                  key={key}
                                >
                                  <input
                                    type="radio"
                                    value={singleSize.name}
                                    checked={
                                      singleSize.name === selectedProductSize
                                    }
                                    onChange={() => {
                                      setSelectedProductSize(singleSize.name);
                                      setProductStock(singleSize.stock);
                                      setQuantityCount(1);
                                    }}
                                  />
                                  <span className="size-name">
                                    {singleSize.name}
                                  </span>
                                </label>
                              ))
                              : null;
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Affiliate link check */}
                  {product.affiliateLink ? (
                    <div className="pro-details-quality">
                      <div className="pro-details-cart btn-hover ml-0">
                        <a
                          href={product.affiliateLink}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Buy Now
                        </a>
                      </div>
                    </div>
                  ) : (
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
                        {product.is_available === 1 ? (
                          <button
                            onClick={() =>
                              addToCart(
                                product,
                                addToast,
                                quantityCount,
                                selectedProductColor,
                                selectedProductSize
                              )
                            }
                          // disabled={productCartQty >= productStock}
                          >
                            {strings['add_to_cart']}
                          </button>
                        ) : (
                          <button disabled>{strings["out_of_stock"]}</button>
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
                      {/* <div className="pro-details-compare">
                        <button
                          className={compareItem ? "active compare-highlight" : ""}
                          title={compareItem ? "Remove from compare" : "Add to compare"}
                          onClick={() => {
                            if (compareItem) {
                              dispatch(deleteFromCompare(product, addToast));
                              setCompareHighlight(false); // Remove highlight
                            } else {
                              dispatch(addToCompare(product, addToast));
                              setCompareHighlight(true); // Add highlight
                            }
                          }}
                        >
                          <i
                            className={"pe-7s-shuffle"}
                            style={{
                              color: compareItem ? "red" : "inherit",
                            }}
                          />
                        </button>

                      </div> */}
                    </div>
                  )}

                  {/* Product meta: Categories and Tags */}
                  {product.category && product.category.length > 0 && (
                    <div className="pro-details-meta">
                      <span>Categories :</span>
                      <ul>
                        {product.category.map((single, key) => (
                          <li key={key}>
                            <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                              {single}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.tag && product.tag.length > 0 && (
                    <div className="pro-details-meta">
                      <span>Tags :</span>
                      <ul>
                        {product.tag.map((single, key) => (
                          <li key={key}>
                            <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                              {single}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Social Share Links */}
                  <div className="pro-details-social">
                    <ul>
                      <li>
                        <a href="//facebook.com">
                          <i className="fa fa-facebook" />
                        </a>
                      </li>
                      <li>
                        <a href="//dribbble.com">
                          <i className="fa fa-dribbble" />
                        </a>
                      </li>
                      <li>
                        <a href="//pinterest.com">
                          <i className="fa fa-pinterest-p" />
                        </a>
                      </li>
                      <li>
                        <a href="//twitter.com">
                          <i className="fa fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="//linkedin.com">
                          <i className="fa fa-linkedin" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <ReviewsPage product={product} />
          </div>
          <ReviewsSection id={product.id} />

        </div>

        {/* Related Product Slider */}
        {relatedProduct && relatedProduct.length > 0 && (
          <div className="related-product-wrapper pb-95" style={{marginTop:'100px'}}>
            <div className="container">
              <RelatedProductSlider
                spaceBottomClass="pb-95"
                category={relatedProduct}
              />
            </div>
          </div>
        )}
      </LayoutOne>
    </Fragment>
  );
};

ProductFixedImage.propTypes = {
  location: PropTypes.object,
  currentLanguageCode: PropTypes.string,
  strings: PropTypes.object,
  addToCart: PropTypes.func,
  addToWishlist: PropTypes.func,
  addToCompare: PropTypes.func,
  addToast: PropTypes.func,
  currency: PropTypes.object,
  cartItems: PropTypes.array,
  wishlistItem: PropTypes.object,
  compareItem: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {
    currency: state.currencyData,
    cartItems: Array.isArray(state.cartData) ? state.cartData : [],  // Ensure it's an array
    wishlistItem: typeof state.wishlistData === "object" ? state.wishlistData : {}, // Ensure it's an object
    compareItem: state.compareData.find(item => item.id === ownProps.product?.id) || null, // Fixing compareItem lookup
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize
        )
      );
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },

    addToCompare: (item) => dispatch(addToCompare(item)),
    deleteFromCompare: (item) => dispatch(deleteFromCompare(item)),

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(ProductFixedImage));
