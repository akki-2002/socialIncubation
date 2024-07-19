import { combineReducers } from "redux";

import authReducer from "./authReducer";
import postReducer from "./postReducer";
import chatReducer from "./ChatUserReducer";

// export const reducers = combineReducers({authReducer, postReducer})
export const reducers = combineReducers({authReducer,postReducer, chatReducer})