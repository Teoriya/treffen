import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import auth from './authSlice';
import activate from './activateSlice';

export const store = configureStore({
    reducer: combineReducers({
        auth,
        activate
    })
});