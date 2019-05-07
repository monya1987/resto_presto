// @flow
import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {inject, observer} from 'mobx-react';
import Avatar from '@infotech/uikit-avatar';
import {Box, Div} from '@infotech/uikit-grid';
import Popup, {PopupPanel} from '@infotech/uikit-popup';
import {PersonIcon, CompareIcon, LogoutIcon, DropdownDownIcon} from '@infotech/uikit-icons';
// import ModalDialogWindow from '@infotech/uikit-dialog-panel';

import type {TSystem} from '../../store/systemStore';
import styles from './Profile.pcss';
import {fullNameToInitials} from '../../utils/helpers';

type TProps = {
  title: string,
  store: {
    System: TSystem
  }
};

type TState = {
  accountMenuDropDownIsOpen: boolean,
  isDarkMode: boolean,
  modalOpened: boolean
};

@inject('store')
@observer
class Profile extends Component<TProps, TState> {
  state = {
    accountMenuDropDownIsOpen: false,
    isDarkMode: false,
    modalOpened: false
  };

  componentDidMount() {
    this.props.store.System.fetchCurrentUser();
  }

  switchDarkMode = () => {
    this.setState({
      isDarkMode: !this.state.isDarkMode,
      accountMenuDropDownIsOpen: true
    })
  };

  switchModalState = () => {
    this.setState({
      modalOpened: !this.state.modalOpened,
      accountMenuDropDownIsOpen: false
    })
  };

  render() {
    const {
      props: {
        title,
        store: {
          System: {
            currentUser: {
              firstName,
              lastName,
              email
            },
            logout
          }
        }
      },
      state: {
        accountMenuDropDownIsOpen,
        isDarkMode
      }
    } = this;

    const fullName = `${firstName} ${lastName}`;

    return <Box pl='1md' className={styles.accountMenuWrapper}>
      <Helmet>
        <title>{title}</title>
        <link
          rel="stylesheet"
          type="text/css"
          href={isDarkMode?'/css/dark.css':'/css/light.css'}
        />
      </Helmet>
      <Popup on="click"
             useCanvas
             placement="bottom-right"
             shown={accountMenuDropDownIsOpen}
             trigger={<Box loose className={styles.accountMenuButton}>
               <span className={styles.accountMenuText}>{fullNameToInitials(fullName)}</span>
               <DropdownDownIcon className={styles.accountMenuText} size='medium' color='grey'/>
             </Box>}
      >
        <PopupPanel className={styles.accountMenuListWrapper}
                    placement="bottom-right">
          <Box loose w='330px' className={styles.accountMenuList}>
            <div className={styles.accountInfo}>
              <Avatar src={null} size="XL" name={fullName} />
              <Div className={styles.accountName}>
                {fullName}
              </Div>
              <Div className={styles.accountEmail}>
                {email}
              </Div>
            </div>
            <Div flex className={styles.borderContent}/>
            {/*Мой профиль временно скрыт*/}
            {/*<div onClick={this.switchModalState} className={styles.accountMenuListItem}>*/}
              {/*<PersonIcon className={styles.accountMenuListIcon}/>*/}
              {/*<span>Мой профиль</span>*/}
            {/*</div>*/}
            <div className={styles.accountMenuListItem} onClick={this.switchDarkMode}>
              <CompareIcon className={styles.accountMenuListIcon}/>
              <span>{isDarkMode ? 'Светлый режим' : 'Темный режим'}</span>
            </div>
            <div className={styles.accountMenuListItem} onClick={logout}>
              <LogoutIcon className={styles.accountMenuListIcon}/>
              <span>Выйти</span>
            </div>
          </Box>
        </PopupPanel>
      </Popup>

      {/* закоменчино потому что пока ломает стили в датепикере*/}
      {/*{this.state.modalOpened && <div className={styles.modalWrapper}>*/}
      {/*    <ModalDialogWindow loose*/}
      {/*        className={styles.modalWindow}*/}
      {/*        onClose={this.switchModalState}*/}
      {/*        footer={*/}
      {/*            <Box>Никитин Роберт Егорович</Box>*/}
      {/*        }*/}
      {/*    />*/}
      {/*</div>}*/}
    </Box>
  }
}

export default Profile;