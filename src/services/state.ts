import Emitter from '../base/components/emitter';
import { isLoginStatus, LoginData, LoginStatus } from '../types/request-response/auth';

export default class State extends Emitter {
  public login: undefined | string = undefined;

  public password: undefined | string = undefined;

  public activeUsers: Array<LoginStatus> = [];

  public inactiveUsers: Array<LoginStatus> = [];

  public saveLoginData(
    { login, password }: LoginData,
    andLocalStorage?: 'and to localStorage'
  ): void {
    this.login = login;
    this.password = password;

    if (andLocalStorage === 'and to localStorage') {
      localStorage.setItem('login', login);
      localStorage.setItem('password', password);
    }
  }

  public clearLoginData(): void {
    this.login = undefined;
    this.password = undefined;

    localStorage.removeItem('login');
    localStorage.removeItem('password');
  }

  get loginData() {
    return { login: this.login, password: this.password };
  }

  public changeStatusListForUser(login: string, addTo: 'active' | 'inactive'): void {
    let initialList;
    let targetList;
    if (addTo === 'active') {
      initialList = this.inactiveUsers;
      targetList = this.activeUsers;
    } else {
      initialList = this.activeUsers;
      targetList = this.inactiveUsers;
    }

    const deleteIndex = initialList.findIndex((user) => user.login === login);

    if (deleteIndex === -1) initialList.push({ login: login, isLogined: false });

    const targetUser = initialList.splice(deleteIndex, 1)[0];

    if (!isLoginStatus(targetUser)) throw new Error('targetUser not found or has wrong type');

    targetUser.isLogined = addTo === 'active' ? true : false;
    targetList.push(targetUser);
  }
}
