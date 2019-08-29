import React, {Component} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import navigationOptions, {NAVIGATION_PARAMS} from './navigationOptions';
import {COLOR} from 'react-native-material-ui';
import CategoryItem from '../../components/CategoryItem';
import {CategoryActions, SettingActions} from '../../actions';
import InputDialog from '../../components/InputDialog';
import {isCategoryExists} from '../../utils/categoryUtils';
import toastMaker from '../../utils/toastMaker';
import {NAVIGATION_PARAMS as LOCATION_SCREEN_PARAMS} from '../locations/navigationOptions';
import {ROUTES} from '..';
import {
  SORT_MODE,
  categoriesSortModeSelector,
} from '../../reducers/settingsReducer';
import {createStructuredSelector} from 'reselect';
import {sortedCategoriesSelector} from '../../reducers/categoryReducer';
import EmptyView from '../../components/EmptyView';

class CategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {addCategoryDialogVisible: false};
  }

  static navigationOptions = navigationOptions;

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setParams({
      [NAVIGATION_PARAMS.ADD_CATEGORY]: this.showAddCategoryDialog,
      [NAVIGATION_PARAMS.CHANGE_SORT]: this.changeSort,
      [NAVIGATION_PARAMS.CATEGORIES_SORT]: this.props.sortMode,
    });
  }

  renderCategory = ({item}) => (
    <CategoryItem name={item.name} onClick={this.onCategoryClick} />
  );

  showAddCategoryDialog = () => this.setState({addCategoryDialogVisible: true});

  dismissShowDialog = () => this.setState({addCategoryDialogVisible: false});

  onCategoryClick = category => {
    const {navigation} = this.props;
    switch (navigation.state.routeName) {
      case ROUTES.CHOOSE_CATEGORY:
        const onCategoryChosen = navigation.getParam(
          NAVIGATION_PARAMS.ON_CATEGORY_CHOSEN,
        );
        onCategoryChosen(category.name);
        navigation.goBack();
        break;
      case ROUTES.CATEGORIES:
        navigation.navigate(ROUTES.CATEGORY_VIEW, {
          [LOCATION_SCREEN_PARAMS.CATEGORY]: category,
        });
        break;
    }
  };

  onAddCategory = name => {
    this.dismissShowDialog();
    console.log(`CategoryScreen: inserted category name is ${name}`);
    if (!name || name.length == 0) {
      toastMaker('Please insert category name');
      return;
    }
    if (isCategoryExists({name}, this.props.categories)) {
      toastMaker('Category already exists');
      return;
    }
    this.props.addCategory({name});
  };

  changeSort = () => {
    let value;
    switch (this.props.sortMode) {
      case SORT_MODE.DEFAULT:
        value = SORT_MODE.ALPHABETICALLY;
        break;
      case SORT_MODE.ALPHABETICALLY:
        value = SORT_MODE.DEFAULT;
        break;
    }
    if (!!value) {
      this.props.navigation.setParams({
        [NAVIGATION_PARAMS.CATEGORIES_SORT]: value,
      });
      this.props.changeSort(value);
    }
  };

  keyExtractor = (item, index) => item + index;

  render() {
    return (
      <View style={styles.parent}>
        <FlatList
          style={styles.list}
          data={this.props.categories}
          renderItem={this.renderCategory}
          extraData={this.props.sortMode}
          keyExtractor={this.keyExtractor}
          ListEmptyComponent={
            <EmptyView
              label="No categories added yet"
              iconName="apps"
              color={COLOR.blue500}
            />
          }
        />
        <InputDialog
          visible={this.state.addCategoryDialogVisible}
          onDismiss={this.dismissShowDialog}
          title={'Add Category'}
          cancelLabel={'CANCEL'}
          okLabel={'ADD'}
          backgroundColor={COLOR.white}
          inputPlaceholder={'Category Name'}
          onOkClick={this.onAddCategory}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: COLOR.grey100,
  },
  list: {
    flex: 1,
  },
});

const mapStateToProps = createStructuredSelector({
  categories: sortedCategoriesSelector,
  sortMode: categoriesSortModeSelector,
});

const mapDispatchToProps = dispatch => ({
  addCategory: category => dispatch(CategoryActions.add(category)),
  changeSort: value => dispatch(SettingActions.changeCategoriesSort(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoriesScreen);
