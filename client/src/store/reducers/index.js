import { combineReducers } from 'redux';
import auth from "./auth.reducer";
import user from './user.reducer'

const createReducer = (asyncReducers) =>
    combineReducers({
        auth,
        user,
        ...asyncReducers
    });

export default createReducer;
