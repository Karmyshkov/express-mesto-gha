class ServerError extends Error {
  constructor(message = 'Ошибка сервера') {
    super(message);
    this.status = 500;
  }
}

module.exports = ServerError;
