import BaseComponent, { BaseUI } from '../../base/components/base-component.view';
import { EVENTS } from '../../base/events';
import { LoginStatus } from '../../types/request-response/auth';

import html from './main-page.component.html';
import styles from './main-page.component.scss';

interface MainPageUI extends BaseUI {
  userName: HTMLSpanElement;
  logoutButton: HTMLButtonElement;
  aboutPageButton: HTMLButtonElement;
  signleUserTemplate: HTMLLIElement;
  listOfActiveUsers: HTMLUListElement;
  listOfInactiveUsers: HTMLUListElement;
}

export default class MainPageView extends BaseComponent<MainPageUI> {
  static readonly customTag = 'main-page';

  public readonly cleanupFunctions: Array<() => void> = [];

  constructor(userName: string) {
    super(html, styles);
    this.initUI();

    this.UI.userName.textContent = userName;

    this.addListenerToDOMEvent({
      element: this.UI.logoutButton,
      eventName: 'click',
      handler: this.handleLogout,
    });
    this.addListenerToDOMEvent({
      element: this.UI.aboutPageButton,
      eventName: 'click',
      handler: this.handleGoToAbout,
    });
  }

  private initUI(): void {
    const selectors = {
      userName: '[data-user-name]',
      logoutButton: `[data-logout-button]`,
      aboutPageButton: `[data-about-page-button]`,
      singleUserTemplate: '[data-list-of-users-signle-user]',
      listOfActiveUsers: '[data-list-of-active-users]',
      listOfInactiveUsers: '[data-list-of-inactive-users]',
      errorMessage: `[data-main-page-error]`,
    };

    const singleUserTemplate = this.getElement(selectors.singleUserTemplate, HTMLLIElement);
    const templateClone = singleUserTemplate.cloneNode();
    singleUserTemplate.remove();

    if (!(templateClone instanceof HTMLLIElement))
      throw new Error(`singleUserTemplate is not <li> element`);

    this.UI = {
      userName: this.getElement(selectors.userName, HTMLSpanElement),
      logoutButton: this.getElement(selectors.logoutButton, HTMLButtonElement),
      aboutPageButton: this.getElement(selectors.aboutPageButton, HTMLButtonElement),
      signleUserTemplate: templateClone,
      listOfActiveUsers: this.getElement(selectors.listOfActiveUsers, HTMLUListElement),
      listOfInactiveUsers: this.getElement(selectors.listOfInactiveUsers, HTMLUListElement),
      errorMessage: this.getElement(selectors.errorMessage, HTMLSpanElement),
    };
  }

  private handleLogout = (): void => {
    this.emitEvent(EVENTS.auth.logoutRequested);
  };

  private handleGoToAbout = (): void => this.emitEvent(EVENTS.pageNavigation.toAbout);

  public showErrorMessage = (text: string): void => {
    this.UI.errorMessage.textContent = text;
  };

  public insertUsers(users: Array<LoginStatus>, status: 'active' | 'inactive'): void {
    let initialList;
    let targetList;
    if (status === 'active') {
      initialList = this.UI.listOfInactiveUsers;
      targetList = this.UI.listOfActiveUsers;
    } else {
      initialList = this.UI.listOfActiveUsers;
      targetList = this.UI.listOfInactiveUsers;
    }

    targetList.innerHTML = '';

    for (const user of users) {
      const oldEntry = [...initialList.children].find(
        (element) => element.textContent === user.login
      );
      oldEntry?.remove();

      const newEntry = this.UI.signleUserTemplate.cloneNode();
      newEntry.textContent = user.login;
      targetList.append(newEntry);
    }
  }
}

customElements.define(MainPageView.customTag, MainPageView);
