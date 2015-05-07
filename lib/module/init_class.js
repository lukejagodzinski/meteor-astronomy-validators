var validateOne = function(validatorFunction, fieldName) {
  // Get field value.
  var value = this.get(fieldName);

  try {
    // Run validator function which throws exception which we have to catch and
    // add error message to appropriate field.
    validatorFunction.call(this, fieldName, value);

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

var validate = function(fieldName) {
  // Run validation for current and parent classes' schemas. The "isValid" var
  // will be set to true when all validators for all schemas passed validation.
  var isValid = _.every(this.constructor.schemas, function(schema) {
    // Get list all of all validators for given schema.
    var validators = schema.getValidators();

    if (fieldName) {
      // Get validation function for given field name.
      var validatorFunction = validators[fieldName];

      // Validate field only if there is validation function.
      if (validatorFunction) {
        return validateOne.call(this, validatorFunction, fieldName);
      } else {
        return true;
      }
    } else {
      // Get schema validators and run each one.
      return _.every(validators, validateOne, this);
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

var getError = function(fieldName) {
  return this._errors.get(fieldName);
};

var hasError = function(fieldName) {
  return !this._errors.equals(fieldName, undefined);
};

var hasErrors = function(fieldName) {
  return this._hasErrors.get();
};

initClass = function() {
  this.prototype.validate = validate;
  this.prototype.getError = getError;
  this.prototype.hasError = hasError;
  this.prototype.hasErrors = hasErrors;
};
