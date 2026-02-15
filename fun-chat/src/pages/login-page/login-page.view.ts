import BaseComponent, { BaseUI } from '../../base/components/base-component.view';

import { EVENTS } from '../../base/events';
import { ValidationResult } from '../../types/others';
import { LoginData } from '../../types/request-response/auth';

import html from './login-page.component.html';
import styles from './login-page.component.scss';

interface LoginPageUI extends BaseUI {
  form: HTMLFormElement;
  firstNameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  aboutPageButton: HTMLButtonElement;
  validationMessageTemplate: HTMLLIElement;
}

export default class LoginPageView extends BaseComponent<LoginPageUI> {
  static readonly customTag = 'login-page';

  private classes = { invalidInput: 'input-group__input--invalid' };

  constructor() {
    super(html, styles);
    this.initUI();

    this.addListenerToDOMEvent({
      element: this.UI.form,
      eventName: 'input',
      handler: this.handleInputChanged,
    });
    this.addListenerToDOMEvent({
      element: this.UI.form,
      eventName: 'submit',
      handler: this.handleLoginSubmit,
    });
    this.addListenerToDOMEvent({
      element: this.UI.aboutPageButton,
      eventName: 'click',
      handler: this.handleGoToAbout,
    });
  }

  private initUI(): void {
    const SELECTORS = {
      form: '[data-login-form]',
      firstNameInput: '[data-first-name-input]',
      passwordInput: '[data-password-input]',
      submitButton: '[data-login-button]',
      aboutPageButton: '[data-about-page-button]',
      validationMessageTemplate: '[data-validation-message-single]',
      errorMessage: '[data-login-form-error]',
    };

    this.UI = {
      form: this.getElement(SELECTORS.form, HTMLFormElement),
      firstNameInput: this.getElement(SELECTORS.firstNameInput, HTMLInputElement),
      passwordInput: this.getElement(SELECTORS.passwordInput, HTMLInputElement),
      submitButton: this.getElement(SELECTORS.submitButton, HTMLButtonElement),
      aboutPageButton: this.getElement(SELECTORS.aboutPageButton, HTMLButtonElement),
      validationMessageTemplate: this.getElement(
        SELECTORS.validationMessageTemplate,
        HTMLLIElement
      ),
      errorMessage: this.getElement(SELECTORS.errorMessage, HTMLSpanElement),
    };
  }

  private handleInputChanged = (event: Event): void => {
    const focused = this.getFocusedInput(event);
    const notFocused = [this.UI.firstNameInput, this.UI.passwordInput].find(
      (input) => document.activeElement !== input
    );

    const detail = { focused, notFocused };

    this.emitEvent(EVENTS.auth.inputChanged, detail);
  };

  private handleLoginSubmit = (event: Event): void => {
    event.preventDefault();

    const detail: LoginData = {
      login: this.UI.firstNameInput.value,
      password: this.UI.passwordInput.value,
    };
    this.emitEvent(EVENTS.auth.loginRequested, detail);
  };

  private handleGoToAbout = (): void => this.emitEvent(EVENTS.pageNavigation.toAbout);

  public setValidationState(focusedInput: HTMLInputElement, result: ValidationResult) {
    if (result.isValid) {
      this.clearValidationMessages(focusedInput);
    } else {
      this.addValidationMessages(focusedInput, result.messages);
    }
  }

  public getFocusedInput(event: Event): HTMLInputElement {
    if (!(event instanceof InputEvent)) throw new Error('InputEvent expected');

    const path = event.composedPath();
    const focusedInput = path[0];

    if (!(focusedInput instanceof HTMLInputElement))
      throw new TypeError('focusedInput is not HTMLInputElement');
    return focusedInput;
  }

  public toggleButton(state: 'active' | 'disabled'): void {
    this.UI.submitButton.disabled = state === 'active' ? false : true;
  }

  public clearValidationMessages(activeInput: HTMLInputElement): void {
    const wrapper = activeInput.closest('[data-input-group]');
    const list = wrapper?.querySelector('[data-validation-messages-list]');

    if (!list) throw new ReferenceError('list not found!');

    list.innerHTML = '';
    list.append(this.UI.validationMessageTemplate.cloneNode());
    activeInput.classList.remove(this.classes.invalidInput);
  }

  public addValidationMessages(input: HTMLInputElement, messagesArray: string[]): void {
    const messages = [...messagesArray];
    const wrapper = input.closest('[data-input-group]');
    const list = wrapper?.querySelector('[data-validation-messages-list]');
    const messageItemsAll = list?.querySelectorAll('[data-validation-message-single]');

    if (!messageItemsAll) throw new ReferenceError('messageItemsAll not found!');
    if (!list) throw new ReferenceError('list not found!');

    list.innerHTML = '';
    input.classList.add(this.classes.invalidInput);

    for (const message of messages) {
      const messageItem = this.UI.validationMessageTemplate.cloneNode();
      messageItem.textContent = message;
      list.append(messageItem);
    }
  }
}

customElements.define(LoginPageView.customTag, LoginPageView);
