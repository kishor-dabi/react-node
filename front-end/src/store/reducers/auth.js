import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  username: null,
  userId: null,
  error: null,
  loading: false,
  user: null
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.user.token,
    username: action.user.username,
    error: null,
    loading: false,
    user: action.user
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    user: null,
    username: null,
    error: null,
    loading: false
  });
};

const clearError = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};


const signupStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const signupSuccess = (state, action) => {
  return updateObject(state, {
    token: action.user.token,
    // username: action.user.username,
    error: null,
    loading: false,
    // user: action.user
  });
};

const signupFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};


const getProfileStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const getProfileSuccess = (state, action) => {
  return updateObject(state, {
    user: action.user,
    loading: false
  });
};

const getProfileFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};



const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.SIGNUP_START:
      return signupStart(state, action);
    case actionTypes.SIGNUP_SUCCESS:
      return signupSuccess(state, action);
    case actionTypes.SIGNUP_FAIL:
      return signupFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.CLEAR_ERROR:
      return clearError(state, action);
    case actionTypes.GET_USER_PROFILE_START:
      return getProfileStart(state, action);
    case actionTypes.GET_USER_PROFILE_SUCCESS:
      return getProfileSuccess(state, action);
    case actionTypes.GET_USER_PROFILE_FAIL:
      return getProfileFail(state, action);
          
    default:
      return state;
  }
};

export default reducer;
