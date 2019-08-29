import React, {PureComponent} from 'react';
import {TouchableHighlight, View, Text, StyleSheet} from 'react-native';
import {COLOR} from 'react-native-material-ui';
import PropTypes from 'prop-types';

class CategoryItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  onInternalClick = () => {
    const {name, onClick} = this.props;
    onClick({name});
  };

  render() {
    return (
      <TouchableHighlight
        onPress={this.onInternalClick}
        underlayColor={COLOR.blue100}>
        <View style={styles.layout}>
          <Text style={styles.label}>{this.props.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    alignItems: 'center',
    backgroundColor: COLOR.white,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.grey300,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

CategoryItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default CategoryItem;
