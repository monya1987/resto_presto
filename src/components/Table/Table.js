// @flow
import React from 'react';
import DataGrid from '@infotech/uikit-datagrid';

type TProps = {
  loading: boolean,
  data: [],
  page: number,
  sorted: [],
  totalCount: number,
  pageSize: number,
  orderBy: string,
  columns: [],
  styles: {td?: string, rtGroup?: string, table?: string},
  fetch: ({limit: number, offset: number, orderBy?: string}) => mixed,
  setTableInfo: ({sorted?: Array<{id: string, desc: boolean}>, pageSize?: number, page?: number, orderBy?: string}) => mixed,
  sortFields: {},
  getTrProps?: () => mixed
};

export default function (props: TProps) {
  const {
    loading,
    data,
    page,
    sorted,
    totalCount,
    pageSize,
    orderBy,
    columns,
    styles,
    fetch,
    setTableInfo,
    sortFields,
    getTrProps,
  } = props;

  return (<DataGrid
    manual
    loading={loading}
    loadingText='Загрузка...'
    data={data}
    page={page}
    sorted={sorted}
    totalCount={totalCount}
    pageSize={pageSize}
    columns={columns}
    className={styles.table}
    getTdProps={() => ({className: styles.td })}
    getTrGroupProps={() => ({ className: styles.rtGroup })}
    getTrProps={getTrProps}
    onPageChange={(pageIndex: number) => {
      if (pageIndex !== page) {
        fetch({ limit: pageSize, offset: pageIndex * pageSize, orderBy });
        setTableInfo({ page: pageIndex });
      }
    }}
    onPageSizeChange={(pageNewSize: number) => {
      if (pageNewSize !== pageSize) {
        fetch({ limit: pageNewSize, offset: 0, orderBy });
        setTableInfo({ page: 0, pageSize: pageNewSize });
      }
    }}
    onSortedChange={(newSorted: Array<{id: string, desc: boolean}>) => {
      if (newSorted && newSorted.length > 0) {
        const { id, desc } = newSorted[0];
        let newOrderBy = `${sortFields[id]}${desc ? '+desc' : ''}`;
        setTableInfo({ sorted: newSorted, page: 0, orderBy: newOrderBy });
        fetch({ limit: pageSize, offset: 0, orderBy: newOrderBy });
      } else {
        setTableInfo({ sorted: [], page: 0, orderBy: '' });
        fetch({ limit: pageSize, offset: 0 });
      }
    }}
  />);
}
