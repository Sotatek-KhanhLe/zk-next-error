import { combineReducers } from '@reduxjs/toolkit';

import exampleSliceReducer from './exampleSlice';

const rootReducer = combineReducers({
  example: exampleSliceReducer,
});

export default rootReducer;
