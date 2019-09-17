import {
  USER_LOADED,
  AUTH_ERROR,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS,
  SIGNOUT,
  SIGNIN_ERROR,
  SIGNIN_SUCCESS,
  CLEAR_AUTH_ERRORS
} from './../actions/types';
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  errors: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case SIGNIN_ERROR:
    case SIGNUP_ERROR:
      return {
        ...state,
        errors: payload
      };
    case SIGNIN_SUCCESS:
    case SIGNUP_SUCCESS:
      return {
        ...state,
        token: payload,
        errors: []
      };
    case SIGNOUT:
      return {
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        errors: []
      };
    case CLEAR_AUTH_ERRORS:
      return {
        ...state,
        errors: []
      };
    default:
      return state;
  }
}
