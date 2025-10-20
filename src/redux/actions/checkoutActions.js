import axiosInstance from "../../api/api";
import { DELETE_ALL_FROM_CART } from "../types/cartActionTypes";
export const checkout = (checkoutData, addToast) => async (dispatch) => {
    try {
      const response = await axiosInstance.post("/checkout", checkoutData);
      if (response.data.status === "success") {
        addToast("Order placed successfully", { appearance: "success" });
        dispatch({ type: DELETE_ALL_FROM_CART });
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      addToast("Checkout failed", { appearance: "error" });
    }
  };
  
  export const checkoutWithoutUser = (checkoutData, addToast) => async (dispatch) => {
    try {
      const response = await axiosInstance.post("/checkout", checkoutData);
      if (response.data.status === "success") {
        addToast("Order placed successfully", { appearance: "success" });
        dispatch({ type: DELETE_ALL_FROM_CART });
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      addToast("Checkout failed", { appearance: "error" });
    }
  };
  
  export const checkoutOneClick = (checkoutData, addToast) => async (dispatch) => {
    try {
      const response = await axiosInstance.post("/checkout-one", checkoutData);
      if (response.data.status === "success") {
        addToast("Order placed successfully", { appearance: "success" });
        dispatch({ type: DELETE_ALL_FROM_CART });
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      addToast("Checkout failed", { appearance: "error" });
    }
  };
  
  export const checkoutOneClickWithoutUser = (checkoutData, addToast) => async (dispatch) => {
    try {
      const response = await axiosInstance.post("/checkout-one", checkoutData);
      if (response.data.status === "success") {
        addToast("Order placed successfully", { appearance: "success" });
        dispatch({ type: DELETE_ALL_FROM_CART });
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      addToast("Checkout failed", { appearance: "error" });
    }
  };