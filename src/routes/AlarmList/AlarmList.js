// @flow
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import get from 'lodash/get';
import {Box} from '@infotech/uikit-grid';
import queryString from 'query-string';

import withAuth from '../../utils/withAuth';
import type {TAlarm, TRoute as TProps} from '../../utils/types';
import {
  AlarmTitle,
  AlarmInfo,
  AlarmObjectList,
  AlarmEvents,
  AlarmZones,
  Page,
  AlarmClosureModal,
  CreateDeclarationModal,
  Loader,
} from '../../components';
import styles from './AlarmList.pcss';
import {eventStatusNames} from "../../utils/enums";

type TState = {
  alarmEventsFullHeight: boolean,
  isAlarmClosureModalVisible: boolean,
  isCreateModalVisible: boolean,
  currentAlarm: TAlarm
};

@withAuth
@inject('store')
@observer
class AlarmList extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      alarmEventsFullHeight: false,
      isCreateModalVisible: false,
      isAlarmClosureModalVisible: false,
      currentAlarm: {}
    }
  }

  componentDidMount() {
    const {
      Events: { fetchAlarms, alarms, alarmsTableInfo },
    } = this.props.store;
    if(alarms.length === 0) {
      fetchAlarms({ limit: alarmsTableInfo.pageSize, offset: alarmsTableInfo.page, orderBy: alarmsTableInfo.orderBy });
    }
    this.fetchData();
  }

  componentDidUpdate(prevProps: {location: {}}) {
    if (this.props.location !== prevProps.location) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const {
      Events: { fetchObjectEvents },
      Object: { fetchActiveObject },
    } = this.props.store;
    fetchActiveObject(this.props.match.params.id);
    fetchObjectEvents(this.props.match.params.id);
  };

  toggleAlarmEventsHeight = () => {
    this.setState({alarmEventsFullHeight: !this.state.alarmEventsFullHeight});
  };

  goBack = () => {
    return this.props.history.goBack();
  };

  switchCreateDeclarationModal = () => {
    this.setState({isCreateModalVisible: !this.state.isCreateModalVisible})
  };

  fetchResponseTeams = (id: string) => {
    this.props.store.Object.fetchResponseTeams(id)
  };

  openAlarmClosureModal = (id: string) => {
    let currentAlarm = this.props.store.Events.alarms.find((item: TAlarm) => item.uuid === id);
    if (!currentAlarm) {
      currentAlarm = this.props.store.Events.objectEvents.find((item: TAlarm) => item.uuid === id);
    }
    this.setState({isAlarmClosureModalVisible: true, currentAlarm})
  };

  getToWork = (alarm: TAlarm) => {
    return this.props.store.Events.getAlarmToWork(alarm)
      .then(() => {
        this.props.store.Object.setEventStatus(eventStatusNames.processing)
      })
  };

  closeAlarmClosureModal = () => {
    this.setState({isAlarmClosureModalVisible: false});
  };

  closeAlarm = (reason: {value: string, name: string}, alarm: TAlarm) => {
    const userId = this.props.store.System.currentUser.id;
    this.props.store.Events.closeAlarm(reason, alarm, userId);
    this.props.store.Object.setEventStatus(eventStatusNames.closed);
    this.closeAlarmClosureModal();
  };

  setCurrentZone = (uuid: string, objectId: string, panelNumber: number) => {
    const {alarm} = queryString.parse(this.props.history.location.search);
    this.props.store.Object.setCurrentZone(uuid);
    this.props.history.push(`/object/${objectId}?pn=${panelNumber}&alarm=${alarm}`);
  };

  render() {
    const {
      props: {
        store: {
          Events: {
            alarms, objectEvents, isFetchingAlarms, alarmsCount, fetchAlarms, setAlarmsInfoTable, alarmsTableInfo,
            fetchObjectEvents, isFetchingObjectEvents, getToWorkLoading, getReasonsList, closureReasons, closeAlarmLoading
          },
          Object: {
            activeObject, clearActiveObject, isFetchingActiveObject
          }
        },
        history,
      },
      state: {
        alarmEventsFullHeight,
        isCreateModalVisible,
        isAlarmClosureModalVisible
      }
    } = this;

    const ObjectId = this.props.match.params.id;

    const breadcrumbs = [
      {name: 'Журнал', id: 'log', to: '/'},
      {name: get(activeObject, 'name', ''), id: get(activeObject, 'uuid', '')}
    ];

    return (
      <Page title={get(activeObject, 'name')} breadcrumbs={breadcrumbs}>
        <Box flex h="calc(100vh - 56px)">

          <Box h="100%" w={1 / 3} className={styles.alarmObjectList}>
            <AlarmObjectList
              data={alarms}
              history={history}
              getToWork={this.getToWork}
              openAlarmClosureModal={this.openAlarmClosureModal}
              closeAlarmClosureModal={this.closeAlarmClosureModal}
              clearActiveObject={clearActiveObject}
              alarmsCount={alarmsCount}
              isFetchingAlarms={isFetchingAlarms}
              fetchAlarms={fetchAlarms}
              setAlarmsInfoTable={setAlarmsInfoTable}
              alarmsTableInfo={alarmsTableInfo}
              getToWorkLoading={getToWorkLoading}
              closeAlarmLoading={closeAlarmLoading}
            />
          </Box>

          <Box h="100%" w={2 / 3} flex column>

            <Box h="100%" column flex className={styles.objectInfoWrapper}>
              <Box h="50px" w={1} className={styles.alarmTitle}>
                <AlarmTitle title={get(activeObject, 'name')} goBack={this.goBack}/>
              </Box>

              <Box h="100%" flex>
                <Box h="100%" w={1 / 2} className={styles.alarmInfo}>
                  <AlarmInfo data={activeObject}/>
                </Box>
                <Box h="100%" w={1 / 2} className={styles.alarmZones}>
                  <AlarmZones
                    setCurrentZone={this.setCurrentZone}
                    switchCreateDeclarationModal={this.switchCreateDeclarationModal}
                    openAlarmClosureModal={this.openAlarmClosureModal}
                    getToWork={this.getToWork}
                    getToWorkLoading={getToWorkLoading}
                    history={history}
                    ObjectId={ObjectId}
                  />
                </Box>
              </Box>
              {isFetchingActiveObject && <div className={classNames({
                [styles.objectInfoOverlay]: true,
                [styles.showObjectInfoOverlay]: isFetchingActiveObject
              })}><Loader /></div>}
            </Box>

            <Box className={classNames({
              [styles.alarmEvents]: true,
              [styles.alarmEventsFullHeight]: alarmEventsFullHeight,
            })}>
              <AlarmEvents
                  data={objectEvents}
                  fullHeight={alarmEventsFullHeight}
                  toggleHeight={this.toggleAlarmEventsHeight}
                  fetchObjectEvents={fetchObjectEvents}
                  isFetchingObjectEvents={isFetchingObjectEvents}
                  currentObjectId={ObjectId}
              />
            </Box>

          </Box>
        </Box>

        {isCreateModalVisible &&
        <CreateDeclarationModal switchCreateDeclarationModal={this.switchCreateDeclarationModal}/>}

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

export default AlarmList;
