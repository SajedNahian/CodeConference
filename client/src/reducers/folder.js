import { GET_FOLDER } from './../actions/types';
const initialState = {
  folder: {
    isOwner: null,
    files: []
  },
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FOLDER:
      return {
        folder: payload,
        loading: false
      };
    default:
      return state;
  }
}
