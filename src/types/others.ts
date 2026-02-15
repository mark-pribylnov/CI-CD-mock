export type PageName = 'main' | 'about' | 'login';

export type ValidationResult = { isValid: true } | { isValid: false; messages: string[] };

export interface PageController {
  view: HTMLElement;
  toggleErrorMessage: (action: 'show' | 'hide', message?: string) => void;
  destroy: () => void;
}

export interface ValidationMessages {
  tooShort: (minLength: number) => string;
  notCapitalized: string;
  restrictedCharacters: string;
}

export interface InputChangeDetail {
  focused: HTMLInputElement;
  notFocused: HTMLInputElement;
}
export function isInputChangeDetail(detail: unknown): detail is InputChangeDetail {
  if (typeof detail !== 'object' || detail === null) return false;

  return (
    'focused' in detail &&
    detail.focused instanceof HTMLInputElement &&
    'notFocused' in detail &&
    detail.notFocused instanceof HTMLInputElement
  );
}
