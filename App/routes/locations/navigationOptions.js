import React from 'react';
import {HeaderButtons, Item, HiddenItem} from 'react-navigation-header-buttons';
import HeaderIcon, {OverflowIcon} from '../../components/HeaderIcon';
import {ROUTES} from '..';
import {
  SORT_MODE,
  LOCATION_GROUPING_MODE,
} from '../../reducers/settingsReducer';
import {COLOR} from 'react-native-material-ui';

export const NAVIGATION_PARAMS = {
  ADD_LOCATION: 'ADD_LOCATION',
  LOCATIONS_SORT: 'locations_sort',
  LOCATIONS_GROUPING: 'locations_grouping',
  CHANGE_SORT: 'change_sort',
  CHANGE_GROUPING: 'change_grouping',
  // Related to route ROUTES.CHOOSE_CATEGORY
  CATEGORY: 'category',
  EDIT_CATEGORY: 'edit_category',
  DELETE_CATEGORY: 'delete_category',
};

const navigatonOptions = ({navigation}) => {
  const addLocation = navigation.getParam(NAVIGATION_PARAMS.ADD_LOCATION);
  const editCategory = navigation.getParam(NAVIGATION_PARAMS.EDIT_CATEGORY);
  const deleteCategory = navigation.getParam(NAVIGATION_PARAMS.DELETE_CATEGORY);
  const category = navigation.getParam(NAVIGATION_PARAMS.CATEGORY);
  const locationsSort = navigation.getParam(
    NAVIGATION_PARAMS.LOCATIONS_SORT,
    SORT_MODE.DEFAULT,
  );
  const locationsGrouping = navigation.getParam(
    NAVIGATION_PARAMS.LOCATIONS_GROUPING,
    LOCATION_GROUPING_MODE.NONE,
  );
  const changeSort = navigation.getParam(NAVIGATION_PARAMS.CHANGE_SORT);
  const changeGrouping = navigation.getParam(NAVIGATION_PARAMS.CHANGE_GROUPING);
  return {
    title: getRelevantTitle(navigation.state.routeName, category),
    headerStyle: {
      backgroundColor: COLOR.blue500,
    },
    headerTintColor: COLOR.white,
    headerTitleStyle: {
      fontWeight: 'bold',
      color: COLOR.white,
    },
    headerRight: (
      <HeaderIcons
        addLocation={addLocation}
        editCategory={editCategory}
        deleteCategory={deleteCategory}
        sortMode={locationsSort}
        groupingMode={locationsGrouping}
        changeSort={changeSort}
        changeGrouping={changeGrouping}
        showCategoryActions={navigation.state.routeName == ROUTES.CATEGORY_VIEW}
      />
    ),
  };
};

const getRelevantTitle = (routeName, category) => {
  switch (routeName) {
    case ROUTES.CATEGORY_VIEW:
      return category.name;
    case ROUTES.LOCATIONS:
    default:
      return 'My Locations';
  }
};

const HeaderIcons = React.memo(
  ({
    addLocation,
    editCategory,
    deleteCategory,
    showCategoryActions,
    changeSort,
    changeGrouping,
    sortMode,
    groupingMode,
  }) => {
    const sortProps = getSortItemProps(sortMode);
    sortProps.onPress = changeSort;
    return (
      <HeaderButtons
        HeaderButtonComponent={HeaderIcon}
        OverflowIcon={OverflowIcon}>
        <Item
          iconName={showCategoryActions ? 'add-location' : 'add'}
          onPress={addLocation}
        />
        {showCategoryActions && (
          <Item iconName={'edit'} onPress={editCategory} />
        )}
        {showCategoryActions && <HiddenItem title={'Delete Category'} />}
        {showCategoryActions ? (
          <HiddenItem {...sortProps} />
        ) : (
          <Item {...sortProps} />
        )}
        {!showCategoryActions && (
          <HiddenItem
            {...getGroupingItemProps(groupingMode)}
            onPress={changeGrouping}
          />
        )}
      </HeaderButtons>
    );
  },
);

const getSortItemProps = sortMode => {
  switch (sortMode) {
    case SORT_MODE.ALPHABETICALLY:
      return {
        iconName: 'sort',
        title: 'Default Sort',
      };
    case SORT_MODE.DEFAULT:
    default:
      return {
        iconName: 'sort-by-alpha',
        title: 'ABC Sort',
      };
  }
};

const getGroupingItemProps = goupingMode => {
  switch (goupingMode) {
    case LOCATION_GROUPING_MODE.NONE:
      return {
        title: 'Group by Category',
      };
    case LOCATION_GROUPING_MODE.CATEGORY:
    default:
      return {
        title: 'Ungroup',
      };
  }
};

export default navigatonOptions;
