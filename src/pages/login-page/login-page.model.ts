import { ValidationMessages, ValidationResult } from '../../types/others';

const VALIDATION_MESSAGES: ValidationMessages = {
  tooShort: (minLength: number) => `Minimum ${minLength} characters.`,
  notCapitalized: 'First character must be capital.',
  restrictedCharacters: "Only English letters and hyphen ('-').",
} as const;

export const LoginPageModel = {
  validateInput(text: string, minLength: number): ValidationResult {
    const validationMessages = [];

    const isLongEnough = text.length >= minLength;
    if (!isLongEnough) validationMessages.push(VALIDATION_MESSAGES.tooShort(minLength));

    const startsWithCapital = /^[A-Z]/.test(text);
    if (!startsWithCapital) validationMessages.push(VALIDATION_MESSAGES.notCapitalized);

    const onlyEnglishAndHyphens = /^[A-Za-z-]+$/.test(text);
    if (!onlyEnglishAndHyphens) validationMessages.push(VALIDATION_MESSAGES.restrictedCharacters);

    if (validationMessages.length > 0) return { isValid: false, messages: validationMessages };
    return { isValid: true };
  },
};
