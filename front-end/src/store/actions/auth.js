// import axios from "axios";
import * as actionTypes from "./actionTypes";
import { conf } from "../../config/config"
import { Axios, AxiosNoAUTH }   from "../utility"
import axios from "axios";


export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = user => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    user
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error.response ? error.response.data : null
  };
};



export const signupStart = () => {
  return {
    type: actionTypes.SIGNUP_START
  };
};

export const signupSuccess = data => {
  return {
    type: actionTypes.SIGNUP_SUCCESS,
    message: data ? data.message :  "Success"
  };
};

export const signupFail = error => {
  return {
    type: actionTypes.SIGNUP_FAIL,
    error: error.response ? (error.response.data ? error.response.data.message : "failed"): null
  };
};


export const signupOTPverifyStart = () => {
  return {
    type: actionTypes.SIGNUP_OTPVERIFY_START
  };
};

export const signupOTPverifySuccess = data => {
  return {
    type: actionTypes.SIGNUP_OTPVERIFY_SUCCESS,
    message: data ? data.message : "Success"
  };
};

export const signupOTPverifyFail = error => {
  return {
    type: actionTypes.SIGNUP_OTPVERIFY_FAIL,
    error: error.response ? (error.response.data ? error.response.data.message : "failed"): null
  };
};

export const getProfileStart = () => {
  return {
    type: actionTypes.GET_USER_PROFILE_START
  };
};

export const getProfileSuccess = user => {
  return {
    type: actionTypes.GET_USER_PROFILE_SUCCESS,
    user
  };
};

export const getProfileFail = error => {
  return {
    type: actionTypes.GET_USER_PROFILE_FAIL,
    error: error.response ? (error.response.data ? error.response.data.message : "failed"): null
  };
};

export const clearError = () => {
  return {
    type: actionTypes.CLEAR_ERROR,
    error: null
  };
};


export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("Authorzation");
  // window.location.reload();
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    AxiosNoAUTH
      .post(`${conf.base_api_url}login`, {
        email: username,
        password: password
      })
      .then(res => {
        const user = {
          token: res.data.response.token,
          username,
          user: res.data.response.user_data,
          // is_student: res.data.user_type.is_student,
          // is_teacher: res.data.user_type.is_teacher,
          // expirationDate: new Date(new Date().getTime() + 3600 * 1000)
        };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("Authorization", JSON.stringify(res.data));

        dispatch(authSuccess(user));
        // dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      });
  };
};

export const authSignup = (
  full_name,
  email,
  password,
  phone_number,
  user_type
) => {
  return dispatch => {
    dispatch(signupStart());
    const user = {
      full_name,
      email,
      password,
      phone_number,
      user_type
    };

    


    // // export const createadminUsers = (data) => {
    //   console.log('in meeeeeeeeee')
      // return fetch(`${conf.base_api_url}api/signup`, {
      //   method: 'POST',
      //   body: JSON.stringify(user)
      // })
      // .then(res => {
      //   const user = {
      //     token: res.data.key,
      //     full_name,
      //     userId: res.data.user,
      //     // is_student,
      //     // is_teacher: !is_student,
      //     expirationDate: new Date(new Date().getTime() + 3600 * 1000)
      //   };
      //   localStorage.setItem("user", JSON.stringify(user));
      //   dispatch(authSuccess(user));
      //   dispatch(checkAuthTimeout(3600));
      // })
      // .catch(err => {
      //   dispatch(authFail(err));
      // });
    


      AxiosNoAUTH
      .post(`${conf.base_api_url}signup`, user  )
      .then(res => {
        dispatch(signupSuccess({message:res.data.message}));
        // dispatch(checkAuthTimeout(3600));
        setTimeout(() => {
          dispatch(clearError());
        }, 4000);
      })
      .catch(err => {
        dispatch(signupFail(err));
        setTimeout(() => {
          dispatch(clearError());
        }, 2000);
      });
  };
};

export const signupOPTVerify = (data) => {
  return dispatch => {
    dispatch(signupOTPverifyStart());
    AxiosNoAUTH
      .post(`${conf.base_api_url}verify-signup-otp`, {
        varification_for:1,
        otp:data.otp,
        email:data.email
      })
      .then(res => {
        
        dispatch(signupOTPverifySuccess({message:res.data.message}));
        setTimeout(() => {
          dispatch(clearError());
        }, 4000);
      })
      .catch(err => {
        dispatch(signupOTPverifyFail(err));
        setTimeout(() => {
          dispatch(clearError());
        }, 4000);
      });
  };
};



export const getUserProfile = () => {
  return dispatch => {
    dispatch(getProfileStart());
    // Axios
    axios
      .get(`${conf.base_api_url}user/user-profile`, {headers: {'Authorization': 'bearer '+ localStorage.getItem('user') ? 'bearer '+ JSON.parse(localStorage.getItem('user')).token : null }    })
      .then(res => {
        const user = res.data.response;
        dispatch(getProfileSuccess(user));
        // dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(getProfileFail(err));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      });
  };
};


export const authCheckState = () => {
  return dispatch => {
    let auth_data = JSON.parse(localStorage.getItem("Authorization"));
    let user = JSON.parse(localStorage.getItem("user"));
    if (user === undefined || user === null) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(user.expirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        // auth_data = auth_data.response.user_data;
        // auth_data.token = user.token;
        // auth_data.username = user.username;

        const userData = auth_data.response.user_data; 
        
          userData.token = user.token;
          userData.username = user.username;
         

        dispatch(authSuccess(userData));
        // dispatch(
        //   checkAuthTimeout(
        //     (expirationDate.getTime() - new Date().getTime()) / 1000
        //   )
        // );
      }
    }
  };
};


