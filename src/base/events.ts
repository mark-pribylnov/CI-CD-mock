export const EVENTS = {
  pageNavigation: {
    toMain: 'nav:to-main-page',
    toLogin: 'nav:to-login-page',
    toAbout: 'nav:to-about-page',
    goBack: 'nav:go-back',
  },
  auth: {
    loginApproved: 'auth:login-ok',
    inputChanged: 'auth:input-changed',
    loginRequested: 'auth:login-requested',
    logoutRequested: 'auth:logout-requested',
    logoutApproved: 'auth:logout-approved',
    activeUsersRecieved: 'auth:active-users-recieved',
    inactiveUsersRecieved: 'auth:inactive-users-recieved',
    externalLogin: 'auth:external-login',
    externalLogout: 'auth:external-logout',
  },
  INTERNAL: {
    loginRequested: 'internal:login-requested',
    logoutRequested: 'internal:logout-requested',
    loginApproved: 'internal:login-ok',
    logoutApproved: 'internal:logout-approved',
  },
  connectionLost: 'network:connection-lost',
  connectionReady: 'network:connection-ready',
  serverError: 'server-error',
} as const;

export function isPageNavigationKey(key: string): key is keyof typeof EVENTS.pageNavigation {
  return key in EVENTS.pageNavigation;
}
