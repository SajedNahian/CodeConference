import axios from 'axios';
import { GET_FOLDER } from './types';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getFolder = folderId => async dispatch => {
  try {
    const res = await axios.get(`/api/files/${folderId}`);
    dispatch({
      type: GET_FOLDER,
      payload: res.data
    });
  } catch (err) {
    //
  }
};

export const addFile = (folderId, formData) => async dispatch => {
  try {
    await axios.post(`/api/files/${folderId}/createFile`, formData, config);

    dispatch(getFolder(folderId));
  } catch (err) {}
};
