import Toast from 'react-native-root-toast';

const toastMaker = message =>
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    animation: true,
  });

export default toastMaker;
