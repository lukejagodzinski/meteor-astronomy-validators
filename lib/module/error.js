ValidationError = function(message) {
  this.message = message;
  this.stack = (new Error()).stack;
};

ValidationError.prototype = new Error();
ValidationError.prototype.constructor = ValidationError;
