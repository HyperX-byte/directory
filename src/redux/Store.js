import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import { composeWithDevTools } from "redux-devtools-extension";
const initialState = {};
const reducer = combineReducers({
    userInfo: "",
  });
const middleWare = [thunk];

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleWare)
  // composeWithDevTools(applyMiddleware(...middleWare))
);

export default store;
