var methods = {};

var validateOne = function(validatorFunction, fieldName) {
  // Get field value.
  var value = this.get(fieldName);

  try {
    // Run validator function which throws exception which we have to catch and
    // add error message to appropriate field.
    validatorFunction.call(this, fieldName, value);

    // If a field's validation didn't throw an exception then clear an error
    // message for the given field.
    this._errors.delete(fieldName);

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
  // Run validation for current and parent classes. The "isValid" variable will
  // be set to true when all validators for all classes passed validation.
  var isValid = Astro.utils.everyClass(this.constructor, function(Class) {
    // Get list of all validators for given class.
    var validators = Class.getValidators();

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
      // Take validators and run each one.
      return _.every(validators, validateOne, this);
    }
  }, this);

  return isValid;
};

methods.getValidationError = function(fieldName) {
  return this._errors.get(fieldName);
};

methods.hasValidationError = function(fieldName) {
  return this._errors.has(fieldName);
};

methods.hasValidationErrors = function() {
  return this._errors.size;
};

onInitModule = function() {
  _.extend(Astro.BaseClass.prototype, methods);
};
