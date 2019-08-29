import ACTIONS from './types';
import {SETTINGS} from '../reducers/settingsReducer';

export const CategoryActions = {
  add: category => ({
    type: ACTIONS.ADD_CATEGORY,
    payload: {category: category},
  }),
  delete: category => ({
    type: ACTIONS.DELETE_CATEGORY,
    payload: {category: category},
  }),
  edit: (oldCategory, newCategory) => ({
    type: ACTIONS.EDIT_CATEGORY,
    payload: {oldCategory: oldCategory, newCategory: newCategory},
  }),
};

export const LocationActions = {
  add: location => ({
    type: ACTIONS.ADD_LOCATION,
    payload: {location: location},
  }),
  delete: location => ({
    type: ACTIONS.DELETE_LOCATION,
    payload: {location: location},
  }),
  edit: (location, coordinates) => ({
    type: ACTIONS.EDIT_LOCATION,
    payload: {location: location, coordinates: coordinates},
  }),
};

export const SettingActions = {
  changeCategoriesSort: sortMode => ({
    type: ACTIONS.EDIT_SETTING,
    payload: {setting: {key: SETTINGS.CATEGORIES_SORT, value: sortMode}},
  }),
  changeLocationsSort: sortMode => ({
    type: ACTIONS.EDIT_SETTING,
    payload: {setting: {key: SETTINGS.LOCATIONS_SORT, value: sortMode}},
  }),
  changeLocationGrouping: groupingMode => ({
    type: ACTIONS.EDIT_SETTING,
    payload: {
      setting: {
        key: SETTINGS.GROUP_LOCATIONS,
        value: groupingMode,
      },
    },
  }),
};
