import {
  addListenerToCustomEvent,
  addListenerToDOMEvent,
  CustomListenerOptions,
  DOMListenerOptions,
} from '../utils';

export default class Emitter extends EventTarget {
  protected readonly listenerCleaners: Array<() => void> = [];

  protected emitEvent(eventName: string, attachedData?: unknown): void {
    const event = new CustomEvent(eventName, {
      detail: attachedData,
    });

    this.dispatchEvent(event);
  }

  protected addListenerToCustomEvent<T>(
    options: Omit<CustomListenerOptions<T>, 'cleanupFunctions'>
  ): void {
    const validator = options.detailValidator ?? ((detail): detail is undefined => true);

    addListenerToCustomEvent({
      ...options,
      detailValidator: validator,
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

  public cleanEventListeners(): void {
    while (this.listenerCleaners.length > 0) {
      const fnc = this.listenerCleaners.pop();
      if (fnc) fnc();
    }
  }
}
