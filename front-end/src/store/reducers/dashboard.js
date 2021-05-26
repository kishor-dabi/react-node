import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  all_list: [],
  error: null,
  loading: false
};



const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case actionTypes.DASHBOARD_DR_GET:
    //   return getDrList(state, action);
    // case actionTypes.DASHBOARD_DR_GET_SUCCESS:
    //   return getDrSuccess(state, action);
    // case actionTypes.DASHBOARD_DR_GET_FAIL:
    //   return getDrFail(state, action);
    
    default:
      return state;
  }
};

export default reducer;
