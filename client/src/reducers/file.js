import { GET_FILE } from '../actions/types';

const initialState = {
  file: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FILE:
      return {
        file: payload
      };
    default:
      return state;
  }
}
