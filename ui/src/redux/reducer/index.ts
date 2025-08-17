import { combineReducers } from "redux";
import handleTree from "./handleTree";
import handleDocument from "./handleDocument";
const rootReducers = combineReducers({
    handleTree,handleDocument
})
export default rootReducers