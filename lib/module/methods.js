methods = {};

methods.validateOne = function(validatorFunction, fieldName) {
  // Get field value.
  var value = this.get(fieldName);

  try {
    // Run validator function which throws exception which we have to catch and
    // add error message to appropriate field.
    validatorFunction.call(this, value, fieldName);

    // If a field's validation didn't throw an exception then clear an error
    // message for the given field.
    this._errors.set(fieldName, undefined);

    return true;
  } catch (e) {
    if (e instanceof ValidationError) {
      this._errors.set(fieldName, e.message);
    } else {
      throw e;
    }

    return false;
  }
};

methods.validate = function(fieldName) {
  // Functions "schema.getValidator" and "schema.getValidators" get validation
  // data defined in the given class schema not global validator object.

  // Get schema for given object instance.
  var schema = this.constructor.schema;

  // Get list all of all validators.
  var validators = schema.getValidators();

  var isValid = true;
  if (fieldName) {
    // Get validation function for given field name.
    var validatorFunction = validators[fieldName];

    // Validate field only if there is validation function.
    if (validatorFunction) {
      isValid = methods.validateOne.call(this, validatorFunction, fieldName);
    }

    // When the given field passed validation, we have to check how many errors
    // we still have and decide whether the "_hasErrors" reactive var should be
    // set.
    this._hasErrors.set(
      !_.isUndefined(
        _.find(validators, function(validator, fieldName) {
          return this._errors.get(fieldName);
        }, this)
      )
    );
  } else {
    // Get schema validators and run each one.
    isValid = _.all(validators, methods.validateOne, this);

    // Set reactive object's error indicator.
    this._hasErrors.set(!isValid);
  }

  return isValid;
};

methods.getError = function(fieldName) {
  return this._errors.get(fieldName);
};

methods.hasError = function(fieldName) {
  return !this._errors.equals(fieldName, undefined);
};

methods.hasErrors = function(fieldName) {
  return this._hasErrors.get();
};

methods.afterSet = function() {
  this._hasErrors.set(false);
};
