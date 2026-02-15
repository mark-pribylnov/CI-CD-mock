import AppController from './services/app-controller/app';
import './base/styles/base-styles.scss';

const appRoot = document.createElement('div');
appRoot.id = 'appRoot';
document.body.append(appRoot);

const app = new AppController(appRoot);

try {
  app.startApp();
} catch {
  throw new Error('App failed to start.');
}
