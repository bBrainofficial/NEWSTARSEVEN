import {
  ADD_TO_CART,
  DELETE_ALL_FROM_CART,
  DELETE_FROM_CART,
  ERROR_CART,
  GET_CART,
  UPDATE_QUANTITY,
} from "../actions/cartActions";

const initState = {
  items: [],
};

const cartReducer = (state = initState, action) => {
  // Guard against undefined state
  if (!state) return initState;

  switch (action.type) {
    case GET_CART:
      return {
        ...state,
        items: Array.isArray(action.payload?.items) ? action.payload.items : [],
      };

    case ADD_TO_CART: {
      const { item, quantityCount } = action.payload || {};
      if (!item) return state;

      const items = Array.isArray(state.items) ? state.items : [];
      const existingIndex = items.findIndex((it) => it?.id === item.id);

      if (existingIndex !== -1) {
        const newItems = [...items];
        newItems[existingIndex] = {
          ...items[existingIndex],
          qty: quantityCount,
        };
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...items, { ...item, qty: quantityCount }],
      };
    }

    case UPDATE_QUANTITY: {
      console.log("🚀 ~ cartReducer ~ state.items:", state.items);
      if (!state.items) return state;
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload?.item?.id
            ? { ...it, qty: action.payload.quantityCount }
            : it
        ),
      };
    }

    case DELETE_FROM_CART:
      return {
        ...state,
        items:
          state.items?.filter((it) => it.id !== action.payload?.item?.id) || [],
      };

    case DELETE_ALL_FROM_CART:
      return { ...state, items: [] };

    case ERROR_CART:
      console.error("Cart Error:", action.payload);
      return state;

    default:
      return state;
  }
};

export default cartReducer;
