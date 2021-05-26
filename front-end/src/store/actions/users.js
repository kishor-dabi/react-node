// import axios from "axios";
import * as actionTypes from "./actionTypes";
import { Axios, AxiosNoAUTH }   from "../utility"
import { conf } from "../../config/config";
import axios from "axios";



export const getUsersStart = () => {
    return {
      type: actionTypes.GET_USERS_START
    };
  };
  
  export const getUsersSuccess = users => {
    return {
      type: actionTypes.GET_USERS_SUCCESS,
      users
    };
  };
  
  export const getUsersFail = error => {
    return {
      type: actionTypes.GET_USERS_FAIL,
      error: error.response ? error.response.message : null
    };
  };
  
  export const clearError = () => {
    return {
      type: actionTypes.CLEAR_ERROR,
      error: null
    };
  };
  
  
  
  export const getUsersList = () => {
    return dispatch => {
      dispatch(getUsersStart());
      axios
        .get(`${conf.base_api_url}user/users`, {headers: {'Authorization': 'bearer '+ localStorage.getItem('user') ? 'bearer '+ JSON.parse(localStorage.getItem('user')).token : null }    })
        .then(res => {
          const user = res.data.response;
          dispatch(getUsersSuccess(user));
          // dispatch(checkAuthTimeout(3600));
        })
        .catch(err => {
          dispatch(getUsersFail(err));
          setTimeout(() => {
            dispatch(clearError());
          }, 4000);
        });
    };
  };
  