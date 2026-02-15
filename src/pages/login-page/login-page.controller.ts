import LoginPageView from './login-page.view';

import Emitter from '../../base/components/emitter';
import { EVENTS } from '../../base/events';
import { LoginPageModel } from './login-page.model';
import { isInputChangeDetail, InputChangeDetail, PageController } from '../../types/others';

export default class LoginPageController extends Emitter implements PageController {
  public readonly view: LoginPageView;

  constructor() {
    super();

    this.view = new LoginPageView();

    this.addListenerToCustomEvent({
      element: this.view,
      eventName: EVENTS.auth.inputChanged,
      handler: this.handleInputChanged,
      detailValidator: isInputChangeDetail,
    });
  }

  private handleInputChanged = (inputs: InputChangeDetail): void => {
    const { focused, notFocused } = inputs;

    const focusedResults = LoginPageModel.validateInput(focused.value, focused.minLength);
    const notFocusedResults = LoginPageModel.validateInput(notFocused.value, notFocused.minLength);
    const isFormValid = focusedResults.isValid && notFocusedResults.isValid;

    this.view.setValidationState(focused, focusedResults);
    this.view.toggleButton(isFormValid ? 'active' : 'disabled');
  };

  public toggleErrorMessage = (action: 'show' | 'hide', message?: string): void => {
    if (action === 'show') {
      if (!message) throw new Error('Error message is missing');
      this.view.toggleErrorMessage('show', message);
    } else {
      this.view.toggleErrorMessage('hide');
    }
  };

  public destroy() {
    super.cleanEventListeners();
    this.view.destroy();
  }
}
