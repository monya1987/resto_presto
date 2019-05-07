// @flow
import {observable, action} from 'mobx';
import Api from '../utils/api';

export type TUser = {
  firstName: string,
  lastName: string,
  accountsId: string,
  activated: string,
  blocked: string,
  email: string,
  extra: string,
  group: string,
  id: string,
  organization: string,
  patronymic: string,
  roles: string,
  timezone: string
};

export type TApps = {
  clientId: string,
  host: string,
  id: number,
  name: string
};

export type TSystem = {
  currentUser: TUser,
  applicationsList: Array<TApps>,
  fetchCurrentUser: () => mixed,
  fetchApplicationsList: () => mixed,
  logout: () => mixed
};

const api = new Api();

export default class Store {
  @observable currentUser = {
    firstName: '',
    lastName: ''
  };
  @observable applicationsList = [];

  @action.bound
  async fetchCurrentUser() {
    try {
      const response = await api.get(`/auth/currentUser`, {}, window.env.PCO_AUTH_ROOT);
      this.currentUser = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  @action.bound
  async fetchApplicationsList() {
    try {
      const response = await api.get(`/user-api/users/current/applications`, {}, window.env.PCO_ACCOUNTS_ROOT);
      this.applicationsList = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  @action.bound
  logout() {
    localStorage.removeItem('access_token');
    window.location  = [
      `${window.env.PCO_ACCOUNTS_ROOT}/logout?`,
      `redirectUrl=${window.location.protocol}//${window.location.host}`]
      .join('');
  }
}