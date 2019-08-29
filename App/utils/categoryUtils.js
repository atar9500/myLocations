import {SORT_MODE} from '../reducers/settingsReducer';

export const isCategoryExists = (categories, category) => {
  let indexOfFoundCategory = findCategoryIndex(categories, category);
  return indexOfFoundCategory !== -1;
};

export const filterCategories = (categories, categoryToFilterOut) => {
  if (!categories || !categories instanceof Array) {
    return [];
  }
  if (!categoryToFilterOut || !categoryToFilterOut.name) {
    return categories;
  }
  return categories.filter(item => item.name !== categoryToFilterOut.name);
};

export const findCategoryIndex = (categories, category) => {
  if (!categories || !category || !category.name) {
    return -1;
  }
  return categories.findIndex(item => item.name === category.name);
};

export const sortCategories = (categories, sortMode) => {
  switch (sortMode) {
    case SORT_MODE.ALPHABETICALLY:
      const clonedCategories = [...categories];
      return clonedCategories.sort((a, b) => a.name.localeCompare(b.name));
    case SORT_MODE.DEFAULT:
    default:
      return categories;
  }
};
