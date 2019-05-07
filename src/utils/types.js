// @flow
import TEvents from '../store/eventStore';
import TObject from '../store/objectStore';
import TSystem from '../store/systemStore';

export type TAlarm = {uuid: string, serverRegTime: number, text: string, panelNumber: string, object: string, operator: ?string, length: number, alarmProcess: {startProcess: string}};
export type TTable = {page: number, pageSize: number, sorted?: Array<{}>, orderBy?: string};
export type TQuery = {limit?: number, offset?: number, orderBy?: string};

export type THistory = {
  goBack: () => mixed,
  push: (link: string) => mixed
};

export type TRoute = {
  store: {
    Events: TEvents,
    Object: TObject,
    System: TSystem
  },
  history: THistory,
  match: {
    params: {
      id: string
    }
  },
  location: {}
};
