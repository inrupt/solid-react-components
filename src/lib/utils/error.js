export default class SolidError extends Error {
  constructor(message, name, code) {
    super(message);
    this.message = message;
    this.statusText = message;
    this.name = name || 'SolidError';
    this.type = this.name;
    this.code = code || 0;
    this.status = code || 0;
  }
}
