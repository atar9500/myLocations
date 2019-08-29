import React, {Component} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {COLOR} from 'react-native-material-ui';
import {connect} from 'react-redux';
import TextInput from '../../components/TextInput';
import {NAVIGATION_PARAMS, LOCATION_VIEW_MODE} from './navigationOptions';
import {NAVIGATION_PARAMS as CATEGORY_SCREEN_PARAMS} from '../categories/navigationOptions';
import {ROUTES} from '../index';
import {LocationActions} from '../../actions';
import toastMaker from '../../utils/toastMaker';
import {isLocationExists, validateCoordinates} from '../../utils/locationUtils';
import {Button} from 'react-native-elements';
import {
  NAVIGATION_PARAMS as MAP_SCREEN_PARAMS,
  MAP_VIEW_MODE,
} from '../maps/navigationOptions';

const DEFAULT_INITIAL_CATEGORY = {name: ''};

class LocationViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      name: '',
      address: '',
      category: '',
      coordinates: {
        latitude: '',
        longitude: '',
      },
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const viewMode = navigation.getParam(
      NAVIGATION_PARAMS.VIEW_MODE,
      LOCATION_VIEW_MODE.VIEW,
    );

    let updateState = {};
    switch (viewMode) {
      case LOCATION_VIEW_MODE.ADD:
        updateState.editMode = true;
        const initialCategory = navigation.getParam(
          NAVIGATION_PARAMS.INITIAL_CATEGORY,
          DEFAULT_INITIAL_CATEGORY,
        );
        updateState.category = initialCategory.name;
        break;
      case LOCATION_VIEW_MODE.VIEW:
        updateState = this.getInitialLocation();
        break;
    }

    this.setState(updateState);
    navigation.setParams({
      [NAVIGATION_PARAMS.SAVE_LOCATION]: this.saveLocationInternal,
      [NAVIGATION_PARAMS.EDIT_LOCATION]: this.openEditMode,
      [NAVIGATION_PARAMS.DELETE_LOCATION]: this.alertDeleteLocation,
      [NAVIGATION_PARAMS.CANCEL_EDIT]: this.closeEditMode,
    });
  }

  onCategoryPickerClick = () => {
    const {navigation} = this.props;
    navigation.navigate(ROUTES.CHOOSE_CATEGORY, {
      [CATEGORY_SCREEN_PARAMS.ON_CATEGORY_CHOSEN]: this.onCategoryChosen,
    });
  };

  onCategoryChosen = categoryName => this.setState({category: categoryName});

  onNameTyped = typedName => this.setState({name: typedName});

  onAddressTyped = typedAddress => this.setState({address: typedAddress});

  saveLocationInternal = () => {
    const {addLocation, editLocation, locations, navigation} = this.props;
    const viewMode = navigation.getParam(
      NAVIGATION_PARAMS.VIEW_MODE,
      LOCATION_VIEW_MODE.VIEW,
    );
    if (
      !this.state.name ||
      !this.state.name.length ||
      !this.state.address ||
      !this.state.address.length ||
      !this.state.category ||
      !this.state.category.length
    ) {
      toastMaker('All properties are required!');
      return;
    } else if (!validateCoordinates(this.state.coordinates)) {
      toastMaker('Please insert valid coordinates');
      return;
    }
    const locationToSave = {
      name: this.state.name,
      address: this.state.address,
      category: this.state.category,
      coordinates: this.state.coordinates,
    };
    switch (viewMode) {
      case LOCATION_VIEW_MODE.ADD:
        if (isLocationExists(locationToSave.coordinates, locations)) {
          toastMaker(
            'Location already exists, please choose different coordinates',
          );
          return;
        }
        addLocation(locationToSave);
        break;
      case LOCATION_VIEW_MODE.EDIT:
        editLocation(locationToSave, this.getInitialLocation().coordinates);
        break;
    }
    this.setState({
      editMode: false,
      coordinates: locationToSave.coordinates,
    });
    navigation.setParams({
      [NAVIGATION_PARAMS.VIEW_MODE]: LOCATION_VIEW_MODE.VIEW,
      [NAVIGATION_PARAMS.LOCATION]: locationToSave,
    });
  };

  openEditMode = () => {
    this.setState({editMode: true});
    this.props.navigation.setParams({
      [NAVIGATION_PARAMS.VIEW_MODE]: LOCATION_VIEW_MODE.EDIT,
    });
  };

  closeEditMode = () => {
    this.setState({
      editMode: false,
      ...this.getInitialLocation(),
    });
    this.props.navigation.setParams({
      [NAVIGATION_PARAMS.VIEW_MODE]: LOCATION_VIEW_MODE.VIEW,
    });
  };

  getInitialLocation = () =>
    this.props.navigation.getParam(NAVIGATION_PARAMS.LOCATION);

  alertDeleteLocation = () => {
    Alert.alert(
      `Delete Location`,
      `You're about to delete ${this.state.name}, are you sure about that?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: this.deleteLocationInternal},
      ],
      {cancelable: true},
    );
  };

  deleteLocationInternal = () => {
    const {deleteLocation, navigation} = this.props;
    const location = {
      name: this.state.name,
      address: this.state.address,
      category: this.state.category,
      coordinates: this.state.coordinates,
    };
    deleteLocation(location);
    navigation.goBack();
  };

  chooseCoordinatesFromMap = () => {
    const {navigation} = this.props;
    navigation.navigate(ROUTES.MAP, {
      [MAP_SCREEN_PARAMS.VIEW_MODE]: MAP_VIEW_MODE.EDIT,
      [MAP_SCREEN_PARAMS.ON_PLACE_SELECTED]: this.onCoordinatesSelected,
      [MAP_SCREEN_PARAMS.COORDINATES]: this.state.coordinates,
    });
  };

  onCoordinatesSelected = coordinates =>
    this.setState({coordinates: coordinates});

  render() {
    const textInputColor = this.state.editMode ? COLOR.blue500 : COLOR.grey500;
    return (
      <View style={styles.parent}>
        <TextInput
          label={'Name'}
          iconName={'label'}
          iconColor={textInputColor}
          editable={this.state.editMode}
          onChangeText={this.onNameTyped}
          value={this.state.name}
        />
        <TextInput
          label={'Address'}
          iconName={'place'}
          iconColor={textInputColor}
          editable={this.state.editMode}
          onChangeText={this.onAddressTyped}
          value={this.state.address}
        />
        <View style={styles.categoryLayout}>
          <TextInput
            style={styles.field}
            label={'Category'}
            iconName={'apps'}
            iconColor={textInputColor}
            editable={false}
            value={this.state.category}
          />
          {this.state.editMode && (
            <EditButton
              title="Choose"
              onPress={this.onCategoryPickerClick}
              hide={!this.state.editMode}
              marginHorizontal={24}
            />
          )}
        </View>
        <View style={styles.coordinatesLayout}>
          <TextInput
            style={styles.field}
            label={'Latitude'}
            iconName={'map'}
            iconColor={textInputColor}
            editable={false}
            value={`${this.state.coordinates.latitude}`}
            numericOnly={true}
          />
          <TextInput
            style={styles.field}
            label={'Longitude'}
            iconName={'map'}
            iconColor={textInputColor}
            widthoutIcon={true}
            editable={false}
            value={`${this.state.coordinates.longitude}`}
            numericOnly={true}
          />
        </View>
        <EditButton
          title="Choose Coordinates from Map"
          onPress={this.chooseCoordinatesFromMap}
          hide={!this.state.editMode}
          marginHorizontal={24}
          marginVertical={24}
        />
      </View>
    );
  }
}

const EditButton = React.memo(
  ({title, onPress, hide, marginHorizontal, marginVertical}) =>
    hide ? null : (
      <Button
        title={title}
        type="outline"
        containerStyle={[
          styles.editButtonContainer,
          {marginHorizontal: marginHorizontal, marginVertical: marginVertical},
        ]}
        onPress={onPress}
      />
    ),
);

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: COLOR.grey100,
    flexDirection: 'column',
  },
  list: {
    flex: 1,
  },
  categoryLayout: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.white,
  },
  coordinatesLayout: {
    width: '100%',
    flexDirection: 'row',
  },
  field: {
    flex: 1,
  },
  editButtonContainer: {
    borderColor: COLOR.blue500,
    backgroundColor: COLOR.white,
  },
});

const mapDispatchToProps = dispatch => ({
  addLocation: location => dispatch(LocationActions.add(location)),
  editLocation: (location, coordinates) =>
    dispatch(LocationActions.edit(location, coordinates)),
  deleteLocation: location => dispatch(LocationActions.delete(location)),
});

const mapStateToProps = ({locationReducer}) => {
  const {locations} = locationReducer;
  return {locations};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationViewScreen);
