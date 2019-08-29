import ACTIONS from '../actions/types';
import {createSelector} from 'reselect';
import {
  sortLocations,
  filterLocationsByCategory,
  sectionLocations,
} from '../utils/locationUtils';
import {
  locationsSortModeSelector,
  groupModeLocationsSelector,
} from './settingsReducer';
import {
  categoriesSelector,
  sortedCategoriesSelector,
  sortedLocationSectionsSelector,
} from './categoryReducer';

/**
 * ACTIONS.ADD_LOCATION: payload should be: 
 *  {
      location: {
        name: 'ABC',
        address: 'DEF',
        category: 'GHI',
        coordinates: {latitude: 54.2, longitude: -78.2}
      },
      locations: [...locationsArray]
    }
 * ACTIONS.DELETE_LOCATION: payload should be: 
 *  {
      location: {
        name: 'ABC',
        address: 'DEF',
        category: 'GHI',
        coordinates: {latitude: 54.2, longitude: -78.2}
      },
      locations: [...locationsArray]
    }
 * ACTIONS.EDIT_LOCATION: payload should be: 
 *  {
      location: {
        name: 'ABC',
        address: 'DEF',
        category: 'GHI',
        coordinates: {latitude: 54.2, longitude: -78.2}
      },
      locations: [...locationsArray],
      coordinates: {latitude: 54.2, longitude: -78.2}
    }
 * ACTIONS.DELETE_CATEGORY: payload should be: 
 *  {
      category: {name: 'ABC'},
      categories: [...categoriesArray],
      locations: [...locationsArray],
    }
 * ACTIONS.EDIT_CATEGORY: payload should be: 
 *  {
      oldCategory: {name: 'ABC'},
      newCategory: {name: 'DEF'},
      categories: [...categoriesArray],
      locations: [...locationsArray],
    }
 */

const DEFAULT_STATE = {locations: []};

const locationReducer = (state = DEFAULT_STATE, action) => {
  const {type, payload} = action;

  switch (type) {
    case ACTIONS.ADD_LOCATION:
    case ACTIONS.DELETE_LOCATION:
    case ACTIONS.EDIT_LOCATION:
    case ACTIONS.DELETE_CATEGORY:
    case ACTIONS.EDIT_CATEGORY:
      return Object.assign({}, state, {
        locations: payload.locations,
      });
    default:
      return state;
  }
};

export const locationReducerSelector = state => state.locationReducer;
export const locationsSelector = createSelector(
  locationReducerSelector,
  ({locations}) => locations,
);
export const sortedLocationsSelector = createSelector(
  locationsSelector,
  locationsSortModeSelector,
  (locations, sortMode) => sortLocations(locations, sortMode),
);
export const sectionedLocationsSelector = createSelector(
  sortedLocationSectionsSelector,
  sortedLocationsSelector,
  (sections, locations) => sectionLocations(sections, locations),
);

export default locationReducer;
