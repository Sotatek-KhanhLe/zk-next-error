import io from 'socket.io-client';
import { EVENT } from './config';

class BaseSocket {
  readonly baseURL: string;
  private socket: any;

  constructor(baseUrl: string) {
    this.baseURL = baseUrl;
  }

  connect() {
    this.socket = io(this.baseURL, { transports: ['websocket'] });
  }
  reconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connect();
  }
  disconnect() {
    this.socket.disconnect();
  }
  listen<T>(event: any, cb: (e: T) => void) {
    this.socket.on(event, cb);
  }
  removeListener(event: any) {
    this.socket.off(event);
  }

  emitData<T>(event: any, emitData: T) {
    this.socket.emit(event, emitData);
  }

  listenConnected(cb: () => void) {
    this.listen(EVENT.CONNECTED, cb);
  }
  listenDisconnected(cb: () => void) {
    this.listen(EVENT.DISCONNECTED, cb);
  }
  listenConnectionFail<T>(cb: (e: T) => void) {
    this.listen(EVENT.CONNECTION_FAIL, (e: T): void => {
      cb(e);
    });
  }
  listenError<T>(cb: (e: T) => void) {
    this.listen(EVENT.ERROR, (e: T): void => {
      cb(e);
    });
  }

  listenException<T>(cb: (e: T) => void) {
    this.listen(EVENT.EXCEPTION, (e: T): void => {
      cb(e);
    });
  }

  removeConnectedListener() {
    this.removeListener(EVENT.CONNECTED);
  }
  removeDisconnectedListener() {
    this.removeListener(EVENT.DISCONNECTED);
  }

  removeExceptionListener() {
    this.removeListener(EVENT.EXCEPTION);
  }

  removeErrorListener() {
    this.removeListener(EVENT.ERROR);
  }
  removeConnectionFailListener() {
    this.removeListener(EVENT.CONNECTION_FAIL);
  }
}

export default BaseSocket;
