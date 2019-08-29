import {isCategoryExists} from '../utils/categoryUtils';
import {
  addCategory,
  deleteCategory,
  editCategory,
} from '../utils/localStorageUtility';
import ACTIONS from '../actions/types';

/**
 * ACTIONS.ADD_CATEGORY: payload should be: 
 *  {
      category: {name: 'ABC'}
    }
 * ACTIONS.DELETE_CATEGORY: payload should be: 
 *  {
      category: {name: 'ABC'}
    }
 * ACTIONS.EDIT_CATEGORY: payload should be: 
 *  {
      oldCategory: {name: 'ABC'},
      newCategory: {name: 'DEF'}
    }
 */

const categoryMiddleware = store => next => action => {
  const {categoryReducer} = store.getState();
  const {categories} = categoryReducer;
  const {payload, type} = action;
  switch (type) {
    case ACTIONS.ADD_CATEGORY:
      if (!isCategoryExists(categories, payload.category)) {
        addCategory(payload.category).then(savedCategories => {
          action.payload.categories = savedCategories;
          next(action);
        });
      }
      return;
    case ACTIONS.DELETE_CATEGORY:
      if (isCategoryExists(categories, payload.category)) {
        deleteCategory(payload.category).then(({categories, locations}) => {
          action.payload.categories = categories;
          action.payload.locations = locations;
          next(action);
        });
      }
      return;
    case ACTIONS.EDIT_CATEGORY:
      if (!isCategoryExists(payload.old, categories)) {
        editCategory(payload.oldCategory, payload.newCategory).then(
          ({categories, locations}) => {
            action.payload.categories = categories;
            action.payload.locations = locations;
            next(action);
          },
        );
        return;
      }
      return;
    default:
      return next(action);
  }
};

export default categoryMiddleware;
