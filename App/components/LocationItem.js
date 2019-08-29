import React, {PureComponent} from 'react';
import {Text, View, TouchableHighlight, StyleSheet} from 'react-native';
import {COLOR} from 'react-native-material-ui';
import PropTypes from 'prop-types';

class LocationItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  onInternalClick = () => {
    const {name, address, category, latitude, longitude, onClick} = this.props;
    if (!!onClick && onClick instanceof Function) {
      onClick({name, address, category, coordinates: {latitude, longitude}});
    }
  };

  render() {
    return (
      // <ListItem
      //   divider
      //   centerElement={{
      //     primaryText: name,
      //     secondaryText: `${address} (${latitude}, ${longitude})`,
      //     tertiaryText: category,
      //   }}
      //   onPress={this.onInternalClick}
      // />
      <TouchableHighlight
        onPress={this.onInternalClick}
        underlayColor={COLOR.blue100}>
        <View style={styles.layout}>
          <Text style={styles.label}>{this.props.name}</Text>
          <Text style={styles.subLabel}>
            {`Address: ${this.props.address}`}
          </Text>
          <Text style={styles.subLabel}>
            {`Coordinates: (${this.props.latitude}, ${this.props.longitude})`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: COLOR.white,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.grey300,
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 24,
  },
  subLabel: {
    opacity: 0.6,
    fontSize: 14,
  },
});

LocationItem.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  latitude: PropTypes.string.isRequired,
  longitude: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default LocationItem;
