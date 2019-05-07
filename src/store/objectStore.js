// @flow
import {observable, action} from 'mobx';
import get from 'lodash/get';

import Api from '../utils/api';
import type {TTable, TQuery} from '../utils/types';
import {eventStatusNames} from '../utils/enums';

type TObserved = {
  uuid: string,
  observeUntil: number,
  panelNumber: string,
  name: string,
  operator: string,
  techPco: string,
  user: string
};

type TZones = {
  id: number,
  number: number,
  groups: Array<{}>
};

type TTeam = {
  id: string,
  name: string,
  phone: string,
  monitoringcode: string
};

type TResults = {
  panelNumber: string,
  uuid: string,
  name: string
};

type TObjectinfo = {
  address: {city: ?string, street: ?string, house: ?string, apartment: ?string, note: ?string},
  branchId: string,
  connections: Array<{
    panelNumber: string,
    uuid: string,
    zoneConnections: Array<{name: string, number: number, controlDeviceId: string, uuid: string, zoneConnectionId: string}>
  }>,
  contactPersons: [],
  contract: {name: string, activeFrom: string, activeTo: string, observationStatus: string, observationId: string},
  description: string,
  name: string,
  observationGroupId: string,
  observationType: {name: string, uuid: string},
  observationUooCode: string,
  responseSvc: {name: string, responsibleUser: string, uuid: string},
  serviceSvc: {name: string, uuid: string},
  uuid: string
};

export type TObject = {
  observations: Array<TObserved>,
  observationsCount: number,
  observationsTableInfo: TTable,
  fetchObservations: () => mixed,
  fetchActiveObject: (id: string) => mixed,
  responseTeams: Array<TTeam>,
  responseTeam: TTeam,
  fetchResponseTeams: () => mixed,
  alarmsZones: Array<TZones>,
  setCurrentZone: (id: number) => mixed,
  setActiveTeam: (team: TTeam) => mixed,
  setActiveZoneId: (uuid: string) => mixed,
  clearActiveObject: () => mixed,
  setEventStatus: () => mixed,
  activeGroupNumber: boolean,
  activeZoneId: boolean,
  onSearch: (value: string) => mixed,
  searchResultList: Array<TResults>,
  searchLoading: boolean,
  isFetchingActiveObject: boolean,
  activeObject: TObjectinfo,
  alarmZones: string,
  currentZone: string,
  currentEventStatus: string,
  alarmZones: Array<{panelNumber: string, uuid: string}>,
  currentZone: {
    uuid: string,
    zoneConnections: Array<{name: string, uuid: string, number: string}>
  },
  observeObject: (params: {}) => mixed,
  getEmployees: () => mixed,
  employess: Array<{uuid: string, fullname: string}>,
  isFetchingEmployees: boolean
};

const api = new Api();

export default class Store {
  @observable error = null;
  @observable isFetchingObservations = true;
  @observable observations = [];
  @observable observationsCount = 0;
  @observable observationsTableInfo = {
    page: 0,
    pageSize: 20,
    sorted: [],
    orderBy: '',
  };
  @observable isFetchingActiveObject = true;
  @observable activeObject = {data: {
    contactPersons: []}
  };
  @observable alarmsZones = [];
  @observable activeZoneId = null;
  @observable activeGroupNumber = null;
  @observable responseTeams = [];
  @observable responseTeam = [];
  @observable searchResultList = [];
  @observable searchLoading = false;
  @observable alarmZones = [];
  @observable currentZone = {};
  @observable currentEventStatus = '';
  // employess
  @observable employess = [];
  @observable isFetchingEmployees = false;
  // end employess

  @action.bound
  async fetchObservations(query: TQuery) {
    this.isFetchingObservations = true;
    try {
      const response = await api.get('/operatorApi/supervisions', {...query, query: 'supervisionStatus!=CLOSED'});
      this.observations = response.data;
      this.observationsCount = response.totalCount;
    } catch (error) {
      //  here handle error
      console.error(error);
    }
    this.isFetchingObservations = false;
  }

  @action.bound async observeObject(id: string, params: {}, objectId: string) {
    this.isFetchingActiveObject = true;
    try {
      await api.put(`/supervisions/${id}`, params);
    } catch (error) {
      //  here handle error
      console.error(error);
    }
    this.fetchActiveObject(objectId);
    this.isFetchingActiveObject = false;
  }

  @action.bound
  async fetchActiveObject(id: string) {
    this.isFetchingActiveObject = true;
    try {
      const response = await api.get(`/operatorApi/objects/${id}`, {})
        .then((object: {data: {connections: Array<{uuid: string}>}}) => {
          this.setCurrentZone(object.data.connections[0].uuid);
          return object;
        });
      this.activeObject = this.mapObject(response.data);
    } catch (error) {
      //  here handle error
      console.error(error);
    }
    this.isFetchingActiveObject = false;
  }

  mapObject = (object: Array<TObject>) => {
    this.alarmZones = get(object, 'connections', []);
    this.currentZone = this.alarmZones.find(({uuid}: {uuid: number}) => uuid === this.activeZoneId);
    let currentEventStatus = null;

    get(this.currentZone, 'zones').map((zone: {}) => {
      if (zone.lastNewEvent) {
        return currentEventStatus = eventStatusNames.new;
      } else if (zone.lastProcessingEvent) {
        return currentEventStatus = eventStatusNames.processing;
      }
      return null;
    });

    this.currentEventStatus = currentEventStatus;

    return object;
  };

  @action.bound
  clearActiveObject() {
    this.activeObject = {};
  }

  // смена статуса ивента в карточке объекта (для смены кнопки "Взятие в работу" на "Закрытие тревоги")
  @action.bound
  setEventStatus(currentEventStatus: string) {
    this.currentEventStatus = currentEventStatus;
  }

  @action.bound
  async fetchResponseTeams() {
    try {
      this.responseTeams = await api.get(`/responseTeams`, {});
    } catch (error) {
      console.error(error);
      this.responseTeams = [];
    }
  }

  @action.bound
  setActiveTeam(team: TTeam) {
    this.responseTeam = team;
  }

  @action.bound setCurrentZone(id: string) {
    this.activeZoneId = id;
  }

  @action.bound setObservationsInfoTable(obj: TTable) {
    this.observationsTableInfo = {...this.observationsTableInfo, ...obj};
  }

  @action.bound
  async onSearch(value: string) {
    if (!value) {
      return this.searchResultList = [];
    }
    try {
      this.searchLoading = true;
      const response = await api.get('/connections', {query: `panelNumber==*${value}*`, limit: 20});
      this.searchLoading = false;
      this.searchResultList = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  @action.bound async getEmployees() {
    this.isFetchingEmployees = true;
    try {
      const response = await api.get(`/employees`, {query: `fullname==tech*`});
      this.employess = response.data;
    } catch (error) {
      console.error(error);
    }
    this.isFetchingEmployees = false;
  }
}
