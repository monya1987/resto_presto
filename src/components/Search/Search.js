// @flow
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import throttle from 'lodash/throttle';

import {Box} from '@infotech/uikit-grid';
import Input from '@infotech/uikit-input';
import FieldSet from '@infotech/uikit-fieldset';
import Popup, {PopupPanel} from '@infotech/uikit-popup';
import {SearchIcon} from '@infotech/uikit-icons';

import {type TObject} from '../../store/objectStore';
import {Loader} from '../../components';

import styles from './Search.pcss';

type TProps = {
  store: {
    Object: TObject
  }
};

type TState = {
  searchDropdownIsOpen: boolean
};

@inject('store')
@observer
class Search extends Component<TProps, TState> {
  state = {
    searchDropdownIsOpen: false,
  };

  onChange = throttle(
    (value: string) => {
      if (!value) {
        return this.setState({searchDropdownIsOpen: false});
      }
      this.setState({searchDropdownIsOpen: true});
      return this.props.store.Object.onSearch(value);
    }, 250, {leading: false, trailing: true}
  );

  closeSearchDropdown = () => {
    this.setState({searchDropdownIsOpen: false});
  };

  showSearchDropdown = (event: {target: {value: string}}) => {
    if (event.target.value) {
      this.setState({searchDropdownIsOpen: true});
    }
  };

  render() {
    const {
      props: {
        store: {
          Object: {
            searchResultList,
            searchLoading
          }
        },
      },
      state: {
        searchDropdownIsOpen
      }
    } = this;
    const noData = searchResultList.length === 0 && !searchLoading;

    return <Box p='2md' w='300px' className={styles.searchInputWrapper} loose>
      <FieldSet className={styles.searchInputField}>
        <Input className={styles.searchInput}
               placeholder='Поиск по пультовому номеру'
               onChange={this.onChange}
               onClick={this.showSearchDropdown}/>
        <Box flex w='1bl' className={styles.searchInputButtonWrapper} loose>
          <div>
            <Popup
              trigger={<div className={styles.loader}>
                {searchLoading && <Loader size='small'/>}
                {!searchLoading && <SearchIcon size='medium' color='grey'/>}
              </div>}
              placement='bottom-right'
              shown={searchDropdownIsOpen}
              useCanvas
            >
              <PopupPanel className={styles.searchOptionsListWrapper}>
                <Box w='268px' loose className={styles.searchOptionsList}>
                  {searchResultList.length > 0 && searchResultList.map((item: {panelNumber: string, observationId: string}) => {
                    const {panelNumber, observationId} = item;
                    const link = `/object/${observationId}?pn=${panelNumber}`;
                    return <Link key={observationId}
                                 to={link}
                                 className={styles.searchOptionsListItem}
                                 onClick={this.closeSearchDropdown}>
                      <div>{panelNumber}</div>
                    </Link>
                  })}
                  {noData && <div className={styles.searchOptionsListItemNoData}>Нет данных</div>}
                </Box>
              </PopupPanel>
            </Popup>
          </div>
        </Box>
      </FieldSet>
    </Box>
  }
}

export default Search;
