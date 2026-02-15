import Emitter from '../../base/components/emitter';
import { PageController } from '../../types/others';
import AboutPageView from './about-page.view';

export default class AboutPageController extends Emitter implements PageController {
  public readonly view: AboutPageView;

  constructor() {
    super();

    this.view = new AboutPageView();
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
