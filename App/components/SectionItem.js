import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLOR} from 'react-native-material-ui';
import PropTypes from 'prop-types';

const SectionItem = React.memo(({label}) => (
  <View style={styles.layout}>
    <Text style={styles.label}>{label}</Text>
  </View>
));

const styles = StyleSheet.create({
  layout: {
    alignItems: 'center',
    padding: 16,
  },
  label: {
    color: COLOR.blue500,
    fontWeight: 'bold',
    fontSize: 20,
  },
});

SectionItem.propTypes = {
  label: PropTypes.string.isRequired,
};

export default SectionItem;
