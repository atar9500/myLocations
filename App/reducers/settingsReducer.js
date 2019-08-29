import ACTIONS from '../actions/types';
import {createSelector} from 'reselect';

export const SETTINGS = {
  CATEGORIES_SORT: 'categoriesSort',
  LOCATIONS_SORT: 'locationsSort',
  GROUP_LOCATIONS: 'groupLocations',
};

export const SORT_MODE = {
  ALPHABETICALLY: 'alphabetically',
  DEFAULT: 'default',
};

export const LOCATION_GROUPING_MODE = {
  NONE: 'none',
  CATEGORY: 'category',
};

const DEFAULT_STATE = {
  [SETTINGS.CATEGORIES_SORT]: SORT_MODE.DEFAULT,
  [SETTINGS.LOCATIONS_SORT]: SORT_MODE.DEFAULT,
  [SETTINGS.GROUP_LOCATIONS]: 'false',
};

/**
 * ACTIONS.EDIT_SETTING: payload should be: 
 *  {
      setting: {
        key: "ABC",
        value: "DEF"
      }
    }
 */

const settingsReducer = (state = DEFAULT_STATE, action) => {
  const {type, payload} = action;
  switch (type) {
    case ACTIONS.EDIT_SETTING:
      return Object.assign({}, state, {
        [payload.setting.key]: payload.setting.value,
      });
    default:
      return state;
  }
};

export const settingsReducerSelector = ({settingsReducer}) => settingsReducer;
export const categoriesSortModeSelector = createSelector(
  settingsReducerSelector,
  ({categoriesSort}) => categoriesSort,
);
export const locationsSortModeSelector = createSelector(
  settingsReducerSelector,
  ({locationsSort}) => locationsSort,
);
export const groupModeLocationsSelector = createSelector(
  settingsReducerSelector,
  ({groupLocations}) => groupLocations,
);

export default settingsReducer;
