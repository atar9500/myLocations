import {applyMiddleware} from 'redux';
import categoryMiddleware from './categoryMiddleware';
import locationMiddleware from './locationMiddleware';
import settingsMiddleware from './settingsMiddleware';

export default applyMiddleware(
  categoryMiddleware,
  locationMiddleware,
  settingsMiddleware,
);
