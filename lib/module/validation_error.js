var ValidationError =
Astro.ValidationError = function ValidationError(fieldValidator) {
  this.name = 'ValidationError';
  this.fieldValidator = fieldValidator;
  this.stack = (new Error()).stack;
};

ValidationError.prototype = Object.create(Error.prototype);
