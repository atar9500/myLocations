import {isLocationExists, validateCoordinates} from '../utils/locationUtils';
import {
  addLocation,
  editLocation,
  deleteLocation,
} from '../utils/localStorageUtility';
import ACTIONS from '../actions/types';

/**
 * ACTIONS.ADD_LOCATION: payload should be: 
 *  {
      location: {
        name: 'ABC',
        address: 'DEF',
        category: 'GHI',
        coordinates: {latitude: 54.2, longitude: -78.2}
      }
    }
 * ACTIONS.DELETE_LOCATION: payload should be: 
 *  {
      location: {
        name: 'ABC',
        address: 'DEF',
        category: 'GHI',
        coordinates: {latitude: 54.2, longitude: -78.2}
      }
    }
 * ACTIONS.EDIT_LOCATION: payload should be: 
 *  {
      location: {
      name: 'ABC',
      address: 'DEF',
      category: 'GHI',
      coordinates: {latitude: 54.2, longitude: -78.2},
      },
      coordinates: {latitude: 54.2, longitude: -78.2}
    }
 */

const locationMiddleware = store => next => action => {
  const {locationReducer} = store.getState();
  const {payload, type} = action;
  switch (type) {
    case ACTIONS.ADD_LOCATION:
      if (
        validateCoordinates(payload.location.coordinates) &&
        !isLocationExists(
          payload.location.coordinates,
          locationReducer.locations,
        )
      ) {
        addLocation(payload.location).then(locations => {
          action.payload.locations = locations;
          next(action);
        });
      }
      return;
    case ACTIONS.DELETE_LOCATION:
      if (
        validateCoordinates(payload.location.coordinates) &&
        isLocationExists(
          payload.location.coordinates,
          locationReducer.locations,
        )
      ) {
        deleteLocation(payload.location).then(locations => {
          action.payload.locations = locations;
          next(action);
        });
      }
      return;
    case ACTIONS.EDIT_LOCATION:
      if (
        validateCoordinates(payload.coordinates) &&
        isLocationExists(payload.coordinates, locationReducer.locations)
      ) {
        editLocation(payload.location, payload.coordinates).then(locations => {
          action.payload.locations = locations;
          next(action);
        });
      }
      return;
    default:
      return next(action);
  }
};

export default locationMiddleware;
