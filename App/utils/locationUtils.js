import {SORT_MODE} from '../reducers/settingsReducer';

export const isLocationExists = (queryCoordinates, locations) => {
  if (!locations) {
    return false;
  }
  const {latitude, longitude} = queryCoordinates;
  let indexOfFoundLocation = locations.findIndex(
    ({coordinates}) =>
      coordinates.latitude == latitude && coordinates.longitude == longitude,
  );
  return indexOfFoundLocation !== -1;
};

export const filterLocations = (locations, {latitude, longitude}) =>
  locations.filter(
    ({coordinates}) =>
      coordinates.latitude != latitude && coordinates.longitude != longitude,
  );

export const filterLocationsByCategory = (
  locations,
  category,
  filterOut = true,
) =>
  locations.filter(item =>
    filterOut ? item.category != category.name : item.category == category.name,
  );

export const findLocationIndex = (locations, {latitude, longitude}) =>
  locations.findIndex(
    ({coordinates}) =>
      coordinates.latitude == latitude && coordinates.longitude == longitude,
  );

export const validateCoordinates = coordinates => {
  if (!coordinates) {
    return false;
  }
  const {latitude, longitude} = coordinates;
  return (
    (!!latitude || latitude === 0) &&
    (!!longitude || longitude === 0) &&
    latitude > -90 &&
    latitude < 90 &&
    longitude > -180 &&
    longitude < 180
  );
};

export const formatCoordinate = (coordinate, isLatitude) => {
  const bottomLimit = isLatitude ? -90 : -180;
  const topLimit = isLatitude ? 90 : 180;
  let formattedCoordinate = coordinate.trim();
  if (isNaN(coordinate)) {
    formattedCoordinate = `0`;
  } else {
    const floatCoordinate = parseFloat(coordinate);
    if (floatCoordinate < bottomLimit || floatCoordinate > topLimit) {
      formattedCoordinate = `${floatCoordinate / 10}`;
    } else if (floatCoordinate == bottomLimit) {
      formattedCoordinate = `${bottomLimit + 0.1}`;
    } else if (floatCoordinate == topLimit) {
      formattedCoordinate = `${topLimit - 0.1}`;
    }
  }
  return formattedCoordinate;
};

export const sortLocations = (locations, sortMode) => {
  switch (sortMode) {
    case SORT_MODE.ALPHABETICALLY:
      const clonedLocations = [...locations];
      return clonedLocations.sort((a, b) => a.name.localeCompare(b.name));
    case SORT_MODE.DEFAULT:
    default:
      return locations;
  }
};

export const sectionLocations = (categories, locations) => {
  const sectionedLocations = [];
  categories.forEach(category => {
    const locationsOfCategory = filterLocationsByCategory(
      locations,
      category,
      false,
    );
    if (locationsOfCategory.length !== 0) {
      sectionedLocations.push({
        category: category.name,
        data: locationsOfCategory,
      });
    }
  });
  return sectionedLocations;
};

export const filterLocationSections = (
  sections,
  categoryToFilter,
  filterOut = true,
) => {
  if (!sections || !sections instanceof Array) {
    return [];
  }
  if (!categoryToFilter || !categoryToFilter.name) {
    return sections;
  }
  return sections.filter(item =>
    filterOut
      ? item.category != categoryToFilter.name
      : item.category == categoryToFilter.name,
  );
};
