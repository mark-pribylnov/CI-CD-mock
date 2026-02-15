import Emitter from '../../base/components/emitter';
import { EVENTS } from '../../base/events';

import { isLoginData, LoginStatus } from '../../types/request-response/auth';
import LoginPage from '../../pages/login-page/login-page.controller';
import MainPage from '../../pages/main-page/main-page.controller';
import AboutPage from '../../pages/about-page/about-page.controller';
import { PageController } from '../../types/others';
import State from '../state';
import { ROUTES } from '../../base/routes';
import ApiService from '../api-service';
import MainPageController from '../../pages/main-page/main-page.controller';
import { isDetailUndefined } from '../../base/utils';

export default class NavigationController extends Emitter {
  private root: HTMLElement;

  private state: State;

  private api: ApiService;

  public currentPage: PageController | undefined = undefined;

  constructor(rootElement: HTMLElement, state: State, api: ApiService) {
    super();

    this.root = rootElement;
    this.state = state;
    this.api = api;
  }

  public showLoginPage = (): void => {
    document.title = 'Fun-chat | login';

    this.renderPage(() => {
      const currentPage = new LoginPage();

      this.addListenerToCustomEvent({
        element: currentPage.view,
        eventName: EVENTS.auth.loginRequested,
        handler: (loginData) => this.emitEvent(EVENTS.INTERNAL.loginRequested, loginData),
        detailValidator: isLoginData,
      });

      return currentPage;
    });
  };

  public showMainPage = (userName: string): void => {
    document.title = 'Fun-chat | main';

    this.renderPage(() => {
      const currentPage = new MainPage(userName);

      this.addListenerToCustomEvent({
        element: currentPage.view,
        eventName: EVENTS.auth.logoutRequested,
        detailValidator: isDetailUndefined,
        handler: () => this.emitEvent(EVENTS.INTERNAL.logoutRequested),
      });

      return currentPage;
    });

    this.api.requestUsers();
  };

  private showAboutPage = (): void => {
    document.title = 'Fun-chat | about';

    this.renderPage(() => {
      const currentPage = new AboutPage();

      this.addListenerToCustomEvent({
        element: currentPage.view,
        eventName: EVENTS.pageNavigation.goBack,
        detailValidator: isDetailUndefined,
        handler: () => history.back(),
      });

      return currentPage;
    });
  };

  public navigate = (path: string, pushState: boolean = true): void => {
    const { login, password } = this.state.loginData;
    const isLogined = !!login && !!password;

    const targetPath = this.resolveTargetPath(path, isLogined);
    this.updateBrowserHistory(targetPath, pushState);
    this.showPagePathBased(targetPath, login);
  };

  private resolveTargetPath(path: string, isLogined: boolean): string {
    if (path === '/') {
      return isLogined ? ROUTES.main : ROUTES.login;
    }

    if (path === ROUTES.about) {
      return ROUTES.about;
    }

    if (!isLogined && path === ROUTES.main) {
      return ROUTES.login;
    }

    if (isLogined && path === ROUTES.login) {
      return ROUTES.main;
    }

    return path;
  }

  private updateBrowserHistory(targetPath: string, pushState: boolean): void {
    const currentPath = window.location.pathname;

    if (this.isAuthRedirect(targetPath, currentPath)) {
      window.history.replaceState(undefined, '', targetPath);
      return;
    }

    if (pushState && currentPath !== targetPath) {
      window.history.pushState(undefined, '', targetPath);
    }
  }

  private isAuthRedirect(targetPath: string, originalPath: string): boolean {
    const { login, password } = this.state.loginData;
    const isLogined = !!login && !!password;

    return (
      (!isLogined && originalPath === ROUTES.main) || (isLogined && originalPath === ROUTES.login)
    );
  }

  private showPagePathBased(targetPath: string, login: string | undefined): void {
    if (targetPath === ROUTES.main && login) {
      this.showMainPage(login);
    } else if (targetPath === ROUTES.about) {
      this.showAboutPage();
    } else {
      this.showLoginPage();
      window.history.replaceState(undefined, '', ROUTES.login);
    }
  }

  private renderPage(createPage: () => LoginPage | MainPage | AboutPage): void {
    this.currentPage?.destroy();
    this.cleanEventListeners();

    this.currentPage = createPage();

    this.addListenerToCustomEvent({
      element: this.currentPage.view,
      eventName: EVENTS.pageNavigation.toAbout,
      detailValidator: isDetailUndefined,
      handler: () => this.navigate(ROUTES.about),
    });

    this.root.append(this.currentPage.view);
  }

  public insertUsers(users: Array<LoginStatus>, status: 'active' | 'inactive'): void {
    if (!(this.currentPage instanceof MainPageController))
      throw new Error(`this.currentPage is NOT Main page`);

    this.currentPage.view.insertUsers(users, status);
  }
}
