import { combineReducers } from '@reduxjs/toolkit';

import exampleSliceReducer from './exampleSlice';
import uiSlice from './uiSlice';

const rootReducer = combineReducers({
  example: exampleSliceReducer,
  ui: uiSlice,
});

export default rootReducer;
