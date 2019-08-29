import React from 'react';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderIcon from '../../components/HeaderIcon';
import {ROUTES} from '..';
import {SORT_MODE} from '../../reducers/settingsReducer';
import {COLOR} from 'react-native-material-ui';

export const NAVIGATION_PARAMS = {
  ADD_CATEGORY: 'addCategory',
  ON_CATEGORY_CHOSEN: 'onCategoryChosen',
  CATEGORIES_SORT: 'categories_sort',
  CHANGE_SORT: 'change_sort',
};

const navigatonOptions = ({navigation}) => {
  const addCategory = navigation.getParam(NAVIGATION_PARAMS.ADD_CATEGORY);
  const sortMode = navigation.getParam(NAVIGATION_PARAMS.CATEGORIES_SORT);
  const changeSort = navigation.getParam(
    NAVIGATION_PARAMS.CHANGE_SORT,
    SORT_MODE.DEFAULT,
  );
  return {
    title: getRelevantTitle(navigation.state.routeName),
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
        addCategory={addCategory}
        sortMode={sortMode}
        changeSort={changeSort}
      />
    ),
  };
};

const getRelevantTitle = routeName => {
  switch (routeName) {
    case ROUTES.CATEGORIES:
      return 'Categories';
    case ROUTES.CHOOSE_CATEGORY:
      return 'Choose Category';
    default:
      console.warn(
        `CategoriesScreen.navigationOptions: routeName is ${routeName}`,
      );
      break;
  }
};

const HeaderIcons = React.memo(({addCategory, changeSort, sortMode}) => (
  <HeaderButtons HeaderButtonComponent={HeaderIcon}>
    <Item iconName={'add'} onPress={addCategory} />
    <Item onPress={changeSort} {...getSortItemProps(sortMode)} />
  </HeaderButtons>
));

const getSortItemProps = sortMode => {
  switch (sortMode) {
    case SORT_MODE.ALPHABETICALLY:
      return {iconName: 'sort'};
    case SORT_MODE.DEFAULT:
    default:
      return {iconName: 'sort-by-alpha'};
  }
};

export default navigatonOptions;
