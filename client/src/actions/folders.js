import axios from 'axios';
import {
  GET_FOLDERS,
  GOT_FOLDERS,
  FOLDERS_ERRORS,
  CLEAR_FOLDERS_ERRORS
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getFolders = () => async dispatch => {
  try {
    dispatch({
      type: GET_FOLDERS
    });

    const res = await axios.get('/api/files/myFolders');

    dispatch({
      type: GOT_FOLDERS,
      payload: res.data
    });
  } catch (err) {
    //
  }
};

export const createFolder = formData => async dispatch => {
  try {
    dispatch({
      type: CLEAR_FOLDERS_ERRORS
    });
    await axios.post('/api/files/createFolder', formData, config);
    dispatch(getFolders());
  } catch (err) {
    dispatch({ type: FOLDERS_ERRORS, payload: err.response.data.errors });
  }
};

export const joinFolder = formData => async dispatch => {
  try {
    dispatch({
      type: CLEAR_FOLDERS_ERRORS
    });
    await axios.post('/api/files/joinFolder', formData, config);
    dispatch(getFolders());
  } catch (err) {
    dispatch({ type: FOLDERS_ERRORS, payload: err.response.data.errors });
  }
};
