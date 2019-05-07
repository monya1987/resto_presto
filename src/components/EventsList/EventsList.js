// @flow
import React from 'react';
import classNames from 'classnames';
import {Box} from '@infotech/uikit-grid';

import {FormattedDate, Table} from '../../components';
import styles from './EventsList.pcss';
import {sortEventsFields, statusNames} from '../../utils/enums';
import type { THistory, TTable } from '../../utils/types';

type TProps = {
  setMainEventsInfoTable: (obj: {}) => mixed,
  data: Array<{}>,
  mainEventsTableInfo: TTable,
  mainEventsCount: number,
  history: THistory,
  isFetchingMainEvents: boolean,
  fetchMainEvents: (query: {}) => mixed
};

const columns = [{
  Header: 'Время сервер',
  accessor: 'serverRegTime',
  Cell: (props: {value: number}) => <FormattedDate timestamp={props.value}/>,
  width: 130,
  sortable: true
}, {
  Header: 'Время ППК',
  accessor: 'panelTime',
  Cell: (props: {value: number}) => <FormattedDate timestamp={props.value}/>,
  width: 120
}, {
  Header: 'П/Н',
  accessor: 'panelNumber',
  width: 85
}, {
  Header: 'УС',
  accessor: 'zoneNumber',
  width: 60
}, {
  Header: 'Ch',
  accessor: 'ch',
  width: 60
}, {
  Header: 'Событие',
  accessor: 'text'
}, {
  Header: 'Статус',
  accessor: 'status',
  Cell: (props: {value: string}) => {
    const { value } = props;
    if (value === 1) {
      return (<div className={classNames(styles.status, styles.statusTest)}>Прогон</div>);
    }
    if (value === statusNames.militant) {
      return (<div className={classNames(styles.status, styles.statusReady)}>Боевой</div>);
    }
    return '';
  }
}];

export default function(props: TProps) {
  const {
    data,
    fetchMainEvents,
    isFetchingMainEvents,
    history,
    mainEventsCount,
    mainEventsTableInfo,
    setMainEventsInfoTable,
  } = props;
  return (<Box w={1 / 2} height="100%">
    <Table
      loading={isFetchingMainEvents}
      data={data}
      totalCount={mainEventsCount}
      columns={columns}
      styles={styles}
      fetch={fetchMainEvents}
      setTableInfo={setMainEventsInfoTable}
      sortFields={sortEventsFields}
      getTrProps={(state: {}, rowInfo: {original: {uuid: number, objectId: string, panelNumber: string}}) => {
        return {
          onClick: () => {
            const { objectId, panelNumber } = rowInfo.original;
            history.push(`/object/${objectId}?pn=${panelNumber}`);
          },
          className: classNames(styles.row, styles[`color${status}`])
        }
      }}
      {...mainEventsTableInfo}
    />
  </Box>);
}
