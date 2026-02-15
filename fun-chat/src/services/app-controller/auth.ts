import ApiService from '../api-service';
import Emitter from '../../base/components/emitter';
import { EVENTS } from '../../base/events';
import State from '../state';
import { LoginData, isLoginData } from '../../types/request-response/auth';

export default class AuthController extends Emitter {
  private api: ApiService;

  private state: State;

  constructor(api: ApiService, state: State) {
    super();

    this.api = api;
    this.state = state;

    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.auth.loginApproved,
      handler: this.handleLoginApproved,
      detailValidator: (userName): userName is string => typeof userName === 'string',
      isCleanable: false,
    });

    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.auth.logoutApproved,
      handler: this.handleLogoutApproved,
      detailValidator: (detail): detail is boolean => typeof detail === 'boolean',
      isCleanable: false,
    });
  }

  public handleLoginRequested = (data: LoginData) => {
    this.state.saveLoginData(data);
    this.api.loginUser(data);
  };

  public handleLoginApproved = (login: string): void => {
    if (login !== this.state.login)
      throw new Error(
        `LOGIC ERROR !!! Fix the bug!
          LOGIN in State '${this.state.login}' DOESN'T MATCH LOGIN FROM SERVER '${login}'. `
      );

    const password = this.state.password;
    if (!password) throw new Error(`FIX THE BUG !!! Password not found`);

    this.state.saveLoginData({ login, password }, 'and to localStorage');
    this.emitEvent(EVENTS.INTERNAL.loginApproved, login);
  };

  public handleLogoutRequested = (): void => {
    const loginData = this.state.loginData;
    if (!isLoginData(loginData)) throw new Error('Login data has wrong type');

    this.api.logoutUser(loginData);
  };

  public handleLogoutApproved = (isLogined: boolean): void => {
    if (isLogined) throw new Error('ERROR NOT HANDLED, FIX THE BUG: user is still logged in');

    this.state.clearLoginData();
    this.emitEvent(EVENTS.INTERNAL.logoutApproved);
  };
}
