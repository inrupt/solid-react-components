import EventEmitter from 'events';
// import jest from 'jest';

class SolidAuthClient extends EventEmitter {
  constructor() {
    super();
    this.session = undefined;
  }

  login() {}

  logout() {}

  trackSession(callback) {
    if (this.session !== undefined) callback(this.session);
    this.on('session', callback);
  }
  mockWebId(webId) {
    this.session = webId ? { webId } : null;
    this.emit('session', this.session);
    return new Promise(resolve => setImmediate(resolve));
  }
  currentSession() {}

  fetch() {
    return { ok: true, code: 200 };
  }
}

const instance = new SolidAuthClient();
jest.spyOn(instance, 'login');
jest.spyOn(instance, 'logout');
jest.spyOn(instance, 'trackSession');
jest.spyOn(instance, 'removeListener');
jest.spyOn(instance, 'fetch');

export default instance;
