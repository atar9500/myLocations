import React, {PureComponent} from 'react';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import PropTypes from 'prop-types';
import {COLOR} from 'react-native-material-ui';
import TextInput from '../components/TextInput';

class InputDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {typedText: props.initialValue};
  }

  componentDidUpdate(prevProps) {
    const stateToUpdate = {};
    if (
      prevProps.initialValue !== this.props.initialValue ||
      (!prevProps.visible && this.props.visible)
    ) {
      stateToUpdate.typedText = this.props.initialValue;
    }
    this.setState(stateToUpdate);
  }

  onChangeText = text => this.setState({typedText: text});

  clearText = () => this.setState({typedText: ''});

  onOkClickInternal = () => {
    const {onOkClick} = this.props;
    const {typedText} = this.state;
    if (!!onOkClick && onOkClick instanceof Function) {
      onOkClick(typedText);
    }
  };

  onDismissInternal = () => {
    const {onDismiss} = this.props;
    if (!!onDismiss && onDismiss instanceof Function) {
      onDismiss();
    }
  };

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
              onPress={this.onDismissInternal}
              textStyle={{color: COLOR.blue700}}
            />
            <DialogButton
              text={this.props.okLabel}
              bordered
              onPress={this.onOkClickInternal}
              textStyle={{color: COLOR.blue700}}
            />
          </DialogFooter>
        }>
        <DialogContent style={{backgroundColor: this.props.backgroundColor}}>
          <TextInput
            label={this.props.inputPlaceholder}
            iconName={'apps'}
            value={this.state.typedText}
            onChangeText={this.onChangeText}
            iconColor={COLOR.blue500}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

InputDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  title: PropTypes.string,
  cancelLabel: PropTypes.string,
  okLabel: PropTypes.string,
  onOkClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  initialValue: PropTypes.string,
};

InputDialog.defaultProps = {
  visible: false,
  title: '',
  cancelLabel: 'CANCEL',
  okLabel: 'OK',
  backgroundColor: COLOR.white,
  initialValue: '',
};

export default InputDialog;
