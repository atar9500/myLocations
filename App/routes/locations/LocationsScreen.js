import React, {Component} from 'react';
import {View, StyleSheet, SectionList, Alert, Vibration} from 'react-native';
import {connect} from 'react-redux';
import LocationItem from '../../components/LocationItem';
import {COLOR} from 'react-native-material-ui';
import navigationOptions, {NAVIGATION_PARAMS} from './navigationOptions';
import {
  NAVIGATION_PARAMS as LOCATION_VIEW_PARAMS,
  LOCATION_VIEW_MODE,
} from '../location_view/navigationOptions';
import {
  NAVIGATION_PARAMS as MAP_PARAMS,
  MAP_VIEW_MODE,
} from '../maps/navigationOptions';
import {ROUTES} from '../index';
import {CategoryActions, SettingActions} from '../../actions';
import {createSelector, createStructuredSelector} from 'reselect';
import {filterLocationSections} from '../../utils/locationUtils';
import InputDialog from '../../components/InputDialog';
import {
  locationsSortModeSelector,
  SORT_MODE,
  LOCATION_GROUPING_MODE,
  groupModeLocationsSelector,
} from '../../reducers/settingsReducer';
import {sectionedLocationsSelector} from '../../reducers/locationReducer';
import ListDialog from '../../components/ListDialog';
import SectionItem from '../../components/SectionItem';
import EmptyView from '../../components/EmptyView';

const OPEN_LOCATION_ID = {
  DETAILS: 1,
  MAP: 2,
};

const OPEN_LOCATION_OPTIONS = [
  {label: 'Show Details', id: OPEN_LOCATION_ID.DETAILS},
  {label: 'Open in Map', id: OPEN_LOCATION_ID.MAP},
];

const VIBRATION_DURATION = 500;

class LocationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editCategoryDialogVisible: false,
      listDialogVisible: false,
      selectedLocation: null,
    };
  }

  static navigationOptions = navigationOptions;

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setParams({
      [NAVIGATION_PARAMS.ADD_LOCATION]: this.addLocation,
      [NAVIGATION_PARAMS.EDIT_CATEGORY]: this.showEditDialog,
      [NAVIGATION_PARAMS.DELETE_CATEGORY]: this.alertDeleteCategory,
      [NAVIGATION_PARAMS.CHANGE_SORT]: this.changeSort,
      [NAVIGATION_PARAMS.CHANGE_GROUPING]: this.changeGrouping,
      [NAVIGATION_PARAMS.LOCATIONS_SORT]: this.props.sortMode,
      [NAVIGATION_PARAMS.LOCATIONS_GROUPING]: this.props.groupingMode,
    });
  }

  renderLocation = ({item, index}) => (
    <LocationItem
      name={item.name}
      address={item.address}
      category={item.category}
      latitude={item.coordinates.latitude}
      longitude={item.coordinates.longitude}
      onClick={this.showOpenLocationDialog}
      key={index}
    />
  );

  renderCategoryHeader = ({section}) => {
    const {navigation} = this.props;
    const isGrouping = this.props.groupingMode !== LOCATION_GROUPING_MODE.NONE;
    const isCategoryView = navigation.state.routeName === ROUTES.CATEGORY_VIEW;
    if (!isGrouping || isCategoryView) {
      return null;
    } else {
      return <SectionItem label={section.category} />;
    }
  };

  changeSort = () => {
    let value;
    switch (this.props.sortMode) {
      case SORT_MODE.DEFAULT:
        value = SORT_MODE.ALPHABETICALLY;
        break;
      case SORT_MODE.ALPHABETICALLY:
        value = SORT_MODE.DEFAULT;
        break;
    }
    if (!!value) {
      this.props.navigation.setParams({
        [NAVIGATION_PARAMS.LOCATIONS_SORT]: value,
      });
      this.props.changeSort(value);
    }
  };

  changeGrouping = () => {
    let value;
    switch (this.props.groupingMode) {
      case LOCATION_GROUPING_MODE.NONE:
        value = LOCATION_GROUPING_MODE.CATEGORY;
        break;
      case LOCATION_GROUPING_MODE.CATEGORY:
        value = LOCATION_GROUPING_MODE.NONE;
        break;
    }
    if (!!value) {
      this.props.navigation.setParams({
        [NAVIGATION_PARAMS.LOCATIONS_GROUPING]: value,
      });
      this.props.changeGrouping(value);
    }
  };

  addLocation = () => {
    const {navigation} = this.props;
    const params = {
      [LOCATION_VIEW_PARAMS.VIEW_MODE]: LOCATION_VIEW_MODE.ADD,
    };
    if (navigation.state.routeName === ROUTES.CATEGORY_VIEW) {
      const category = navigation.getParam(NAVIGATION_PARAMS.CATEGORY);
      params[LOCATION_VIEW_PARAMS.INITIAL_CATEGORY] = category;
    }
    navigation.navigate(ROUTES.LOCATION_VIEW, params);
  };

  alertDeleteCategory = () => {
    const category = this.props.navigation.getParam(NAVIGATION_PARAMS.CATEGORY);
    Alert.alert(
      `Delete Category`,
      `You're about to delete ${category.name} and all its locations, are you sure about that?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: this.deleteCategoryInternal},
      ],
      {cancelable: true},
    );
  };

  showEditDialog = () => this.setState({editCategoryDialogVisible: true});

  dismissShowDialog = () => this.setState({editCategoryDialogVisible: false});

  deleteCategoryInternal = () => {
    const {navigation, deleteCategory} = this.props;
    const category = navigation.getParam(NAVIGATION_PARAMS.CATEGORY);
    deleteCategory(category);
    navigation.goBack();
  };

  editCategoryInternal = categoryName => {
    const {editCategory, navigation} = this.props;
    const newCategory = {name: categoryName};
    const oldCategory = navigation.getParam(NAVIGATION_PARAMS.CATEGORY);
    navigation.setParams({[NAVIGATION_PARAMS.CATEGORY]: newCategory});
    editCategory(oldCategory, newCategory);
    this.dismissShowDialog();
  };

  goToLocationDetails = location => {
    this.props.navigation.navigate(ROUTES.LOCATION_VIEW, {
      [LOCATION_VIEW_PARAMS.VIEW_MODE]: LOCATION_VIEW_MODE.VIEW,
      [LOCATION_VIEW_PARAMS.LOCATION]: location,
    });
  };

  goToLocationMap = location => {
    this.props.navigation.navigate(ROUTES.MAP, {
      [MAP_PARAMS.VIEW_MODE]: MAP_VIEW_MODE.VIEW,
      [MAP_PARAMS.LOCATION]: location,
      [MAP_PARAMS.COORDINATES]: location.coordinates,
    });
  };

  onLocationOptionClick = id => {
    switch (id) {
      case OPEN_LOCATION_ID.DETAILS:
        this.goToLocationDetails(this.state.selectedLocation);
        break;
      case OPEN_LOCATION_ID.MAP:
        this.goToLocationMap(this.state.selectedLocation);
        break;
    }
    this.dismissListDialog();
  };

  dismissListDialog = () => this.setState({listDialogVisible: false});

  showOpenLocationDialog = location => {
    Vibration.vibrate(VIBRATION_DURATION);
    this.setState({selectedLocation: location, listDialogVisible: true});
  };

  render() {
    const {locations, navigation} = this.props;
    return (
      <View style={styles.parent}>
        <SectionList
          style={styles.list}
          sections={locations}
          renderItem={this.renderLocation}
          renderSectionHeader={this.renderCategoryHeader}
          keyExtractor={this.keyExtractor}
          extraData={`${this.props.groupingMode}${this.props.sortMode}`}
          ListEmptyComponent={
            <EmptyView
              label="No locations added yet"
              iconName="place"
              color={COLOR.blue500}
            />
          }
        />
        <ListDialog
          visible={this.state.listDialogVisible}
          onDismiss={this.dismissListDialog}
          title={'Open Location'}
          onItemClick={this.onLocationOptionClick}
          items={OPEN_LOCATION_OPTIONS}
        />
        <InputDialog
          visible={this.state.editCategoryDialogVisible}
          onDismiss={this.dismissShowDialog}
          title={'Edit Category'}
          cancelLabel={'CANCEL'}
          okLabel={'APPLY'}
          backgroundColor={COLOR.white}
          inputPlaceholder={'Category Name'}
          onOkClick={this.editCategoryInternal}
          initialValue={
            navigation.getParam(NAVIGATION_PARAMS.CATEGORY, {}).name
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: COLOR.grey100,
  },
  list: {flex: 1},
});

const routeNameSelector = (_, props) => props.navigation.state.routeName;
const viewedCategorySelector = (_, props) =>
  props.navigation.getParam(NAVIGATION_PARAMS.CATEGORY);

const relevantLocationsSelector = createSelector(
  routeNameSelector,
  viewedCategorySelector,
  sectionedLocationsSelector,
  (routeName, viewedCategory, sections) => {
    switch (routeName) {
      case ROUTES.CATEGORY_VIEW:
        return filterLocationSections(sections, viewedCategory, false);
      case ROUTES.LOCATIONS:
      default:
        return sections;
    }
  },
);

const mapStateToProps = createStructuredSelector({
  locations: relevantLocationsSelector,
  sortMode: locationsSortModeSelector,
  groupingMode: groupModeLocationsSelector,
});

const mapDispatchToProps = dispatch => ({
  editCategory: (oldCategory, newCategory) =>
    dispatch(CategoryActions.edit(oldCategory, newCategory)),
  deleteCategory: category => dispatch(CategoryActions.delete(category)),
  changeSort: value => dispatch(SettingActions.changeLocationsSort(value)),
  changeGrouping: value =>
    dispatch(SettingActions.changeLocationGrouping(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationsScreen);
