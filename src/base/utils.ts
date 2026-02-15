type DetailValidator<T> = (eventDetail: unknown) => eventDetail is T;

export interface CustomListenerOptions<T> {
  element: HTMLElement | EventTarget;
  eventName: string;
  handler: (detail: T) => void | Promise<void>;
  detailValidator: DetailValidator<T>;
  cleanupFunctions?: Array<() => void>;
  isCleanable?: boolean;
}

export const isDetailUndefined = (detail: unknown): detail is undefined => true;

export function addListenerToCustomEvent<T>({
  element,
  eventName,
  handler,
  detailValidator,
  cleanupFunctions,
  isCleanable = false,
}: CustomListenerOptions<T>): void {
  const handlerWrapper = (event: Event): void => {
    if (!(event instanceof CustomEvent))
      throw new TypeError(`Event '${eventName}' is not a CustomEvent`);

    const detail: unknown = event.detail;

    const isValid = detailValidator && detailValidator(detail);
    if (!isValid) throw new Error(`Event '${eventName}': event.detail has invalid type`);

    void handler(detail);
  };

  element.addEventListener(eventName, handlerWrapper);

  if (isCleanable && cleanupFunctions)
    cleanupFunctions.push(() => {
      element.removeEventListener(eventName, handlerWrapper);
    });
}

export interface DOMListenerOptions {
  element: HTMLElement | EventTarget;
  eventName: string;
  handler: (event: Event) => void | Promise<void>;
  cleanupFunctions?: Array<() => void>;
  isCleanable?: boolean;
}

export function addListenerToDOMEvent({
  element,
  eventName,
  handler,
  cleanupFunctions,
  isCleanable = true,
}: DOMListenerOptions): void {
  const handlerWrapper = (event: Event): void => void handler(event);

  element.addEventListener(eventName, handlerWrapper);

  if (isCleanable && cleanupFunctions)
    cleanupFunctions.push(() => element.removeEventListener(eventName, handlerWrapper));
}
