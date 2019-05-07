// @flow
import Events from './eventStore';
import ObjectStore from './objectStore';
import SystemStore from './systemStore';
import {getToken} from '../utils/api';

export default class Store {
  constructor() {
    this.Events = new Events();
    this.Object = new ObjectStore();
    this.System = new SystemStore();

    this.connectToSocket();
  }

  connectToSocket() {
    const url = `${window.env.PCO_WS_ROOT}?token=${getToken()}`;
    const socket = new WebSocket(url);
    socket.onopen = function() {
      console.info("Соединение установлено.");
    };

    socket.onmessage = (event: {data: string}) => {
      if (event && event.data) {
        const data = JSON.parse(event.data);
        this.Events.addAlarms(data);
      }
    };

    socket.onerror = () => {
      console.error("Ошибка соединения к веб-сокету.");
      setTimeout(() => this.connectToSocket(), 1000);
    };

    socket.onclose = () => {
      // Try to reconnect in 1 seconds
      setTimeout(() => this.connectToSocket(), 1000);
    };
  }
}
