import React from 'react';
import {Platform} from 'react-native';
import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import {Icon} from 'react-native-elements';
import CategoriesScreen from './categories/CategoriesScreen';
import LocationsScreen from './locations/LocationsScreen';
import LocationViewScreen from './location_view/LocationViewScreen';
import MapScreen from './maps/MapScreen';
import locationViewNavigationOptions from './location_view/navigationOptions';
import {COLOR} from 'react-native-material-ui';

export const ROUTES = {
  CATEGORIES: 'Categories',
  LOCATIONS: 'Locations',
  LOCATION_VIEW: 'LocationView',
  CATEGORY_VIEW: 'CategoryView',
  CHOOSE_CATEGORY: 'ChooseCategory',
  MAP: 'map',
};

export const INTERNAL_ROUTES = {
  CATEGORIES_NAVIGATOR: 'Categories',
  LOCATIONS_NAVIGATOR: 'Locations',
};

const CategoriesNavigator = createStackNavigator({
  [ROUTES.CATEGORIES]: {
    screen: CategoriesScreen,
  },
});

const LocationsNavigator = createStackNavigator({
  [ROUTES.LOCATIONS]: {
    screen: LocationsScreen,
  },
});

const TabNavigatior = createBottomTabNavigator(
  {
    [INTERNAL_ROUTES.CATEGORIES_NAVIGATOR]: {
      screen: CategoriesNavigator,
    },
    [INTERNAL_ROUTES.LOCATIONS_NAVIGATOR]: {
      screen: LocationsNavigator,
    },
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        const isAndroid = Platform.OS === 'android';
        const iconType = isAndroid ? 'material' : 'ionicon';
        let iconName;
        switch (routeName) {
          case INTERNAL_ROUTES.CATEGORIES_NAVIGATOR:
            iconName = isAndroid ? 'apps' : 'md-apps';
            break;
          case INTERNAL_ROUTES.LOCATIONS_NAVIGATOR:
            iconName = isAndroid ? 'place' : 'ios-pin';
            break;
        }

        return (
          <Icon type={iconType} name={iconName} size={25} color={tintColor} />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: COLOR.white,
      inactiveTintColor: COLOR.blue200,
      style: {backgroundColor: COLOR.blue500},
    },
  },
);

const AppNavigator = createStackNavigator({
  Home: {
    screen: TabNavigatior,
    navigationOptions: () => ({
      header: null,
    }),
  },
  [ROUTES.LOCATION_VIEW]: {
    screen: LocationViewScreen,
    navigationOptions: locationViewNavigationOptions,
  },
  [ROUTES.CHOOSE_CATEGORY]: {
    screen: CategoriesScreen,
  },
  [ROUTES.CATEGORY_VIEW]: {
    screen: LocationsScreen,
  },
  [ROUTES.MAP]: {
    screen: MapScreen,
  },
});

export default createAppContainer(AppNavigator);
