// @flow
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import get from 'lodash/get';
import {Box, Div} from '@infotech/uikit-grid';
import {Button, CleanButton} from '@infotech/uikit-button';
import {TrashIcon} from '@infotech/uikit-icons';
import DataGrid from '@infotech/uikit-datagrid';

import {ResponseServiceModal} from '../../components';
import {type TEvents} from '../../store/eventStore';
import {type TObject} from '../../store/objectStore';
import styles from './AlarmInfo.pcss';

type TData = {
  address: {
    fullAddress: string
  },
  serviceSvc: {
    name: string
  },
  observationType: {
    name: string
  },
  service: string,
  type: string,
  description: string,
  contacts: Array<{name: string, phone: string, password: string, info: string}>,
  responseSvc: {
    uuid: string,
    name: string
  },
  contactPersons: Array<{
    uuid: string,
    name: string,
    phone: string,
    monitoringcode: string,
    number: string
  }>
};

type TProps = {
  data: TData,
  store: {
    Events: TEvents,
    Object: TObject
  },
  switchServiceModalState: () => mixed
};

type TState = {
  isResponseServiceModalVisible: boolean
};

const columns = [{
  Header: 'ФИО',
  accessor: 'fullName',
  width: 140,
}, {
  Header: 'Телефон',
  accessor: 'phone',
  width: 130,
}, {
  Header: 'Пароль',
  accessor: 'password',
  width: 80
}, {
  Header: 'Информация',
  accessor: 'note',
  Cell: (props: { original: { note: string } }) => props.original.note.replace(/\s/g, '') || <span>&mdash;</span>
}];

@inject('store')
@observer
class AlarmInfo extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      isResponseServiceModalVisible: false
    }
  }

  switchServiceModalState = () => {
    this.setState({isResponseServiceModalVisible: !this.state.isResponseServiceModalVisible})
  };

  deleteResponseTeam = () => {
    this.props.store.Object.setActiveTeam({});
  };

  render() {
    const {
      props: {
        store: {
          Object: {
            responseTeams,
            responseTeam
          }
        },
        data
      },
      state: {
        isResponseServiceModalVisible
      }
    } = this;

    return (
      <Box loose className={styles.alarmInfoWrapper}>
        <Box loose className={styles.alarmInfo}>
          <Div flex align="center" justify="space-between" className={styles.titleWrapper}>
            <span className={styles.title}>Общая информация</span>
            <span className={styles.titleStatus}>Боевой</span>
          </Div>
          <Box>
            <Box w={1} loose flex column className={styles.alarmInfoItem}>
              <span>Адрес</span>
              <span>{get(data, 'address.fullAddress')}</span>
            </Box>
            <Box flex loose>
              <Box w={1} loose flex column className={styles.alarmInfoItem}>
                <span>Служба сервиса</span>
                <span>{get(data, 'serviceSvc.name')}</span>
              </Box>
              <Box w={1} loose flex column className={styles.alarmInfoItem}>
                <span>Тип</span>
                <span>{get(data, 'observationType.name')}</span>
              </Box>
            </Box>
          </Box>
        </Box>

        <div className={styles.contentBorder}/>

        <Box loose className={styles.alarmInfo}>
          <Box loose flex justify="space-between" className={styles.alarmInfoItem}>
            <Box loose flex column>
              <span>Служба реагирования</span>
              {get(data, 'responseSvc') ? <span>{get(data, 'responseSvc.name')}</span> : <span>&mdash;</span>}
            </Box>
            <Box loose>
              <Button className={styles.button} onClick={this.switchServiceModalState}>
                Выбрать
              </Button>
            </Box>
          </Box>

          {Object.keys(responseTeam).length > 0 && <Div className={styles.responseTeam}>
            <div>
              <span>{responseTeam.monitoringcode}</span>
              <span>&#8226;</span>
              <span>{responseTeam.name}</span>
              <span>&#8226;</span>
              <span>{responseTeam.phone}</span>
            </div>
            <CleanButton onClick={this.deleteResponseTeam}><TrashIcon/></CleanButton>
          </Div>}
        </Box>

        <div className={styles.contentBorder}/>

        <Box loose className={styles.alarmInfo}>
          <Box loose flex column className={styles.alarmInfoItem}>
            <span>Описание</span>
            <span>{get(data, 'description')}</span>
          </Box>
        </Box>

        <div className={styles.contentBorder}/>

        <Box loose className={styles.alarmInfoContacts}>
          <span className={styles.title}>Контакты</span>
          <Box loose>
            <DataGrid
              data={get(data, 'contactPersons', [])}
              columns={columns}
              className={styles.table}
              showPagination={false}
              getTdProps={() => ({ className: styles.td })}
            />
          </Box>
        </Box>

        {isResponseServiceModalVisible &&
        <ResponseServiceModal data={responseTeams}
                              switchServiceModalState={this.switchServiceModalState}
                              setActiveTeam={this.props.store.Object.setActiveTeam}
                              responseTeam={responseTeam}
                              fetchResponseTeams={this.props.store.Object.fetchResponseTeams}/>}
      </Box>
    )
  }
}

export default AlarmInfo;
