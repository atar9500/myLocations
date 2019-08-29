import React from 'react';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {HeaderButton} from 'react-navigation-header-buttons';
import {COLOR} from 'react-native-material-ui';

const IS_ANDROID = Platform.OS === 'android';

const HeaderIcon = props => (
  <HeaderButton
    IconComponent={IS_ANDROID ? MaterialIcon : IoniconIcon}
    iconSize={28}
    color={COLOR.white}
    {...props}
  />
);

export const OverflowIcon = (
  <MaterialIcon name="more-vert" size={28} color={COLOR.white} />
);

export default HeaderIcon;
