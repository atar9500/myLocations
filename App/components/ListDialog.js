import React, {PureComponent} from 'react';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import PropTypes from 'prop-types';
import {COLOR} from 'react-native-material-ui';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

class ListDialog extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderItem = ({label, id}) => (
    <Button
      title={label}
      type="outline"
      onPress={() => this.props.onItemClick(id)}
      containerStyle={styles.item}
    />
  );

  render() {
    return (
      <Dialog
        onDismiss={this.props.onDismiss}
        width={0.9}
        visible={this.props.visible}
        actionsBordered
        dialogTitle={
          <DialogTitle
            title={this.props.title}
            style={{backgroundColor: this.props.backgroundColor}}
            hasTitleBar={false}
            align="center"
          />
        }
        footer={
          <DialogFooter>
            <DialogButton
              text={this.props.cancelLabel}
              bordered
              onPress={this.props.onDismiss}
              textStyle={{color: COLOR.blue700}}
            />
          </DialogFooter>
        }>
        <DialogContent style={{backgroundColor: this.props.backgroundColor}}>
          {this.props.items.map(this.renderItem)}
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  itemLayout: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    borderColor: COLOR.blue500,
    backgroundColor: COLOR.white,
    margin: 8,
  },
});

ListDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  title: PropTypes.string,
  cancelLabel: PropTypes.string,
  onItemClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

ListDialog.defaultProps = {
  cancelLabel: 'CANCEL',
  backgroundColor: COLOR.white,
};

export default ListDialog;
