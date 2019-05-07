// @flow
import React from 'react';
import {Box} from '@infotech/uikit-grid';
import Button from '@infotech/uikit-button';
import classNames from 'classnames';

import {FormattedDate, Table} from '../../components';
import styles from './AlarmsTable.pcss';
import {Loader} from '../../components';
import type {TTable, TAlarm, THistory} from '../../utils/types';
import {eventStatusNames, sortEventsFields} from '../../utils/enums';

type TProps = {
  data: Array<TAlarm>,
  fetchAlarms: (query: {}) => mixed,
  alarmsCount: number,
  history: THistory,
  alarmsTableInfo: TTable,
  setAlarmsInfoTable: (obj: {}) => mixed,
  isFetchingAlarms: boolean,
  closeAlarm: (id: string) => mixed,
  getToWork: (alarm: TAlarm) => mixed,
  getToWorkLoading: string,
  openAlarmClosureModal: (id: string) => mixed
};

export default function(props: TProps) {
  const {
    data,
    fetchAlarms,
    history,
    alarmsCount,
    alarmsTableInfo,
    setAlarmsInfoTable,
    isFetchingAlarms,
    getToWork,
    getToWorkLoading,
    closeAlarmLoading,
    openAlarmClosureModal,
    closeAlarmSlide
  } = props;

  const columns = [{
    Header: 'Время',
    accessor: 'serverRegTime',
    Cell: (props: {value: string}) => <FormattedDate timestamp={props.value} className={styles.text}/>,
    width: 80
  }, {
    Header: 'Событие',
    accessor: 'text',
    Cell: (props: {value: string}) => <div className={styles.text}>{props.value}</div>
  }, {
    Header: 'П/Н',
    accessor: 'panelNumber',
    width: 85,
    Cell: (props: {value: string}) => <div className={styles.text}>{props.value}</div>
  }, {
    Header: 'Объект',
    accessor: 'objectName',
    Cell: (props: {value: string}) => <div className={styles.text}>{props.value}</div>
  }, {
    Header: 'Оператор',
    accessor: 'operator',
    Cell: (props: {value: ?string, original: {uuid: string, eventStatus: string, objectId: string, panelNumber: string}}) => {
      const {original: {eventStatus, uuid}} = props;
      return (<div className={styles.lastCol}>
        <span>{'—'}</span>
        {eventStatus === eventStatusNames.processing &&
        (closeAlarmLoading === uuid ? <Loader size='small'/> :
        <Button onClick={(e: Event) => {
          e.stopPropagation();
          openAlarmClosureModal(uuid);
        }}>Закрыть</Button>)}

        {eventStatus === eventStatusNames.new &&
        (getToWorkLoading === uuid ? <Loader size='small'/> :
          <Button onClick={(e: Event) => {
            e.stopPropagation();
            getToWork(props.original);
          }}>Взять в работу</Button>)
        }
      </div>)
    },
    width: 205
  }];

  return (<Box w={1 / 2} mr="1md" height="100%">
    <Table
      loading={isFetchingAlarms}
      data={data}
      totalCount={alarmsCount}
      columns={columns}
      styles={styles}
      fetch={fetchAlarms}
      setTableInfo={setAlarmsInfoTable}
      sortFields={sortEventsFields}
      getTrProps={(state: {}, rowInfo: {original: {uuid: string, panelNumber: string, objectId: string, eventStatus: string }}) => {
        if (rowInfo) {
          const { uuid, panelNumber, objectId, eventStatus } = rowInfo.original;
          const inWork = eventStatus === eventStatusNames.processing;
          return {
            onClick: () => {
              history.push(`object/${objectId}?pn=${panelNumber}&alarm=${uuid}`);
            },
            className: classNames({
              [styles.rowInWork]: inWork,
              [styles.row]: !inWork,
              [styles.slideLeft]: closeAlarmLoading === rowInfo.original.uuid && closeAlarmSlide
            }),
          }
        }
      }}
      {...alarmsTableInfo}
    />
  </Box>);
}
