import { DELETE_ALL_FROM_CART } from "../types/cartActionTypes";

const initialState = {
  checkoutStatus: null,
};

const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_ALL_FROM_CART:
      return {
        ...state,
        checkoutStatus: "success",
      };
    default:
      return state;
  }
};

export default checkoutReducer;
