import { createStore} from "@reduxjs/toolkit";
import rootReducer from "./reducer";

export default createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
