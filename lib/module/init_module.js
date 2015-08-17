var generateMessage = function(validator, fieldName, fieldValue) {
  var doc = this;
  var Class = doc.constructor;

  var options;
  if (_.isFunction(validator.options)) {
    options = validator.options.call(doc);
  } else {
    options = validator.options;
  }

  // Prepare an event object for the "validationError" event.
  var event = new Astro.Event('validationError', {
    validator: _.has(validator, 'definition') ? validator.definition.name : '',
    value: fieldValue,
    field: fieldName,
    options: options,
    message: null,
  });
  event.target = doc;

  // Prepare variable for storing an error message.
  var errorMessage;

  // VALIDATION MESSAGE PASSED TO VALIDATOR.
  if (_.isString(validator.message)) {
    // If user passed a string message then use it.
    errorMessage = validator.message;
  } else if (_.isFunction(validator.message)) {
    // If user passed a function message then run it as it would be an event.
    validator.message.call(doc, event);
    errorMessage = event.data.message;
  }
  if (errorMessage) {
    return errorMessage;
  }

  // VALIDATION MESSAGE ON THE LEVEL OF THE CLASS OR IN THE GLOBAL SCOPE.
  // If user haven't defined any custom validation message then check
  // whether there are any "validationError" events that could generate
  // error message.
  Class.emitEvent(event);
  errorMessage = event.data.message;
  if (errorMessage) {
    return errorMessage;
  }

  // DEFAULT VALIDATOR MESSAGE.
  // If in this place the "errorMessage" variable is still not set, then we
  // have to look for the "validationError" event in the validator's
  // definition.
  if (
    validator.definition &&
    _.isFunction(validator.definition.emit)
  ) {
    validator.definition.emit(event);
    errorMessage = event.data.message;
  }
  if (errorMessage) {
    return errorMessage;
  }

  // DEFAULT MESSAGE.
  errorMessage = 'The "' + fieldName + '" field\'s value is invalid';
  return errorMessage;
};

var callValidator = function(validator, pattern) {
  var doc = this;
  var Class = doc.constructor;

  var fieldsNames;
  // Check whether we are validating pattern or single field.
  var isPattern = Astro.utils.fields.isPattern(pattern);

  if (isPattern) {
    // Get fields names from pattern.
    fieldsNames = Astro.utils.fields.getFieldsNamesFromPattern(doc, pattern);
  } else {
    fieldsNames = [pattern];
  }

  // Run validator for each field that matches pattern.
  _.each(fieldsNames, function(fieldName) {
    // Get the value of the field.
    var fieldValue = Astro.utils.fields.getValue(doc, fieldName);

    // Run validator.
    var isValid = validator.call(doc, fieldValue, fieldName);

    if (!isValid) {
      // Prepare an object for storing error messages.
      var errors = [];

      // Add a validation error message for the given field.
      errors.push({
        validator: validator,
        patternOrFieldName: fieldName,
        fieldValue: fieldValue
      });

      if (isPattern) {
        // Add a validation error message for the given pattern.
        errors.push({
          validator: validator,
          patternOrFieldName: pattern,
          fieldValue: fieldValue
        });
      }

      // Throw errors.
      throw new ValidationError(errors);
    } else {
      // Remove a validator error message if present.
      doc._errors.delete(fieldName);

      if (isPattern) {
        doc._errors.delete(pattern);
      }
    }
  });
};

var validateOne = function(pattern) {
  var doc = this;
  var Class = doc.constructor;

  var errors = [];

  try {
    // Get validator for the given pattern.
    var validator = Astro.utils.validators.getValidator(Class, pattern);
    // Run validation only if there is a validator for the given pattern.
    if (validator) {
      callValidator.call(doc, validator, pattern);
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      errors = errors.concat(e.errors);
    } else {
      throw e;
    }
  }

  return errors;
};

var validateMany = function(patterns, stopOnFirstError) {
  var doc = this;
  var Class = doc.constructor;

  // Get the validation order.
  var validationOrder = Class.getValidationOrder();
  if (validationOrder) {
    // Get the difference between patterns to validate and provided validation
    // order.
    var diff = _.difference(patterns, validationOrder);
    // Add the rest of the validators at the end.
    if (diff.length > 0) {
      validationOrder = validationOrder.concat(diff);
    }
  } else {
    validationOrder = patterns;
  }

  // Callect errors. If the "stopOnFirstError" flag is set, then we stop
  // collecting errors after the first one. Otherwise, we continue until we
  // reach the last validator.
  var errors = [];
  _.every(validationOrder, function(pattern) {
    errors = errors.concat(validateOne.call(doc, pattern));

    if (stopOnFirstError && errors.length > 0) {
      return false;
    } else {
      return true;
    }
  });

  return errors;
};

var setErrors = function(errors) {
  var doc = this;

  _.each(errors, function(error) {
    var message = generateMessage.call(
      doc,
      error.validator,
      error.patternOrFieldName,
      error.fieldValue
    );
    doc._errors.set(error.patternOrFieldName, message);
  });
};

var methods = {
  validate: function(patterns, stopOnFirstError) {
    var doc = this;
    var Class = doc.constructor;
    var errors;

    if (arguments.length === 0) {

      // Get list of all validators.
      patterns = _.keys(Astro.utils.validators.getAllValidators(Class));

    } else if (arguments.length === 1) {

      if (_.isString(patterns)) {
        patterns = [patterns];
      } else if (_.isBoolean(patterns)) {
        // Rewrite value of the "patterns" argument into the "stopOnFirstError"
        // argument.
        stopOnFirstError = patterns;
        // Get list of all validators.
        patterns = _.keys(Astro.utils.validators.getAllValidators(Class));
      }

    } else if (arguments.length === 2) {

      if (_.isString(patterns)) {
        patterns = [patterns];
      }

    }

    // Set default value of the "stopOnFirstError" argument.
    if (_.isUndefined(stopOnFirstError)) {
      stopOnFirstError = true;
    }

    errors = validateMany.call(doc, patterns, stopOnFirstError);
    setErrors.call(doc, errors);

    return errors.length === 0;
  },

  validateAll: function() {
    var doc = this;

    console.warn(
      'ASTRONOMY: The "validateAll()" method is deprecated and will be ' +
      'removed on v1.0 release. Use the "validate(false)" method to run ' +
      'all validators and do not stop on the first error.'
    );

    return doc.validate(false);
  },

  getValidationError: function(fieldName) {
    return this._errors.get(fieldName);
  },

  getValidationErrors: function() {
    return this._errors.all();
  },

  hasValidationError: function(fieldName) {
    return this._errors.has(fieldName);
  },

  hasValidationErrors: function() {
    return this._errors.size() > 0;
  },

  throwValidationException: function() {
    throw new Meteor.Error('validation-error', this.getValidationErrors());
  },

  catchValidationException: function(exception) {
    if (!(exception instanceof Meteor.Error) ||
      exception.error !== 'validation-error' ||
      !_.isObject(exception.reason)
    ) {
      return;
    }

    this._errors.set(exception.reason);
  }
};

var events = {
  toJSONValue: function(e) {
    var self = this;

    Tracker.nonreactive(function() {
      e.data.errors = self._errors.all();
    });
  },

  fromJSONValue: function(e) {
    this._errors.set(e.data.errors);
  }
};

_.extend(Astro.BaseClass.prototype, methods);

Astro.eventManager.on('toJSONValue', events.toJSONValue);
Astro.eventManager.on('fromJSONValue', events.fromJSONValue);
