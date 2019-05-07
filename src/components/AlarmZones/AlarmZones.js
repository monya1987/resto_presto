// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {inject, observer} from 'mobx-react';
import queryString from 'query-string';
import classNames from 'classnames';
import {Box, Div} from '@infotech/uikit-grid';
import Button, {PrimaryButton, SecondaryButton} from '@infotech/uikit-button';
import get from 'lodash/get';

import {GroupZone, ObserveObjectModal, Loader} from '../../components';
import styles from './AlarmZones.pcss';
import type {TObject} from '../../store/objectStore';
import {eventStatusNames, supervisionStatusEnums} from '../../utils/enums';
import type {TAlarm} from '../../utils/types';

type TProps = {
  data: {connections: Array<{uuid: string, panelNumber: number, zones: Array<{}>}> },
  activeGroupNumber: number,
  activeZoneId: number,
  setCurrentZone: (uuid: string, panelNumber: number) => mixed,
  switchCreateDeclarationModal: () => mixed,
  closeAlarm: () => mixed,
  getToWork: (alarm: TAlarm) => mixed,
  store: {
    Object: TObject
  },
  getToWorkLoading: boolean,
  isFetchingActiveObject: boolean,
  ObjectId: string,
  openAlarmClosureModal: (id: string) => mixed
};

type TState = {
  shrinkGroups: boolean,
  isLoading: boolean,
  isGetBtn: boolean,
  isCloseBtn: boolean,
  showObserveObjectModal: boolean
};

@inject('store')
@observer
class AlarmZones extends Component<TProps, TState> {
  currentZoneItem: ?HTMLButtonElement;
  currentGroupItem: ?HTMLDivElement;
  constructor (props: TProps) {
    super(props);

    this.state = {
      shrinkGroups: false,
      isLoading: false,
      isGetBtn: false,
      isCloseBtn: false,
      showObserveObjectModal: false,
    }
  }

  componentDidMount() {
    if (this.currentGroupItem) {
      const currentGroupItem = ReactDOM.findDOMNode(this.currentGroupItem);
      if (currentGroupItem && currentGroupItem instanceof Element) {
        currentGroupItem.scrollIntoView({ block: 'center' });
      }
    }
    if (this.currentZoneItem) {
      this.currentZoneItem.scrollIntoView({ inline: 'center' });
    }
  }

  toggleShrinkGroups = () => {
    this.setState({ shrinkGroups: !this.state.shrinkGroups });
  };

  getToWork = () => {
    const {alarm} = queryString.parse(this.props.history.location.search);
    const currentAlarm = this.props.store.Events.objectEvents.find((item: TAlarm) => item.uuid === alarm);
    this.props.getToWork(currentAlarm)
      .then(() => {
        this.props.store.Object.setEventStatus(eventStatusNames.processing);
      });
  };

  openAlarmClosureModal = () => {
    const {alarm} = queryString.parse(this.props.history.location.search);
    this.props.openAlarmClosureModal(alarm);
  };

  toggleObserveObjectModal = () => {
    this.setState({ showObserveObjectModal: !this.state.showObserveObjectModal });
  }

  removeObserve = () => {
    const {props: {ObjectId, store: {Object: {currentZone:{supervision}, observeObject}}}} = this;

    const params = {
      ...supervision,
      supervisionStatus: 'CLOSED',
    };
    observeObject(supervision.id, params, ObjectId);
  }

  render() {
    const {
      props: {
        setCurrentZone,
        switchCreateDeclarationModal,
        getToWorkLoading,
        store: {
          Object: {
            activeObject,
            activeGroupNumber,
            activeZoneId,
            isFetchingActiveObject,
            alarmZones,
            currentZone,
            currentEventStatus,
            observeObject,
            getEmployees,
            employess,
            isFetchingEmployees,
          }
        }
      },
      state: {
        shrinkGroups,
        showObserveObjectModal,
      }
    } = this;

    const isEventStatusNew = currentEventStatus === eventStatusNames.new;
    const isEventStatusProcessing = currentEventStatus === eventStatusNames.processing;
    const showGetBtn = isEventStatusNew && !getToWorkLoading && !isFetchingActiveObject;
    const showCloseBtn = isEventStatusProcessing && !getToWorkLoading;
    const supervision = get(currentZone, 'supervision', {});
    const showObserveBtn = supervision.supervisionStatus === supervisionStatusEnums.closed;

    return (<Box height="100%" flex column>
      <Box className={styles.tabs}>
        {alarmZones && alarmZones.map(({panelNumber, uuid}: {panelNumber: number, uuid: string}) => {
          const objectId = activeObject.uuid;
          return <Button
            key={uuid}
            ref={(node: ?HTMLButtonElement) => {
              this.currentZoneItem = activeZoneId === uuid ? node : this.currentZoneItem
            }}
            onClick={() => setCurrentZone(uuid, objectId, panelNumber)}
            className={classNames({
              [styles.activeBtn]: activeZoneId === uuid,
              [styles.hasAlarm]: false,
            })}>П/Н {panelNumber}</Button>
        })
        }
      </Box>
      <Div flex className={styles.titleWrapper} align="center" h={52}>
        {getToWorkLoading && <Loader size='small'/>}
        {showGetBtn && <PrimaryButton className={styles.btn} onClick={this.getToWork}>Взять в работу</PrimaryButton>}
        {showCloseBtn && <PrimaryButton className={styles.btn} onClick={this.openAlarmClosureModal}>Закрыть тревогу</PrimaryButton>}
        {showObserveBtn && !isFetchingActiveObject && <Button withBorder className={styles.btnShow} onClick={this.toggleObserveObjectModal}>Наблюдать</Button>}
        {!showObserveBtn && !isFetchingActiveObject && <Button withBorder className={styles.btnShow} onClick={this.removeObserve}>Снять с наблюдения</Button>}
        <SecondaryButton className={styles.rightBtn} onClick={switchCreateDeclarationModal}>Создать заявку</SecondaryButton>
      </Div>

      <Box p='2md' className={styles.alarmZonesWrapper} loose>
        <Button className={styles.toggleBtn} clean onClick={this.toggleShrinkGroups}>
          {shrinkGroups ? 'Развернуть все' : 'Свернуть все'}
        </Button>
        <div className={styles.title}>Зоны</div>
        {get(activeObject, 'connections', []).map((item: {name: string, uuid: string, number: string}) => {
          return <GroupZone
            ref={(node: ?HTMLDivElement) => {
              this.currentGroupItem = activeGroupNumber === item.number ? node : this.currentGroupItem
            }}
            item={item}
            key={item.uuid}
            shrinkGroups={shrinkGroups}
          />
        })}
      </Box>
      {showObserveObjectModal && <ObserveObjectModal
        observeObject={observeObject}
        connectionId={activeZoneId}
        closeModal={this.toggleObserveObjectModal}
        getEmployees={getEmployees}
        employess={employess}
        isFetchingEmployees={isFetchingEmployees}
        supervisionId={supervision.id}
        ObjectId={this.props.ObjectId}
      />}
    </Box>);
  }
}

export default AlarmZones;
