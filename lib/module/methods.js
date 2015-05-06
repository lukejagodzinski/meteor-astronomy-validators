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
  // Run validation for current and parent classes' schemas. The "isValid" var
  // will be set to true when all validators for all schemas passed validation.
  var isValid = _.all(this.constructor.schemas, function(schema) {
    // Get list all of all validators for given schema.
    var validators = schema.getValidators();

    if (fieldName) {
      // Get validation function for given field name.
      var validatorFunction = validators[fieldName];

      // Validate field only if there is validation function.
      if (validatorFunction) {
        return methods.validateOne.call(this, validatorFunction, fieldName);
      } else {
        return true;
      }
    } else {
      // Get schema validators and run each one.
      return _.all(validators, methods.validateOne, this);
    }
  }, this);

  // Now the "isValid" var contains information if there was any validation
  // errors. However developer could execute validation only for one field, so
  // we can't just set "hasErrors" reactive var. We have to check if there were
  // any errors before.
  var hasErrors = _.any(this._errors.keys, function(undefined, fieldName) {
    return this._errors.get(fieldName);
  }, this);
  this._hasErrors.set(hasErrors);

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
