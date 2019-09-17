import axios from 'axios';
import setAuthToken from './../utils/setAuthToken';
import {
  USER_LOADED,
  AUTH_ERROR,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS,
  SIGNOUT,
  SIGNIN_SUCCESS,
  SIGNIN_ERROR,
  CLEAR_AUTH_ERRORS
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/users/me');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const signUpUser = formData => async dispatch => {
  try {
    const res = await axios.post('/api/users/createUser', formData, config);
    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data.token
    });

    localStorage.setItem('token', res.data.token);

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: SIGNUP_ERROR,
      payload: err.response.data.errors
    });
  }
};

export const signOutUser = () => dispatch => {
  localStorage.removeItem('token');
  dispatch({
    type: SIGNOUT
  });
};

export const signInUser = formData => async dispatch => {
  try {
    const res = await axios.post('/api/users/login', formData, config);

    dispatch({
      type: SIGNIN_SUCCESS,
      payload: res.data.token
    });

    localStorage.setItem('token', res.data.token);

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: SIGNIN_ERROR,
      payload: err.response.data.errors
    });
  }
};

export const clearAuthErrors = () => dispatch => {
  dispatch({
    type: CLEAR_AUTH_ERRORS
  });
};
