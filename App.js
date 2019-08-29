import React, {Component} from 'react';
import {StatusBar, ActivityIndicator, StyleSheet, View} from 'react-native';
import RoutesContainer from './App/routes';
import {COLOR} from 'react-native-material-ui';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import middlewares from './App/middlewares';
import reducers from './App/reducers';
import {getInitialStore} from './App/utils/localStorageUtility';

let store = createStore(reducers, middlewares);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {store: store, storeLoading: false};
  }

  componentWillMount() {
    const self = this;
    this.setState({storeLoading: true});
    getInitialStore()
      .then(savedStore => {
        self.setState({
          store: createStore(reducers, savedStore, middlewares),
          storeLoading: false,
        });
      })
      .catch(() => {
        self.setState({store: store, isStoreLoading: false});
      });
  }

  render() {
    if (this.state.storeLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLOR.blue700} />
        </View>
      );
    }
    return (
      <Provider store={this.state.store}>
        <StatusBar barStyle="light-content" backgroundColor={COLOR.blue500} />
        <RoutesContainer />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  loading: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default App;
