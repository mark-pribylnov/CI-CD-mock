import { EVENTS, isPageNavigationKey } from '../events';
import { PageName } from '../../types/others';
import {
  addListenerToCustomEvent,
  addListenerToDOMEvent,
  CustomListenerOptions,
  DOMListenerOptions,
} from '../utils';

export interface BaseUI {
  errorMessage: HTMLSpanElement;
}

export default abstract class BaseComponentView<U extends BaseUI> extends HTMLElement {
  protected readonly listenerCleaners: Array<() => void> = [];

  public UI = {} as U;

  constructor(html: string, styles: string) {
    super();
    this.innerHTML = html;

    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    this.append(styleTag);
  }

  protected getElement<T extends HTMLElement>(selector: string, type: new () => T): T {
    const element = this.querySelector(selector);

    if (!element) throw new Error(`Element with selector "${selector}" not found`);

    if (!(element instanceof type))
      throw new TypeError(`Element found, but it's not the expected type.`);

    return element;
  }

  protected emitEvent(eventName: string, attachedData?: unknown): void {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: attachedData,
    });

    this.dispatchEvent(event);
  }

  protected listenGoToPage(pageName: PageName, button: HTMLButtonElement): void {
    button.addEventListener('click', () => {
      const capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      const key = `to${capitalized}`;

      if (!isPageNavigationKey(key)) throw new Error('Wrong key for accessing event name');

      this.emitEvent(EVENTS.pageNavigation[key]);
    });
  }

  protected addListenerToCustomEvent<T>(
    options: Omit<CustomListenerOptions<T>, 'cleanupFunctions'>
  ): void {
    addListenerToCustomEvent({
      ...options,
      isCleanable: options.isCleanable ?? true,
      cleanupFunctions: this.listenerCleaners,
    });
  }

  protected addListenerToDOMEvent(options: Omit<DOMListenerOptions, 'cleanupFunctions'>): void {
    addListenerToDOMEvent({
      ...options,
      isCleanable: options.isCleanable ?? true,
      cleanupFunctions: this.listenerCleaners,
    });
  }

  private cleanEventListeners(): void {
    while (this.listenerCleaners.length > 0) {
      const fnc = this.listenerCleaners.pop();
      if (fnc) fnc();
    }
  }

  public destroy(): void {
    this.cleanEventListeners();
    this.remove();
  }

  public toggleErrorMessage = (action: 'show' | 'hide', message?: string): void => {
    if (action === 'show') {
      if (!message) throw new Error('Error message is missing');
      this.UI.errorMessage.textContent = message;
    } else {
      this.UI.errorMessage.textContent = '';
    }
  };
}
