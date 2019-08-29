import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import locationReducer from './locationReducer';
import settingsReducer from './settingsReducer';

const AppReducers = combineReducers({
  categoryReducer,
  locationReducer,
  settingsReducer,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
};

export default rootReducer;
