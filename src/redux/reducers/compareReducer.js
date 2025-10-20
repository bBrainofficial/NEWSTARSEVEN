import { ADD_TO_COMPARE, DELETE_FROM_COMPARE } from "../actions/compareActions";

const compareReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_COMPARE:
      // Prevent duplicates
      if (!state.some(item => item.id === action.payload.id)) {
        return [...state, action.payload];
      }
      return state;

    case DELETE_FROM_COMPARE:
      return state.filter(item => item.id !== action.payload.id);

    default:
      return state;
  }
};

export default compareReducer;
