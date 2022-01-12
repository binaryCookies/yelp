//? VIDEO 443. Defining Express Error Class

class ExpressError extends Error {
  constructor(message, statusCode) {
    //The super keyword is used to access and call functions on an object's parent. THe parent object being Error
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
