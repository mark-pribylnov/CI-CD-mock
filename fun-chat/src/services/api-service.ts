import Emitter from '../base/components/emitter';
import { EVENTS } from '../base/events';
import {
  LoginData,
  isExternalLoginResponse,
  isExternalLogoutResponse,
  isGetActiveUsersResponse,
  isGetInactiveUsersResponse,
  isLoginResponse,
  isLogoutResponse,
} from '../types/request-response/auth';
import { RESPONSE_TYPE_NAMES, ResponseTypeName } from '../types/request-response/base';
import { isErrorResponse } from '../types/request-response/response-error';

export default class ApiService extends Emitter {
  private readonly url = 'ws://localhost:4000';

  private ws!: WebSocket;

  private currentId = 0;

  private isReconnecting = false;

  constructor() {
    super();

    this.connect();
  }

  private connect(): void {
    if (this.ws) {
      this.ws.removeEventListener('message', this.onMessage);
      this.ws.removeEventListener('close', this.onClose);
      this.ws.removeEventListener('open', this.onOpen);

      if (this.ws.readyState !== WebSocket.CLOSED) this.ws.close();
    }

    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('message', this.onMessage);
    this.ws.addEventListener('close', this.onClose);
    this.ws.addEventListener('open', this.onOpen);

    if (this.ws.readyState === WebSocket.CLOSED) this.emitEvent(EVENTS.connectionLost);
  }

  public loginUser = (data: LoginData) => {
    this.sendMessage(RESPONSE_TYPE_NAMES.login, {
      user: data,
    });
  };

  public logoutUser = (data: LoginData) => {
    this.sendMessage(RESPONSE_TYPE_NAMES.logout, {
      user: data,
    });
  };

  private onOpen = () => {
    this.isReconnecting = false;
    this.emitEvent(EVENTS.connectionReady);
  };

  private onMessage = (event: MessageEvent): void => {
    if (!('data' in event && typeof event.data === 'string'))
      throw new Error(`event.data is not type of 'string'`);

    const data: unknown = JSON.parse(event.data);
    if (isErrorResponse(data)) {
      this.emitEvent(EVENTS.serverError, data.payload.error);
    } else if (isLoginResponse(data) && data.payload.user.isLogined) {
      this.emitEvent(EVENTS.auth.loginApproved, data.payload.user.login);
    } else if (isLogoutResponse(data) && !data.payload.user.isLogined) {
      this.emitEvent(EVENTS.auth.logoutApproved, data.payload.user.isLogined);
    } else if (isExternalLoginResponse(data)) {
      this.emitEvent(EVENTS.auth.externalLogin, data.payload.user.login);
    } else if (isExternalLogoutResponse(data)) {
      this.emitEvent(EVENTS.auth.externalLogout, data.payload.user.login);
    } else if (isGetActiveUsersResponse(data)) {
      this.emitEvent(EVENTS.auth.activeUsersRecieved, data.payload.users);
    } else if (isGetInactiveUsersResponse(data)) {
      this.emitEvent(EVENTS.auth.inactiveUsersRecieved, data.payload.users);
    } else {
      throw new Error('THIS CASE IS NOT HANDLED! FIX IT!');
    }
  };

  private onClose = (): void => {
    this.emitEvent(EVENTS.connectionLost);

    if (!this.isReconnecting) {
      this.isReconnecting = true;
      setTimeout(() => {
        this.isReconnecting = false;
        this.connect();
      }, 2000);
    }
  };

  private sendMessage(type: ResponseTypeName, payload: unknown): void {
    const message = {
      id: `${this.currentId}`,
      type,
      payload,
    };
    this.currentId += 1;

    if (this.ws.readyState === WebSocket.CONNECTING) {
      const ac = new AbortController();

      this.ws.addEventListener(
        'open',
        () => {
          this.ws.send(JSON.stringify(message));
          ac.abort();
        },
        { once: true, signal: ac.signal }
      );

      this.ws.addEventListener('close', () => ac.abort(), { once: true, signal: ac.signal });

      return;
    } else if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.emitEvent(EVENTS.serverError, 'Server unavailable.');
    }
  }

  public requestUsers(): void {
    this.sendMessage(RESPONSE_TYPE_NAMES.getActiveUsers, null);
    this.sendMessage(RESPONSE_TYPE_NAMES.getInactiveUsers, null);
  }
}
