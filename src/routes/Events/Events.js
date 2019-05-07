// @flow
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import Button from '@infotech/uikit-button';
import {Box} from '@infotech/uikit-grid';

import type {TAlarm, TRoute as TProps} from '../../utils/types';
import {AlarmClosureModal, AlarmsTable, EventsList, ObservationsTable, Page, ToastNewAlarms} from '../../components';
import withAuth from '../../utils/withAuth';
import styles from './Events.pcss';
import {eventStatusNames, tabNames} from '../../utils/enums';
import type {TObject} from '../../store/objectStore';
import toast from '../../utils/toast';

type TState = {
  isAlarmClosureModalVisible: boolean,
  currentAlarm: TObject
};

@withAuth
@inject('store')
@observer
class Events extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      isAlarmClosureModalVisible: false,
      currentAlarm: {}
    }
  }

  componentDidMount() {
    const {
      Events: {alarmsTableInfo, fetchAlarms, fetchMainEvents,  mainEventsTableInfo, alarms},
      Object: {fetchObservations, observationsTableInfo},
    } = this.props.store;
    if (alarms.length === 0) {
      fetchAlarms({ limit: alarmsTableInfo.pageSize, offset: alarmsTableInfo.page, orderBy: alarmsTableInfo.orderBy });
    }
    fetchMainEvents({ limit: mainEventsTableInfo.pageSize, offset: mainEventsTableInfo.page, orderBy: mainEventsTableInfo.orderBy });
    fetchObservations({ limit: observationsTableInfo.pageSize, offset: observationsTableInfo.page, orderBy: observationsTableInfo.orderBy });
  }

  static getDerivedStateFromProps(props: TProps) {
    const { Events: { messages, resetMessages }} = props.store;
    if (messages.length !== 0) {
      messages.forEach((message: {type: string, text: string}) => toast(message));
      resetMessages();
    }
    return null;
  }

  openAlarmClosureModal = (id: string) => {
    const currentAlarm = this.props.store.Events.alarms.find((item: TAlarm) => item.objectId === id);
    this.setState({isAlarmClosureModalVisible: true, currentAlarm})
  };

  closeAlarmClosureModal = () => {
    this.setState({isAlarmClosureModalVisible: false});
  };

  closeAlarm = (reason: {value: string, name: string}) => {
    const userId = this.props.store.System.currentUser.id;
    this.props.store.Events.closeAlarm(reason, this.state.currentAlarm, userId);
    this.props.store.Object.setEventStatus(eventStatusNames.closed);
    this.closeAlarmClosureModal();
  };

  render() {
    const {
      props: {
        store: {
          Events: {
            mainEvents, mainEventsCount, mainEventsTableInfo, fetchMainEvents, setMainEventsInfoTable, isFetchingMainEvents,
            alarms, fetchAlarms, alarmsCount, alarmsTableInfo, setAlarmsInfoTable, isFetchingAlarms, closeAlarmLoading,
            toggleTab, activeTabs: {activeTab1, activeTab2}, getToWorkLoading, getReasonsList, closureReasons, closeAlarmSlide
          },
          Object: {
            observations, fetchObservations, observationsCount, observationsTableInfo, setObservationsInfoTable, isFetchingObservations,
          }
        },
        history,
      },
      state: {
        isAlarmClosureModalVisible,
      }
    } = this;

    return (
      <Page title='ФГУП Охрана' breadcrumbs={[{ name: 'Журнал', id: 'log' }]}>
        <Box flex column h="100%">
          {/* tabs */}
          <Box flex mx="1ui" my="2md">
            <Box flex align="center" w={1 / 2} pl="1md" mr="1md">
              <Button
                onClick={() => toggleTab('activeTab1', tabNames.alarms)}
                className={classNames({
                  [styles.btnTabs]: true,
                  [styles.activeBtn]: activeTab1 === tabNames.alarms
                })}>Тревоги</Button>
              <Button
                onClick={() => toggleTab('activeTab1', tabNames.observations)}
                className={classNames({
                  [styles.btnTabs]: true,
                  [styles.activeBtn]: activeTab1 === tabNames.observations
                })}>Наблюдаемые объекты</Button>
            </Box>
            <Box flex align="center" w={1 / 2} pl="1md">
              <Button
                onClick={() => toggleTab('activeTab2', tabNames.mainEvents)}
                className={classNames({
                  [styles.btnTabs]: true,
                  [styles.activeBtn]: activeTab2 === tabNames.mainEvents
                })}>Основные события</Button>
              <Button
                onClick={() => toggleTab('activeTab2', tabNames.allEvents)}
                className={classNames({
                  [styles.btnTabs]: true,
                  [styles.activeBtn]: activeTab2 === tabNames.allEvents
                })}>Все события</Button>
            </Box>
          </Box>
          {/* end tabs */}
          {/* tables */}
          <Box flex mx="1ui" align="stretch" grow={1} shrink={1} basic={'auto'}>
            {activeTab1 === tabNames.alarms && <AlarmsTable
              data={alarms}
              alarmsTableInfo={alarmsTableInfo}
              history={history}
              fetchAlarms={fetchAlarms}
              alarmsCount={alarmsCount}
              setAlarmsInfoTable={setAlarmsInfoTable}
              isFetchingAlarms={isFetchingAlarms}
              getToWork={this.props.store.Events.getAlarmToWork}
              getToWorkLoading={getToWorkLoading}
              openAlarmClosureModal={this.openAlarmClosureModal}
              closeAlarmLoading={closeAlarmLoading}
              closeAlarmSlide={closeAlarmSlide}
            />}
            {activeTab1 === tabNames.observations && <ObservationsTable
              data={observations}
              history={history}
              fetchObservations={fetchObservations}
              observationsCount={observationsCount}
              observationsTableInfo={observationsTableInfo}
              setObservationsInfoTable={setObservationsInfoTable}
              isFetchingObservations={isFetchingObservations}
            />}
            {activeTab2 === tabNames.mainEvents && <EventsList
              history={history}
              data={mainEvents}
              isFetchingMainEvents={isFetchingMainEvents}
              mainEventsCount={mainEventsCount}
              mainEventsTableInfo={mainEventsTableInfo}
              fetchMainEvents={fetchMainEvents}
              setMainEventsInfoTable={setMainEventsInfoTable}
            />}
            {activeTab2 === tabNames.allEvents && <EventsList
              history={history}
              data={mainEvents}
              isFetchingMainEvents={isFetchingMainEvents}
              mainEventsCount={mainEventsCount}
              mainEventsTableInfo={mainEventsTableInfo}
              fetchMainEvents={fetchMainEvents}
              setMainEventsInfoTable={setMainEventsInfoTable}
            />}
          </Box>
          {/* end tables */}
        </Box>

        {isAlarmClosureModalVisible &&
        <AlarmClosureModal openAlarmClosureModal={this.openAlarmClosureModal}
                           closeAlarmClosureModal={this.closeAlarmClosureModal}
                           closeAlarm={this.closeAlarm}
                           getReasonsList={getReasonsList}
                           alarm={this.state.currentAlarm}
                           closureReasons={closureReasons}/>}
      </Page>
    );
  }
}

export default Events;
