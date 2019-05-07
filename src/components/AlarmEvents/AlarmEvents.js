// @flow
import React from 'react';
import {Box} from '@infotech/uikit-grid';
import Button from '@infotech/uikit-button';
import {ExpandScreenIcon, ShrinkScreenIcon} from '@infotech/uikit-icons';
import DataGrid from '@infotech/uikit-datagrid';

import {FormattedDate, DatePicker} from '../../components';
import styles from './AlarmEvents.pcss';
import {statusColors} from '../../utils/enums';

type TProps = {
  data: Array<{timeServer: number}>,
  fullHeight: boolean,
  toggleHeight: () => mixed,
  isFetchingObjectEvents: boolean,
  fetchObjectEvents: (query: string, queryString?: string) => mixed,
  currentObjectId: string
};

type TState = {
  resetData: boolean,
  dateStart: ?Date,
  dateEnd: ?Date
};

const columns = [{
  Header: 'Время сервера',
  accessor: 'serverRegTime',
  width: 152,
  Cell: (props: {value: number}) => <FormattedDate timestamp={props.value} oneRow />,
}, {
  Header: 'Событие',
  accessor: 'text',
}];

class AlarmEvents extends React.Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      resetData: false,
      dateStart: undefined,
      dateEnd: undefined,
    };
  }

  setData = () => {
    const {
      state: {
        dateStart, dateEnd,
      },
      props: {
        fetchObjectEvents, currentObjectId,
      }
    } = this;
    if (dateStart && dateEnd) {
      const dateStartMS = dateStart.getTime();
      const dateEndMS = dateEnd.getTime();
      fetchObjectEvents(currentObjectId, `;serverRegTime>${dateStartMS};serverRegTime<${dateEndMS}`);
      this.setState({
        resetData: true,
      });
    }
  };

  resetData = () => {
    const {fetchObjectEvents, currentObjectId} = this.props;
    fetchObjectEvents(currentObjectId);
    this.setState({
      resetData: false,
      dateStart: undefined,
      dateEnd: undefined,
    });
  };

  onChangeDateStartPicker = (value: Date) => {
    this.setState({dateStart: value});
  };

  onChangeDateEndPicker = (value: Date) => {
    this.setState({dateEnd: value});
  };

  render() {
    const {
      state: {
        dateStart, dateEnd, resetData,
      },
      props: {
        fullHeight, data, isFetchingObjectEvents
      }
    } = this;
    const disabledBtn = dateStart === undefined || dateEnd === undefined;
    return (<Box height="100%">
      <Box pl="2md" h="56px" flex align="center" loose>
        <Button icon={fullHeight ? ShrinkScreenIcon : ExpandScreenIcon} clean className={styles.clearBtn} onClick={this.props.toggleHeight} />
        <span className={styles.labels}>с</span>
        <DatePicker fullHeight
                    onChange={this.onChangeDateStartPicker}
                    value={dateStart}
                    inline
        />
        <span className={styles.labels}>до</span>
        <DatePicker fullHeight
                    onChange={this.onChangeDateEndPicker}
                    value={dateEnd}
        />
        <Button disabled={disabledBtn} className={styles.showBtn} onClick={this.setData}>Показать</Button>
        <Button disabled={!resetData} className={styles.showBtn} onClick={this.resetData}>Сбросить</Button>
      </Box>
      <Box className={styles.alarmEventsWrapper}>
        <DataGrid
          loading={isFetchingObjectEvents}
          loadingText='Загрузка...'
          data={data}
          columns={columns}
          className={styles.table}
          showPagination={fullHeight}
          getTdProps={() => ({className: styles.td })}
          getTrGroupProps={() => ({ className: styles.rtGroup })}
          getTrProps={(state: {}, rowInfo: { original: {status: number}}) => {
            if (rowInfo) {
              const { status } = rowInfo.original;
              return { className: styles[`${statusColors[status]}`] };
            }
            return {};
          }}
        />
      </Box>
    </Box>);
  }
}

export default AlarmEvents;
