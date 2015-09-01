var methods = {};

// Public.

methods.getValidationError = function(fieldName) {
  return this._errors.get(fieldName);
};

methods.getValidationErrors = function() {
  return this._errors.all();
};

methods.hasValidationError = function(fieldName) {
  return this._errors.has(fieldName);
};

methods.hasValidationErrors = function() {
  return this._errors.size() > 0;
};

methods.throwValidationException = function() {
  throw new Meteor.Error('validation-error', this.getValidationErrors());
};

methods.catchValidationException = function(exception) {
  if (!(exception instanceof Meteor.Error) ||
    exception.error !== 'validation-error' ||
    !_.isObject(exception.reason)
  ) {
    return;
  }

  this._errors.set(exception.reason);
};

_.extend(Astro.BaseClass.prototype, methods);
