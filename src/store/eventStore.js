// @flow
import {observable, action} from 'mobx';
import {remove} from 'lodash';

import Api from '../utils/api';
import {tabNames} from '../utils/enums';
import type {TTable, TQuery, TAlarm} from '../utils/types';
import {eventStatusNames} from '../utils/enums';
import {playNotifySound} from '../utils/sound';

type TEvent = {
  timeServer: number,
  timePPK: number,
  number: number,
  yc: number,
  ch: number,
  event: string,
  status: number
};

export type TEvents = {
  activeTabs: { activeTab1: string, activeTab2: string },
  toggleTab: (tab: string, value: string) => mixed,
  mainEvents: Array<TEvent>,
  mainEventsCount: number,
  mainEventsTableInfo: TTable,
  setMainEventsInfoTable: () => mixed,
  alarms: Array<TAlarm>,
  alarmsTableInfo: TTable,
  fetchEvents: () => mixed,
  isFetchingMainEvents: boolean,
  isFetchingAlarms: boolean,
  setCurrentZone: (uuid: string) => mixed,
  fetchAlarms: (query: TQuery) => mixed,
  fetchObjectEvents: (id: string) => mixed,
  objectEvents: Array<{uuid: string, serverRegTime: string, text: string}>,
  fetchAlarms: (query: TQuery) => mixed,
  messages: Array<{type: string}>,
  resetMessages: () => mixed,
  getAlarmToWork: (alarm: TAlarm) => mixed,
  getToWorkLoading: string,
  objectEvents: Array<{uuid: string, serverRegTime: string, text: string}>,
  closureReasons: Array<TReason>,
  closeAlarm: (event: TEvent, reasonId: string) => mixed,
  closeAlarmLoading: string,
  closeAlarmSlide: boolean
};

export type TReason = {
  uuid: string,
  name: string
};

const api = new Api();

export default class Store {
  @observable activeTabs = { activeTab1: tabNames.alarms, activeTab2: tabNames.mainEvents };
  @observable isFetchingMainEvents = true;
  @observable mainEvents = [];
  @observable mainEventsCount = 0;
  @observable mainEventsTableInfo ={
    page: 0,
    pageSize: 20,
    sorted: [],
    orderBy: '',
  };
  @observable error = null;
  @observable isFetchingAlarms = true;
  @observable alarms = [];
  @observable alarmsCount = 0;
  @observable alarmsTableInfo = {
    page: 0,
    pageSize: 20,
    sorted: [],
    orderBy: 'serverRegTime+desc',
  };
  // events for object
  @observable objectEvents = [];
  @observable isFetchingObjectEvents = true;
  @observable getToWorkLoading = null;
  @observable closureReasons = [];
  @observable closeAlarmLoading = null;
  @observable closeAlarmSlide = false;
  // messages
  @observable messages: Array<{type: string, text: string}> = [];

  @action.bound
  async fetchMainEvents(query: TQuery) {
    this.isFetchingMainEvents = true;
    try {
      const response = await api.get('/operatorApi/events', {...query, query: 'eventMode==EVENT'});
      this.mainEvents = response.data;
      this.mainEventsCount = response.totalCount;
    } catch (error) {
      //  here handle error
      console.error(error);
    }
    this.isFetchingMainEvents = false;
  }

  @action.bound
  async fetchAlarms(query: TQuery) {
    this.isFetchingAlarms = true;
    try {
      const response = await api.get('/operatorApi/events', {...query, query: 'eventMode==ALARM;eventStatus!=CLOSED'});
      this.alarms = response.data;
      this.alarmsCount = response.totalCount;
    } catch (error) {
      //  here handle error
      console.error(error);
    }
    this.isFetchingAlarms = false;
  }

  @action.bound
  async fetchObjectEvents(id: string, queryString?: string) {
    this.isFetchingObjectEvents = true;
    try {
      const response = await api.get('/operatorApi/events', {query: `observationId==${id}${queryString || ''}`});
      this.objectEvents = response.data;
    } catch (error) {
      //  here handle error
      console.error(error);
    }
    this.isFetchingObjectEvents = false;
  }

  @action.bound setAlarmsInfoTable(obj: TTable) {
    this.alarmsTableInfo = {...this.alarmsTableInfo, ...obj};
  }

  @action.bound setMainEventsInfoTable(obj: TTable) {
    this.mainEventsTableInfo = {...this.mainEventsTableInfo, ...obj};
  }

  @action.bound toggleTab(tab: string, value: string) {
    this.activeTabs[tab] = value;
  }

  @action.bound
  async getAlarmToWork(alarm: TAlarm) {
    this.getToWorkLoading = alarm.uuid;

    const body = {
      eventId: alarm.uuid
    };

    try {
      await api.post('/alarmProcesses', body)
        .then((response: Response) => {
          if (response) {
            return api.put(`/events/${alarm.uuid}`, {
              ...alarm,
              controlDeviceTime: new Date(),
              eventStatus: eventStatusNames.processing,
              alarmProcessId: response.uuid
            })
          }
        })
        .then((response: Response) => {
          if (response) {
            this.alarms = this.alarms.map((item: {uuid: string}) => {
              if (item.uuid === alarm.uuid) {
                return {...item, eventStatus: eventStatusNames.processing}
              }
              return item;
            });
          }
          this.getToWorkLoading = null;
        });
    } catch (error) {
      console.error(error)
    }
  }

  @action.bound
  async closeAlarm(reason: {value: string, label: string}, alarm: TAlarm) {
    const alarms = this.alarms;
    const {alarmProcessId, uuid} = alarm;
    this.closeAlarmLoading = alarm.uuid;

    try {
      await api.put(`/events/${uuid}`, {
        ...alarm,
        eventStatus: eventStatusNames.closed,
        controlDeviceTime: new Date(),
        alarmProcessId
      })
        .then((alarm: Response) => {
          if (alarm.alarmProcessId) {
            return api.get(`/alarmProcesses/${alarm.alarmProcessId}`);
          }
        })
        .then((response: Response) => {
          const alarmProcess = response.data;
          if (alarmProcess) {
            this.closeAlarmSlide = true;
            return api.put(`/alarmProcesses/${alarmProcess.uuid}`, {
              ...alarmProcess,
              closureReasonId: reason.value,
              closureDescription: reason.label,
              closeDate: new Date()
            })
          }
        })
        .then(() => {
          this.alarms = alarms.filter((item: {uuid: string}) => item.uuid !== uuid);
          this.closeAlarmLoading = null;
          this.closeAlarmSlide = false;
        });
    } catch (error) {
      console.error(error)
    }
  }

  @action.bound
  async getReasonsList() {
    try {
      const response = await api.get('/closureReasons');
      this.closureReasons = response ? response.data.map((item: {uuid: string, name: string}) => ({value: item.uuid, label: item.name})) : [];
    } catch (error) {
      console.error(error);
      this.closureReasons = [];
    }
  }

  @action.bound addAlarms(data: TAlarm) {
    const newArray = this.alarms.slice(0, this.alarms.length - 1);
    this.alarms = [data, ...newArray];
    playNotifySound();
  }
  @action.bound updateAlarms(data: TAlarm) {
    const newArray = this.alarms;
    remove(newArray, (item: TAlarm) => item.uuid === data.uuid);
    this.alarms = [data, ...newArray];
  }

  @action.bound resetMessages() {
    this.messages = [];
  }
}