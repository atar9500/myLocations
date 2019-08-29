import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {View, Text, StyleSheet} from 'react-native';
import {COLOR} from 'react-native-material-ui';

const EmptyView = React.memo(({label, iconName, color}) => (
  <View style={styles.layout}>
    <MaterialIcon name={iconName} color={color} size={132} />
    <Text style={[styles.label, {color: color}]}>{label}</Text>
  </View>
));

const styles = StyleSheet.create({
  layout: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 72,
  },
  label: {
    color: COLOR.blue500,
    fontSize: 16,
    padding: 8,
  },
});

export default EmptyView;
