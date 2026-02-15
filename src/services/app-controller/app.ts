import ApiService from '../api-service';
import Emitter from '../../base/components/emitter';
import { isDetailUndefined } from '../../base/utils';
import { EVENTS } from '../../base/events';
import { ROUTES } from '../../base/routes';
import State from '../state';
import { isLoginData, isUserListArray, LoginStatus } from '../../types/request-response/auth';
import AuthController from './auth';
import NavigationController from './navigation';

export default class AppController extends Emitter {
  private api: ApiService;

  private state: State;

  private auth: AuthController;

  private navigation: NavigationController;

  constructor(rootElement: HTMLElement) {
    super();

    this.api = new ApiService();
    this.state = new State();

    this.navigation = new NavigationController(rootElement, this.state, this.api);
    this.auth = new AuthController(this.api, this.state);

    this.initListeners();
  }

  public startApp(): void {
    const login = localStorage.getItem('login');
    const password = localStorage.getItem('password');
    if (login && password) this.state.saveLoginData({ login, password });

    window.addEventListener('popstate', () =>
      this.navigation.navigate(window.location.pathname, false)
    );

    this.navigation.navigate(window.location.pathname, false);
  }

  private toggleErrorMessage = (action: 'show' | 'hide', message?: string): void => {
    if (!this.navigation.currentPage?.toggleErrorMessage)
      throw new Error(`'this.currentPage' doesn't have 'toggleErrorMessage()' or doesn't exist`);

    if (action === 'show' && !message) throw new Error('Error message is missing');

    this.navigation.currentPage.toggleErrorMessage(action, message);
  };

  private handleConnectionLost = (): void => {
    this.toggleErrorMessage('show', 'Connection lost. Trying to reconnect...');
  };

  private handleConnectionReady = (): void => {
    this.toggleErrorMessage('hide');

    const loginData = this.state.loginData;
    if (isLoginData(loginData)) this.api.loginUser(loginData);
  };

  private handleLoginApproved = (): void => {
    const path = window.location.pathname;

    if (path === ROUTES.login || path === '/') {
      this.navigation.navigate(ROUTES.main);
    } else {
      this.navigation.navigate(path, false);
    }
  };

  private handleUsersRecieved = (users: Array<LoginStatus>): void => {
    const isUsersActive = users[0].isLogined;

    if (isUsersActive) {
      const withoutMe = users.filter((user) => user.login !== this.state.login);
      this.state.activeUsers = [...withoutMe];
      this.navigation.insertUsers(this.state.activeUsers, 'active');
    } else {
      this.state.inactiveUsers = [...users];
      this.navigation.insertUsers(this.state.inactiveUsers, 'inactive');
    }
  };

  private handleExternalAuth = (login: string, authAction: 'login' | 'logout'): void => {
    if (authAction === 'login') {
      this.state.changeStatusListForUser(login, 'active');
      this.navigation.insertUsers(this.state.activeUsers, 'active');
    } else {
      this.state.changeStatusListForUser(login, 'inactive');
      this.navigation.insertUsers(this.state.inactiveUsers, 'inactive');
    }
  };

  private initListeners(): void {
    this.initNetworkListeners();
    this.initAuthListeners();
    this.initUserManagementListeners();
    this.initNavigationListeners();
  }

  private initNetworkListeners() {
    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.connectionLost,
      handler: this.handleConnectionLost,
      detailValidator: isDetailUndefined,
      isCleanable: false,
    });
    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.connectionReady,
      handler: this.handleConnectionReady,
      detailValidator: isDetailUndefined,
      isCleanable: false,
    });

    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.serverError,
      handler: (error: string) => this.toggleErrorMessage('show', error),
      detailValidator: (error): error is string => typeof error === 'string',
      isCleanable: false,
    });
  }

  private initAuthListeners() {
    this.addListenerToCustomEvent({
      element: this.auth,
      eventName: EVENTS.INTERNAL.logoutApproved,
      handler: () => this.navigation.navigate(ROUTES.login),
      detailValidator: isDetailUndefined,
      isCleanable: false,
    });
    this.addListenerToCustomEvent({
      element: this.auth,
      eventName: EVENTS.INTERNAL.loginApproved,
      handler: this.handleLoginApproved,
      detailValidator: isDetailUndefined,
      isCleanable: false,
    });
  }
  private initNavigationListeners() {
    this.addListenerToCustomEvent({
      element: this.navigation,
      eventName: EVENTS.INTERNAL.loginRequested,
      handler: (loginData) => this.auth.handleLoginRequested(loginData),
      detailValidator: isLoginData,
      isCleanable: false,
    });

    this.addListenerToCustomEvent({
      element: this.navigation,
      eventName: EVENTS.INTERNAL.logoutRequested,
      handler: () => this.auth.handleLogoutRequested(),
      detailValidator: isDetailUndefined,
      isCleanable: false,
    });
  }

  private initUserManagementListeners() {
    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.auth.externalLogin,
      handler: (login: string) => {
        this.handleExternalAuth(login, 'login');
      },
      detailValidator: (login) => typeof login === 'string',
      isCleanable: false,
    });
    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.auth.externalLogout,
      handler: (login: string) => {
        this.handleExternalAuth(login, 'logout');
      },
      detailValidator: (login) => typeof login === 'string',
      isCleanable: false,
    });
    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.auth.activeUsersRecieved,
      handler: this.handleUsersRecieved,
      detailValidator: isUserListArray,
      isCleanable: false,
    });
    this.addListenerToCustomEvent({
      element: this.api,
      eventName: EVENTS.auth.inactiveUsersRecieved,
      handler: this.handleUsersRecieved,
      detailValidator: isUserListArray,
      isCleanable: false,
    });
  }
}
