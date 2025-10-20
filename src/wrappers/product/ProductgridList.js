import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";
import { addToCart, getCartItems } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
// !DEL
const ProductGrid = ({
  products,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItems,
  sliderClassName,
  spaceBottomClass,
}) => {
  console.log(products)
  useEffect(() => {
    getCartItems();
  }, []);
  return (
    <Fragment>
      {products?.map((product) => {
        return (
          <ProductGridListSingle
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            addToCompare={addToCompare}
            cartItem={
              cartItems.items?.filter(
                (cartItem) => cartItem.id === product.id
              )[0]
            }
            key={product.id}
          />
        );
      })}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    currency: state.currencyData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    getCartItems: () => {
      dispatch(getCartItems());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGrid);
