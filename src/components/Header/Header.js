// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {Box} from '@infotech/uikit-grid';
import TopBar from '@infotech/uikit-topbar';
import {ApplicationsList} from '@infotech/widget-applications-list';

import {Clock, BreadCrumbs, Profile, Search} from '../../components';
import type {TSystem} from '../../store/systemStore';
import styles from './Header.pcss';

type TProps = {
  title: string,
  type: string,
  breadcrumbs: Array<{ name: string, to?: string, id: number | string }>,
  store: {
    System: TSystem
  }
};

type TApplication = {
  clientId: string,
  host: string,
  id: number,
  name: string
};

const AppsList = ({applications}: Array<TApplication>) => (
  <div className={styles['system-list']}>
    <ApplicationsList
      applications={applications}
      left
    />
  </div>
);

const Separator = () =>  <Box w='1md' m='1md' loose flex className={styles.borderContent}/>;

@inject('store')
@observer
class Header extends Component<TProps> {
  componentDidMount() {
    this.props.store.System.fetchApplicationsList();
  }

  render() {
    const {
      props: {
        store: {
          System: {
            applicationsList
          }
        },
        title,
        breadcrumbs
      }
    } = this;

    return (
      <>
        <TopBar
          className={styles.topbarWrapper}
          name={title}
          leftContent={[
            <Box key='logo' className={styles.logoWrapper} w="4bl" h={1} loose>
              <Link to='/'>
                <img className={styles.logo} src='/img/logo.png' alt="ФГУП Охрана"/>
              </Link>
            </Box>,
            <BreadCrumbs key='breadcrumbs' breadcrumbs={breadcrumbs}/>
          ]}
          items={[
            <Box flex loose className={styles.topbarContentWrapper}>
              <Search />
              <Profile title={title}/>
              <Separator/>
              <Clock/>
              <Separator/>
              <AppsList applications={applicationsList}/>
            </Box>
          ]}
        />
      </>
    )
  }
}

export default Header;
