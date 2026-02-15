import BaseComponent, { BaseUI } from '../../base/components/base-component.view';

import { EVENTS } from '../../base/events';

import html from './about-page.component.html';
import styles from './about-page.component.scss';

interface AboutPageUI extends BaseUI {
  goBackButton: HTMLButtonElement;
}

export default class AboutPageView extends BaseComponent<AboutPageUI> {
  static readonly customTag = 'about-page';

  constructor() {
    super(html, styles);
    this.initUI();

    this.addListenerToDOMEvent({
      element: this.UI.goBackButton,
      eventName: 'click',
      handler: this.handleGoBack,
    });
  }

  private initUI(): void {
    const SELECTORS = {
      goBackButton: '[data-go-back-button]',
      errorMessage: '[data-about-page-error]',
    };

    this.UI = {
      goBackButton: this.getElement(SELECTORS.goBackButton, HTMLButtonElement),
      errorMessage: this.getElement(SELECTORS.errorMessage, HTMLSpanElement),
    };
  }

  private handleGoBack = (): void => {
    this.emitEvent(EVENTS.pageNavigation.goBack);
  };
}

customElements.define(AboutPageView.customTag, AboutPageView);
