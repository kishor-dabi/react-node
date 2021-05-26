import fetch from 'isomorphic-fetch'
import axios from "axios";


export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};




// import Config from '../config'

const handleHTTPErrors = (res) => {
  if (res.ok) return res
  return res.json().then((err) => { throw err })
}
/* 
export default (url, options) => {
  const jwtToken = null;
  console.log(typeof option);
  if (jwtToken) {
    let authAddedOptions = options
    if (typeof options !== 'object') {
      authAddedOptions = {}
    }
    if (typeof authAddedOptions.headers !== 'object') {
      authAddedOptions.headers = {}
    }
    authAddedOptions.headers = {
      ...authAddedOptions.headers,
      Authorization: jwtToken,
      Accept: 'application/json',
      'Content-Type': "application/json"
    }
    return fetch(url, authAddedOptions).then(handleHTTPErrors)
  } else {
    let op = {
      ...options,
      Accept: 'application/json',
    }
    return fetch(url, op).then(handleHTTPErrors)
  }
}
 */

import * as data from "./reducers/auth"

export const  Axios = axios.create({
  baseURL: 'http://localhost:8888/api/',
  timeout: 1200000,
  headers: {'Authorization': localStorage.getItem('user') ? 'bearer '+ JSON.parse(localStorage.getItem('user')).token : null }
});

export const AxiosNoAUTH = axios.create({
  baseURL: 'http://localhost:8888/api/',
  timeout: 1200000,
  // headers: {'Authorization': localStorage.getItem('user') ? 'bearer '+ JSON.parse(localStorage.getItem('user')).token : null }
});