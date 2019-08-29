import {isLocationExists, validateCoordinates} from '../utils/locationUtils';
import {changeSetting} from '../utils/localStorageUtility';
import ACTIONS from '../actions/types';

/**
 * ACTIONS.EDIT_SETTING: payload should be: 
 *  {
      setting: {
        key: "ABC",
        value: "DEF"
      }
    }
 */

const locationMiddleware = store => next => action => {
  const {payload, type} = action;
  switch (type) {
    case ACTIONS.EDIT_SETTING:
      changeSetting(payload.setting.key, payload.setting.value).then(() =>
        next(action),
      );
      return;
    default:
      return next(action);
  }
};

export default locationMiddleware;
