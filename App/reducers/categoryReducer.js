import ACTIONS from '../actions/types';
import {createSelector} from 'reselect';
import {
  categoriesSortModeSelector,
  locationsSortModeSelector,
} from './settingsReducer';
import {sortCategories} from '../utils/categoryUtils';

/**
 * ACTIONS.ADD_CATEGORY: payload should be: 
 *  {
      category: {name: 'ABC'},
      categories: [...categoiresArray]
    }
 * ACTIONS.DELETE_CATEGORY: payload should be: 
 *  {
      category: {name: 'ABC'},
      categories: [...categoiresArray],
      locations: [...locationsArray]
    }
 * ACTIONS.EDIT_CATEGORY: payload should be: 
 *  {
      oldCategory: {name: 'ABC'},
      newCategory: {name: 'DEF'},
      categories: [...categoriesArray],
      locations: [...locationsArray],
    }
 */

const DEFAULT_STATE = {categories: []};

const CategoryReducer = (state = DEFAULT_STATE, action) => {
  const {type, payload} = action;
  switch (type) {
    case ACTIONS.ADD_CATEGORY:
    case ACTIONS.DELETE_CATEGORY:
    case ACTIONS.EDIT_CATEGORY:
      return Object.assign({}, state, {
        categories: payload.categories,
      });
    default:
      return state;
  }
};

export const categoryReducerSelector = ({categoryReducer}) => categoryReducer;
export const categoriesSelector = createSelector(
  categoryReducerSelector,
  ({categories}) => categories,
);
export const sortedCategoriesSelector = createSelector(
  categoriesSelector,
  categoriesSortModeSelector,
  (categories, sortMode) => sortCategories(categories, sortMode),
);
export const sortedLocationSectionsSelector = createSelector(
  categoriesSelector,
  locationsSortModeSelector,
  (categories, sortMode) => sortCategories(categories, sortMode),
);

export default CategoryReducer;
