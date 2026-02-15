import MainPageView from './main-page.view';

import Emitter from '../../base/components/emitter';
import { PageController } from '../../types/others';

export default class MainPageController extends Emitter implements PageController {
  public readonly view: MainPageView;

  constructor(userName: string) {
    super();

    this.view = new MainPageView(userName);
  }

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
