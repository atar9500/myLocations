import React from 'react';
import {Platform} from 'react-native';
import {Fumi} from 'react-native-textinput-effects';
import {COLOR} from 'react-native-material-ui';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const IS_ANDROID = Platform.OS === 'android';

const TextInput = React.memo(
  ({
    label,
    iconName,
    editable = true,
    style,
    widthoutIcon,
    value,
    numericOnly,
    onChangeText,
    iconColor,
  }) => {
    const props = {
      label: label,
      iconClass: IS_ANDROID ? MaterialIcon : Ionicon,
      iconName: iconName,
      iconColor: iconColor,
      iconSize: 28,
      iconWidth: 56,
      inputPadding: 24,
      editable: editable,
      style: style,
      value: value,
      autoCapitalize: 'sentences',
      numberOfLines: 1,
      returnKeyType: 'done',
      onChangeText: onChangeText,
    };
    if (numericOnly) {
      props.keyboardType = 'numeric';
    }
    if (widthoutIcon) {
      props.iconSize = 0;
      props.iconWidth = 0;
    }
    return <Fumi {...props} />;
  },
);

export default TextInput;
