import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import auth from './authSlice';

export const store = configureStore({
    reducer: combineReducers({
        auth,
    })
});