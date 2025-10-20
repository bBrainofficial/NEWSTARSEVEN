import axiosInstance from "../../api/api";

export const ADD_TO_CART = "ADD_TO_CART";
export const GET_CART = "GET_CART";
export const UPDATE_QUANTITY = "UPDATE_QUANTITY"; // Replaces DECREASE_QUANTITY for clarity
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const DELETE_ALL_FROM_CART = "DELETE_ALL_FROM_CART";
export const ERROR_CART = "ERROR_CART"; // Corrected the error action type

// Get all items in the cart
export const getCartItems = () => (dispatch) => {
  
  axiosInstance
    .get("/cart")
    .then((response) => {
      dispatch({ type: GET_CART, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: ERROR_CART, payload: error });
    });
};

// Add item to cart
export const addToCart =
  (item, addToast, quantityCount = 1) =>
  (dispatch, getState) => {
    const stateData = getState();
    const cartItems = stateData.cartData.items; // Adjust based on your state structure

    // Find the existing item in the cart using the correct property
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      // Use the 'qty' property from the state, not 'quantityCount'
      const newQuantity = (existingItem.qty || 1) + quantityCount;

      if (addToast) {
        addToast("Updated Cart", { appearance: "success", autoDismiss: true });
      }

      // Dispatch an action to update the quantity
      dispatch({
        type: UPDATE_QUANTITY,
        payload: { item, quantityCount: newQuantity },
      });

      if (localStorage.getItem("authToken")) {
        axiosInstance
          .post("/update-qty-cart", {
            item_id: item.id,
            qty: newQuantity,
          })
          .catch((error) => {
            dispatch({ type: ERROR_CART, payload: error });
          });
      }
    } else {
      if (addToast) {
        addToast("Added To Cart", { appearance: "success", autoDismiss: true });
      }
      dispatch({
        type: ADD_TO_CART,
        payload: { item, quantityCount },
      });
      if (localStorage.getItem("authToken")) {
        axiosInstance
          .post("/add-to-cart", {
            item_id: item.id,
            qty: quantityCount,
          })
          .catch((error) => {
            dispatch({ type: ERROR_CART, payload: error });
          });
      }
    }
  };



// Update quantity of an item in the cart
export const updateQuantity = (item, addToast, quantityCount) => (dispatch) => {
  console.log("🚀 ~ quantityCount:", quantityCount);
  console.log("🚀 ~ item:", item);
  if (addToast) {
    addToast("Product Updated", { appearance: "success", autoDismiss: true });
  }
  dispatch({
    type: UPDATE_QUANTITY,
    payload: { item, quantityCount },
  });
  if (localStorage.getItem("authToken")) {
    axiosInstance
      .post("/update-qty-cart", {
        item_id: item.item_id || item.id,
        qty: quantityCount,
      })
      .then(() => {})
      .catch((error) => {
        dispatch({ type: ERROR_CART, payload: error });
      });
  }
};

// Remove an item from the cart
export const deleteFromCart = (item, addToast) => (dispatch) => {
  if (addToast) {
    addToast("Removed From Cart", { appearance: "error", autoDismiss: true });
  }
  dispatch({ type: DELETE_FROM_CART, payload: { item } });
  if (localStorage.getItem("authToken")) {
    axiosInstance
      .post("/remove-from-cart", { item_id: item.id })
      .then(() => {})
      .catch((error) => {
        dispatch({ type: ERROR_CART, payload: error });
      });
  }
};

// Delete all items from the cart
export const deleteAllFromCart = (addToast) => (dispatch) => {
  if (addToast) {
    addToast("Removed All From Cart", {
      appearance: "error",
      autoDismiss: true,
    });
  }
  dispatch({ type: DELETE_ALL_FROM_CART });
  if (localStorage.getItem("authToken")) {
    axiosInstance
      .post("/remove-all-cart")
      .then(() => {})
      .catch((error) => {
        dispatch({ type: ERROR_CART, payload: error });
      });
  }
};
