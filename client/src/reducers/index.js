import { combineReducers } from 'redux';
import auth from './auth';
import folders from './folders';
import folder from './folder';
import file from './file';

export default combineReducers({ auth, folders, folder, file });
