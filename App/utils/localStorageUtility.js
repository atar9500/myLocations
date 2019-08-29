import AsyncStorage from '@react-native-community/async-storage';
import {
  findLocationIndex,
  filterLocations,
  filterLocationsByCategory,
} from './locationUtils';
import {findCategoryIndex, filterCategories} from './categoryUtils';
import {
  SORT_MODE,
  SETTINGS,
  LOCATION_GROUPING_MODE,
} from '../reducers/settingsReducer';

const KEYS = {
  CATEGORIES: 'categories',
  LOCATIONS: 'locations',
  CATEGORIES_SORT: SETTINGS.CATEGORIES_SORT,
  LOCATIONS_SORT: SETTINGS.LOCATIONS_SORT,
  GROUP_LOCATIONS: SETTINGS.GROUP_LOCATIONS,
};

export const changeSetting = async (key, setting) => {
  try {
    await AsyncStorage.setItem(key, setting);
  } catch (error) {
    console.error(`localStorageUtility.changeSetting: ${error}`);
  }
};

export const addCategory = async category => {
  try {
    return await appendItemToArray(KEYS.CATEGORIES, category);
  } catch (error) {
    console.error(`localStorageUtility.addCategory: ${error}`);
  }
};

export const addLocation = async location => {
  try {
    return await appendItemToArray(KEYS.LOCATIONS, location);
  } catch (error) {
    console.error(`localStorageUtility.addLocation: ${error}`);
  }
};

export const editCategory = async (oldCategory, newCategory) => {
  try {
    const categories = await getItem(KEYS.CATEGORIES);
    const categoryIndex = findCategoryIndex(categories, oldCategory);
    categories[categoryIndex] = newCategory;
    const locations = await getItem(KEYS.LOCATIONS);
    locations.forEach(location => {
      if (location.category == oldCategory.name) {
        location.category = newCategory.name;
      }
    });
    const categorySet = [KEYS.CATEGORIES, JSON.stringify(categories)];
    const locationsSet = [KEYS.LOCATIONS, JSON.stringify(locations)];
    await AsyncStorage.multiSet([categorySet, locationsSet]);
    return {categories: categories, locations: locations};
  } catch (error) {
    console.error(`localStorageUtility.editCategory: ${error}`);
  }
};

export const editLocation = async (location, coordinates) => {
  try {
    const locations = await getItem(KEYS.LOCATIONS);
    const locationIndex = findLocationIndex(locations, coordinates);
    locations[locationIndex] = location;
    await AsyncStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locations));
    return locations;
  } catch (error) {
    console.error(`localStorageUtility.editLocation: ${error}`);
  }
};

export const deleteCategory = async category => {
  try {
    const categories = await getItem(KEYS.CATEGORIES);
    const filteredCategories = filterCategories(categories, category);
    const locations = await getItem(KEYS.LOCATIONS);
    const filteredLocations = filterLocationsByCategory(locations, category);
    const categorySet = [KEYS.CATEGORIES, JSON.stringify(filteredCategories)];
    const locationsSet = [KEYS.LOCATIONS, JSON.stringify(filteredLocations)];
    await AsyncStorage.multiSet([categorySet, locationsSet]);
    return {categories: filteredCategories, locations: filteredLocations};
  } catch (error) {
    console.error(`localStorageUtility.editCategory: ${error}`);
  }
};

export const deleteLocation = async location => {
  try {
    const locations = await getItem(KEYS.LOCATIONS, []);
    const filteredLocations = filterLocations(locations, location.coordinates);
    await AsyncStorage.setItem(
      KEYS.LOCATIONS,
      JSON.stringify(filteredLocations),
    );
    return filteredLocations;
  } catch (error) {
    console.error(`localStorageUtility.deleteLocation: ${error}`);
  }
};

export const getInitialStore = async () => {
  try {
    const store = {
      categoryReducer: [],
      locationReducer: [],
      settingsReducer: {},
    };
    const storage = await getAllStorage();
    store.categoryReducer.categories = storage[KEYS.CATEGORIES];
    store.locationReducer.locations = storage[KEYS.LOCATIONS];
    store.settingsReducer[SETTINGS.CATEGORIES_SORT] =
      storage[SETTINGS.CATEGORIES_SORT];
    store.settingsReducer[SETTINGS.LOCATIONS_SORT] =
      storage[SETTINGS.LOCATIONS_SORT];
    store.settingsReducer[SETTINGS.GROUP_LOCATIONS] =
      storage[SETTINGS.GROUP_LOCATIONS];
    return store;
  } catch (error) {
    console.error(`localStorageUtility.getInitialState: ${error}`);
  }
};

const appendItemToArray = async (key, item) => {
  try {
    const savedItems = await getItem(key);
    savedItems.unshift(item);
    await AsyncStorage.setItem(key, JSON.stringify(savedItems));
    return savedItems;
  } catch (error) {
    console.error(`localStorageUtility.appendItemToArray: ${error}`);
  }
};

const getItem = async key => {
  try {
    const rawSavedItem = await AsyncStorage.getItem(key);
    let savedItem = getDefaultValuePerKey(key);
    if (!!rawSavedItem) {
      savedItem = JSON.parse(rawSavedItem);
    }
    return savedItem;
  } catch (error) {
    console.error(`localStorageUtility.getItem: ${error}`);
  }
};

const getAllStorage = async () => {
  try {
    let storage = {};
    const rawData = await AsyncStorage.multiGet(Object.values(KEYS));
    rawData.forEach(data => {
      const key = data[0];
      let value = data[1];
      if (!value) {
        storage[key] = getDefaultValuePerKey(key);
      } else {
        switch (key) {
          case KEYS.CATEGORIES:
          case KEYS.LOCATIONS:
            storage[key] = JSON.parse(value);
            break;
          case SETTINGS.LOCATIONS_SORT:
          case SETTINGS.CATEGORIES_SORT:
            storage[key] = value;
            break;
          case SETTINGS.GROUP_LOCATIONS:
            storage[key] = value;
            break;
        }
      }
    });
    return storage;
  } catch (error) {
    console.error(`localStorageUtility.getAllStorage: ${error}`);
  }
};

const getDefaultValuePerKey = key => {
  switch (key) {
    case KEYS.CATEGORIES:
    case KEYS.LOCATIONS:
      return [];
    case SETTINGS.LOCATIONS_SORT:
    case SETTINGS.CATEGORIES_SORT:
      return SORT_MODE.DEFAULT;
    case SETTINGS.GROUP_LOCATIONS:
      return LOCATION_GROUPING_MODE.CATEGORY;
  }
};
