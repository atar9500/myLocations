import React from 'react';
import {Platform} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderIcon from '../../components/HeaderIcon';
import {COLOR} from 'react-native-material-ui';

const IS_ANDROID = Platform.OS === 'android';

export const NAVIGATION_PARAMS = {
  VIEW_MODE: 'view_mode',
  EDIT_LOCATION: 'edit_location',
  DELETE_LOCATION: 'delete_location',
  SAVE_LOCATION: 'save_location',
  LOCATION: 'location',
  CANCEL_EDIT: 'cancel_edit',
  INITIAL_CATEGORY: 'initial_category',
};

export const LOCATION_VIEW_MODE = {
  ADD: 'add',
  EDIT: 'edit',
  VIEW: 'view',
};

const navigatonOptions = ({navigation}) => {
  const editLocation = navigation.getParam(NAVIGATION_PARAMS.EDIT_LOCATION);
  const deleteLocation = navigation.getParam(NAVIGATION_PARAMS.DELETE_LOCATION);
  const saveLocation = navigation.getParam(NAVIGATION_PARAMS.SAVE_LOCATION);
  const cancelEdit = navigation.getParam(NAVIGATION_PARAMS.CANCEL_EDIT);

  const viewMode = navigation.getParam(
    NAVIGATION_PARAMS.VIEW_MODE,
    LOCATION_VIEW_MODE.VIEW,
  );
  const location = navigation.getParam(NAVIGATION_PARAMS.LOCATION, {});

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
    headerRight: (
      <HeaderIcons
        editLocation={editLocation}
        deleteLocation={deleteLocation}
        saveLocation={saveLocation}
        cancelEdit={cancelEdit}
        editing={viewMode === LOCATION_VIEW_MODE.EDIT}
        adding={viewMode === LOCATION_VIEW_MODE.ADD}
      />
    ),
  };
};

const getRelevantTitle = (viewMode, locationName) => {
  switch (viewMode) {
    case LOCATION_VIEW_MODE.ADD:
      return 'Add Location';
    case LOCATION_VIEW_MODE.EDIT:
      return 'Edit Location';
    case LOCATION_VIEW_MODE.VIEW:
      return locationName;
    default:
      console.warn(
        `LocationViewScreen.navigationOptions: viewMode is ${viewMode}`,
      );
      break;
  }
};

const HeaderIcons = React.memo(
  ({
    editLocation,
    deleteLocation,
    saveLocation,
    cancelEdit,
    editing,
    adding,
  }) => (
    <HeaderButtons HeaderButtonComponent={HeaderIcon}>
      {!editing && !adding && (
        <Item
          iconName={additionalStyles.editIcon}
          onPress={editLocation}
          title={additionalStyles.editTitle}
        />
      )}
      {!editing && !adding && (
        <Item
          iconName={additionalStyles.deleteIcon}
          onPress={deleteLocation}
          title={additionalStyles.deleteTitle}
        />
      )}
      {(editing || adding) && (
        <Item
          iconName={additionalStyles.saveIcon}
          onPress={saveLocation}
          title={additionalStyles.saveTitle}
        />
      )}
      {editing && (
        <Item
          iconName={additionalStyles.cancelIcon}
          onPress={cancelEdit}
          title={additionalStyles.cancelTitle}
        />
      )}
    </HeaderButtons>
  ),
);

const additionalStyles = {
  iconType: IS_ANDROID ? 'material' : 'ionicon',
  editIcon: IS_ANDROID ? 'edit' : 'md-create',
  editTitle: 'Edit Location',
  deleteIcon: 'delete',
  deleteTitle: 'Delete Location',
  saveIcon: IS_ANDROID ? 'done' : 'md-checkmark',
  saveTitle: 'Save Location',
  cancelIcon: IS_ANDROID ? 'close' : 'ios-close',
  cancelTitle: 'Cancel Edit',
};

export default navigatonOptions;
