var ValidationError = Astro.ValidationError = function ValidationError(errors) {
  this.name = 'ValidationError';
  this.errors = errors;
  this.stack = (new Error()).stack;
};

ValidationError.prototype = Object.create(Error.prototype);
