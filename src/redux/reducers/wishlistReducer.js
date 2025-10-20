import {
  ADD_TO_WISHLIST,
  DELETE_FROM_WISHLIST,
  WISHLIST_FAILURE,
  WISHLIST_FETCH,
} from "../actions/wishlistActions";

const initState = [];

const wishlistReducer = (state = initState, action) => {
  switch (action.type) {
    case WISHLIST_FETCH: {
      // Filter out any null or undefined items before setting state
      const validItems = action.payload.filter(
        (item) => item !== null && item !== undefined
      );
      return validItems;
    }
    case ADD_TO_WISHLIST: {
      // Ensure we work with a clean state (filter out nulls)
      const filteredState = state.filter((item) => item !== null && item !== undefined);
      const newItem = action.payload.item;
      // Check if the item already exists
      if (!filteredState.find((item) => item.id === newItem.id)) {
        return [...filteredState, newItem];
      }
      return filteredState;
    }
    case DELETE_FROM_WISHLIST: {
      const targetItem = action.payload.item;
      return state.filter((item) => item && item.id !== targetItem.id);
    }
    case WISHLIST_FAILURE:
      console.error("Wishlist operation failed:", action.payload);
      return state;
    default:
      return state;
  }
};

export default wishlistReducer;
