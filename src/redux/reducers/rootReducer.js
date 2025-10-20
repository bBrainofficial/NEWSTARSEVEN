import { combineReducers } from "redux";
import { createMultilanguageReducer } from "redux-multilanguage";
import cartReducer from "./cartReducer";
import compareReducer from "./compareReducer";
import currencyReducer from "./currencyReducer";
import wishlistReducer from "./wishlistReducer";

const rootReducer = combineReducers({
  multilanguage: createMultilanguageReducer({ currentLanguageCode: "en" }),
  currencyData: currencyReducer,
  cartData: cartReducer,
  wishlistData: wishlistReducer,
  compareData: compareReducer,
});

export default rootReducer;
