import React from 'react';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderIcon from '../../components/HeaderIcon';
import {COLOR} from 'react-native-material-ui';

export const NAVIGATION_PARAMS = {
  VIEW_MODE: 'view_mode',
  ON_PLACE_SELECTED: 'on_place_selected',
  SELECT_PLACE: 'select_place',
  LOCATION: 'location',
  COORDINATES: 'coordinates',
};

export const MAP_VIEW_MODE = {
  EDIT: 'edit',
  VIEW: 'view',
};

const navigatonOptions = ({navigation}) => {
  const viewMode = navigation.getParam(
    NAVIGATION_PARAMS.VIEW_MODE,
    MAP_VIEW_MODE.VIEW,
  );

  const location = navigation.getParam(NAVIGATION_PARAMS.LOCATION, {});
  const selectPlace = navigation.getParam(NAVIGATION_PARAMS.SELECT_PLACE);

  return {
    title: getRelevantTitle(viewMode, location.name),
    headerStyle: {
      backgroundColor: COLOR.blue500,
    },
    headerTintColor: COLOR.white,
    headerTitleStyle: {
      fontWeight: 'bold',
      color: COLOR.white,
    },
    headerRight: <HeaderIcons selectPlace={selectPlace} viewMode={viewMode} />,
  };
};

const getRelevantTitle = (viewMode, locationName) => {
  switch (viewMode) {
    case MAP_VIEW_MODE.VIEW:
      return locationName;
    case MAP_VIEW_MODE.EDIT:
      return 'Choose Coordinates';
    default:
      console.warn(`MapScreen.navigationOptions: viewMode is ${viewMode}`);
      break;
  }
};

const HeaderIcons = React.memo(({selectPlace, viewMode}) => {
  switch (viewMode) {
    case MAP_VIEW_MODE.EDIT:
      return (
        <HeaderButtons HeaderButtonComponent={HeaderIcon}>
          <Item iconName={'done'} onPress={selectPlace} />
        </HeaderButtons>
      );
    case MAP_VIEW_MODE.VIEW:
      return null;
  }
});

export default navigatonOptions;
