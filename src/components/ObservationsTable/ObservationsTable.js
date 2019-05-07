// @flow
import React from 'react';
import {Box} from '@infotech/uikit-grid';

import {FormattedDate, Table} from '../../components';
import styles from './ObservationsTable.pcss';
import type {THistory, TTable} from '../../utils/types';
import {sortObservationsFields} from '../../utils/enums';

type TProps = {
  data: Array<{}>,
  fetchObservations: (query: {}) => mixed,
  observationsCount: number,
  history: THistory,
  setObservationsInfoTable: (obj: {}) => mixed,
  observationsTableInfo: TTable,
  isFetchingObservations: boolean
};

const columns = [{
  Header: 'Наблюдение до',
  accessor: 'observeUntil',
  Cell: (props: {value: number}) => <FormattedDate timestamp={props.value} oneRow/>
}, {
  Header: 'П/Н',
  accessor: 'panelNumber',
  width: 85
}, {
  Header: 'Наименование',
  accessor: 'name'
}, {
  Header: 'Оператор',
  accessor: 'operator'
}, {
  Header: 'Техник ПЦО',
  accessor: 'techPco'
}, {
  Header: 'Пользователь',
  accessor: 'user'
}];

export default function(props: TProps) {
  const {
    data,
    fetchObservations,
    history,
    observationsCount,
    observationsTableInfo,
    setObservationsInfoTable,
    isFetchingObservations,
  } = props;
  return (<Box w={1 / 2} mr="1md" height="100%">
    <Table
      loading={isFetchingObservations}
      data={data}
      totalCount={observationsCount}
      columns={columns}
      styles={styles}
      fetch={fetchObservations}
      setTableInfo={setObservationsInfoTable}
      sortFields={sortObservationsFields}
      getTrProps={(state: {}, rowInfo: {original: {objectId: string, panelNumber: string}}) => {
        return {
          onClick: () => {
            const { objectId, panelNumber } = rowInfo.original;
            history.push(`/object/${objectId}?pn=${panelNumber}`);
          },
          className: styles.row
        }
      }}
      {...observationsTableInfo}
    />
  </Box>);
}
