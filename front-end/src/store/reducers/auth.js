import actions from "redux-form/lib/actions";
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  username: null,
  userId: null,
  error: null,
  loading: false,
  user: null,
  isSignupSuccess:false,
  successMessage: "",
  isVerificationSuccess:false
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
    loading: false,
    successMessage: null,
  });
};


const signupStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    isSignupSuccess:false
  });
};

const signupSuccess = (state, action) => {
  return updateObject(state, {
    // token: action.user.token,
    // username: action.user.username,
    successMessage: action.message,
    loading: false,
    isSignupSuccess: true
  });
};

const signupFail = (state, action) => {
  // console.log("signup fail", action);
  return updateObject(state, {
    error: action.error,
    loading: false,
    isSignupSuccess: false
  });
};


const signupOTPverifyStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    successMessage:null,
    // isSignupSuccess:false
  });
};

const signupOTPverifySuccess = (state, action) => {
  console.log(action);
  return updateObject(state, {

    successMessage: action.message,
    loading: false,
    isSignupSuccess: false,
    isVerificationSuccess: true
  });
};

const signupOTPverifyFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    isSignupSuccess: false,
    isVerificationSuccess:false
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
    case actionTypes.SIGNUP_OTPVERIFY_START:
      return signupOTPverifyStart(state, action);
    case actionTypes.SIGNUP_OTPVERIFY_SUCCESS:
      return signupOTPverifySuccess(state, action);
    case actionTypes.SIGNUP_OTPVERIFY_FAIL:
      return signupOTPverifyFail(state, action);
          
    default:
      return state;
  }
};

export default reducer;
