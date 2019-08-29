import React, {Component} from 'react';
import {View, StyleSheet, Text, Vibration} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {COLOR} from 'react-native-material-ui';
import navigationOptions, {
  NAVIGATION_PARAMS,
  MAP_VIEW_MODE,
} from './navigationOptions';

const DEFAULT_LATITUDE = 32.0869342;
const DEFAULT_LONGITUDE = 34.7801262;

const VIBRATION_DURATION = 500;

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    };
  }

  static navigationOptions = navigationOptions;

  componentDidMount() {
    const {navigation} = this.props;
    const viewMode = navigation.getParam(
      NAVIGATION_PARAMS.VIEW_MODE,
      MAP_VIEW_MODE.VIEW,
    );
    let coordinates = navigation.getParam(NAVIGATION_PARAMS.COORDINATES);
    coordinates = {
      latitude: isNaN(parseFloat(coordinates.latitude))
        ? DEFAULT_LATITUDE
        : coordinates.latitude,
      longitude: isNaN(parseFloat(coordinates.longitude))
        ? DEFAULT_LONGITUDE
        : coordinates.longitude,
    };

    const updatedState = {
      editMode: viewMode === MAP_VIEW_MODE.EDIT,
      coordinates: coordinates,
      region: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    };
    this.setState(updatedState);
    navigation.setParams({[NAVIGATION_PARAMS.SELECT_PLACE]: this.selectPlace});
  }

  selectPlace = () => {
    const {navigation} = this.props;
    const {coordinates} = this.state;
    const onPlaceSelected = navigation.getParam(
      NAVIGATION_PARAMS.ON_PLACE_SELECTED,
    );
    onPlaceSelected(coordinates);
    navigation.goBack();
  };

  onRegionChange = region => {
    if (this.state.editMode) {
      this.setState({
        region: region,
        coordinates: {
          latitude: +region.latitude.toFixed(7),
          longitude: +region.longitude.toFixed(7),
        },
      });
    }
  };

  mapRef = map => (this.map = map);

  onMapReady = () => this.map.animateCamera({zoom: 17});

  onMarkerClick = () => Vibration.vibrate(VIBRATION_DURATION);

  render() {
    const location = this.props.navigation.getParam(
      NAVIGATION_PARAMS.LOCATION,
      {},
    );
    return (
      <View style={styles.parent}>
        <MapView
          ref={this.mapRef}
          onMapReady={this.onMapReady}
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange}>
          <Marker
            coordinate={this.state.coordinates}
            title={location.name}
            description={location.address}
            onPress={this.onMarkerClick}
          />
        </MapView>
        <Coordinates
          latitude={this.state.coordinates.latitude}
          longitude={this.state.coordinates.longitude}
          hide={!this.state.editMode}
        />
      </View>
    );
  }
}

const Coordinates = React.memo(({latitude, longitude, hide}) =>
  hide ? null : (
    <View style={styles.coordinates}>
      <Coordinate label={'Latitude'} value={latitude} />
      <Coordinate label={'Longitude'} value={longitude} />
    </View>
  ),
);

const Coordinate = React.memo(({label, value}) => (
  <View style={styles.coordinate}>
    <Text style={{fontWeight: 'bold'}} numberOfLines={1}>
      {label}
    </Text>
    <Text numberOfLines={1}>{value}</Text>
  </View>
));

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: COLOR.grey100,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  coordinates: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 100,
    flexDirection: 'row',
    zIndex: 999,
  },
  coordinate: {
    flex: 1,
    padding: 16,
    margin: 16,
    backgroundColor: COLOR.white,
    opacity: 0.9,
    borderRadius: 24,
  },
});

export default MapScreen;
