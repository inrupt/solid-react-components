import EventEmitter from 'events';
// import jest from 'jest';

class SolidAuthClient extends EventEmitter {
  constructor() {
    super();
    this.session = null;
  }

  login() {}

  logout() {}

  trackSession(callback) {
    callback(this.session);
    this.on('session', callback);
  }
}

const instance = new SolidAuthClient();
jest.spyOn(instance, 'login');
jest.spyOn(instance, 'logout');
jest.spyOn(instance, 'removeListener');

export default instance;
