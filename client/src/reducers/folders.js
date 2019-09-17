import {
  GET_FOLDERS,
  GOT_FOLDERS,
  FOLDERS_ERRORS,
  CLEAR_FOLDERS_ERRORS
} from './../actions/types';
const initialState = {
  folders: {},
  loading: true,
  errors: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FOLDERS:
      return {
        ...state,
        loading: false
      };
    case GOT_FOLDERS:
      return {
        ...state,
        folders: payload,
        loading: false
      };
    case FOLDERS_ERRORS:
      return {
        ...state,
        errors: payload
      };
    case CLEAR_FOLDERS_ERRORS:
      return {
        ...state,
        errors: []
      };
    default:
      return state;
  }
}
