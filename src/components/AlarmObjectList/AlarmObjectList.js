// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import queryString from 'query-string';

import {Box, Div} from '@infotech/uikit-grid';
import {Button} from '@infotech/uikit-button';
import {FormattedDate, Table, Loader, AlarmTimer} from '../../components';
import {eventStatusNames, sortEventsFields} from '../../utils/enums';
import styles from './AlarmObjectList.pcss';
import type {THistory, TTable} from '../../utils/types';
import {inject, observer} from 'mobx-react';

type TData = {
  address: string,
  service: string,
  type: string,
  description: string,
  contacts: Array<{name: string, phone: string, password: string, info: string}>,
  length: number
};

type TProps = {
  data: TData,
  getToWork: () => mixed,
  closeAlarm: () => mixed,
  history: THistory,
  clearActiveObject: () => mixed,
  alarmsTableInfo: TTable,
  setAlarmsInfoTable: (obj: {}) => {},
  fetchAlarms: (query: {}) => {},
  alarmsCount: number,
  isFetchingAlarms: boolean,
  openAlarmClosureModal: (uuid: string) => mixed
};

type TState = {
  activeAlarmId: string
};

@inject('store')
@observer
class AlarmObjectList extends Component<TProps, TState> {
  columns: Array<{}>;
  constructor(props: TProps) {
    super(props);
    const {alarm} = queryString.parse(location.search);
    this.state = {
      activeAlarmId: alarm
    };
    this.columns = [{
      getHeaderProps: () => ({className: styles.hiddenHeader}),
      accessor: 'eventStatus',
      Cell: (props: {value: string}) => {
        const {value} = props;
        return <Box loose className={styles.alarmItemPoint}>
          <span className={classNames({
            [styles.statusPoint]: true,
            [styles.statusPointInWork]: value === eventStatusNames.processing,
          })}/>
        </Box>
      },
      width: 10,
      sortable: true,
    }, {
      getHeaderProps: () => ({className: styles.hiddenHeader}),
      accessor: 'panelNumber',
      Cell: (props: { value: number, original: { text: string, eventStatus: string, alarmProcess: {processTime: string} } }) => {
        const {original: {text, eventStatus, alarmProcess}, value} = props;
        return (<Box className={styles.alarmItemInfo}>
          <span>{text}</span>
          <Div flex>
            <span>{value}</span>
            <Div flex align="center" grow="1">
              <Div flex align="center" grow="1" className={styles.personInfo}>
              </Div>
              {eventStatus === eventStatusNames.processing && alarmProcess && <AlarmTimer startProcess={alarmProcess.startProcess} />}
            </Div>
          </Div>
        </Box>);
      },
    }, {
      getHeaderProps: () => ({className: styles.hiddenHeader}),
      accessor: 'serverRegTime',
      Cell: (props: {value: number, original: {eventStatus: string, uuid: string}}) => {
        const {original: {eventStatus, uuid}, value} = props;
        return <Box className={styles.alarmItemAction}>
          {eventStatus === eventStatusNames.processing &&
          (this.props.closeAlarmLoading === uuid ? <Loader size='small'/> :
            <Button onClick={(e: Event) => {
              e.stopPropagation();
              this.props.openAlarmClosureModal(uuid);
            }}>Закрыть</Button>)
          }

          {eventStatus === eventStatusNames.new &&
          (this.props.getToWorkLoading === uuid ? <Loader size='small'/> :
            <Button onClick={(e: Event) => {
              e.stopPropagation();
              this.props.getToWork(props.original);
            }}>Взять в работу</Button>)
          }
          <FormattedDate timestamp={value} className={styles.text} oneRow/>
        </Box>
      },
      width: 150,
    }];
  }

  componentWillUnmount() {
    this.props.clearActiveObject()
  };

  setActiveAlarmId = (uuid: string) => {
    this.setState({activeAlarmId: uuid});
  };

  render() {
    const {
      props: {
        data,
        history,
        isFetchingAlarms,
        alarmsCount,
        fetchAlarms,
        setAlarmsInfoTable,
        alarmsTableInfo,
        store: {
          Events: {
            closeAlarmLoading,
            closeAlarmSlide
          }
        }
      },
      state: {
        activeAlarmId
      }
    } = this;

    return (<Box w={1} height="100%">
      <Table
        loading={isFetchingAlarms}
        data={data}
        totalCount={alarmsCount}
        columns={this.columns}
        styles={styles}
        fetch={fetchAlarms}
        setTableInfo={setAlarmsInfoTable}
        sortFields={sortEventsFields}
        getTrProps={(state: {}, rowInfo: { original: {uuid: string, eventStatus: string, objectId: string, panelNumber: string} }) => {
          if (rowInfo) {
            const {original: {eventStatus, uuid, panelNumber, objectId}} = rowInfo;
            const inWork = eventStatus === eventStatusNames.processing;
            return {
              onClick: () => {
                this.setActiveAlarmId(uuid);
                history.push(`/object/${objectId}?pn=${panelNumber}&alarm=${uuid}`);
              },
              className: classNames({
                [styles.rowInWork]: inWork,
                [styles.row]: !inWork,
                [styles.activeInWork]: inWork && uuid === activeAlarmId,
                [styles.active]: !inWork && uuid === activeAlarmId,
                [styles.slideLeft]: closeAlarmLoading === uuid && closeAlarmSlide
              }),
            }
          }
          return {};
        }}
        {...alarmsTableInfo}
      />
    </Box>);
  }
}

export default AlarmObjectList;