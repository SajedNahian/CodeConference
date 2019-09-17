import axios from 'axios';
import { GET_FILE } from './types';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const loadFile = (folderId, fileId) => async dispatch => {
  try {
    const res = await axios.get(`/api/files/${folderId}/${fileId}`);

    dispatch({
      type: GET_FILE,
      payload: res.data.file
    });
  } catch (err) {}
};
