var prototype = Astro.Schema.prototype;

prototype.getValidator = function(fieldName) {
  if (!_.isString(fieldName)) {
    return;
  }

  return this._validators[fieldName];
};

prototype.getValidators = function() {
  return this._validators;
};

prototype.addValidator = function(fieldName, validatorFunction) {
  // Check if field name had been provided and is a string.
  if (!_.isString(fieldName)) {
    throw new Error(
      'The validator\'s field name in the "' + this.getName() + '" class ' +
      'schema has to be a string'
    );
  }

  // Check if validator is a function.
  if (!_.isFunction(validatorFunction)) {
    throw new Error(
      'The validator for the field "' + fieldName + '" in the "' +
      this.getName() + '" class schema has to be a function'
    );
  }

  this._validators[fieldName] = validatorFunction;
};

prototype.addValidators = function(validatorsData) {
  // Validators data has to be an object.
  if (!_.isObject(validatorsData)) {
    throw new Error(
      'The validators data in the "' + this.getName() + '" class schema has ' +
      'to be an object'
    );
  }

  // Loop through list of validators data and add each one.
  _.each(validatorsData, function(validatorFunction, fieldName) {
    this.addValidator(fieldName, validatorFunction);
  }, this);
};
