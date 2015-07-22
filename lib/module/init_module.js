var generateMessage = function(validator, fieldName, fieldValue) {
  var doc = this;
  var Class = doc.constructor;

  var options;
  if (_.isFunction(validator.options)) {
    options = validator.options.call(doc);
  } else {
    options = validator.options;
  }

  // Prepare an event object for the "validationerror" event.
  var event = new Astro.Event('validationerror', {
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
  // whether there are any "validationerror" events that could generate
  // error message.
  Class.emitEvent(event);
  errorMessage = event.data.message;
  if (errorMessage) {
    return errorMessage;
  }

  // DEFAULT VALIDATOR MESSAGE.
  // If in this place the "errorMessage" variable is still not set, then we
  // have to look for the "validationerror" event in the validator's
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

var validateList = function(validatorsList, patternOrFieldName) {
  var doc = this;
  var Class = doc.constructor;

  // Variable for storing fields names. When the second argument of the
  // "validateList" function is pattern, then we have to take fields names out
  // of this pattern. If the argument is a single field name then we just put it
  // in the array.
  var fieldsNames;
  // Variable for storing information if the second argument is pattern or just
  // a field name.
  var isPattern = false;
  // Try finding the ".$" string which indicates that it's a pattern.
  if (patternOrFieldName.indexOf('.$') !== -1) {
    // Get fields out of the pattern.
    fieldsNames = Astro.utils.fields.getFieldsNamesFromPattern(
      doc,
      patternOrFieldName
    );
    isPattern = true;
  } else {
    fieldsNames = [patternOrFieldName];
  }

  // Loop through list of all fileds names and perform validation on each field.
  _.each(fieldsNames, function(fieldName) {
    // Get the field's value.
    var fieldValue = Astro.utils.fields.getValue(doc, fieldName);

    // Loop through validators list and run each one.
    _.each(validatorsList, function(validator) {
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
            patternOrFieldName: patternOrFieldName,
            fieldValue: fieldValue
          });
        }

        // Throw errors.
        throw new ValidationError(errors);
      } else {
        // Remove a validator error message if present.
        doc._errors.delete(fieldName);

        if (isPattern) {
          doc._errors.delete(patternOrFieldName);
        }
      }
    });
  });
};

var validateOne = function(patternOrFieldName) {
  var doc = this;
  var Class = doc.constructor;

  var errors = [];

  try {
    // Get validators only for the given field name.
    var validatorsList = Astro.utils.validators.findValidator(
      Class,
      patternOrFieldName
    );
    // Validate field only if there are any validators.
    if (validatorsList) {
      validateList.call(doc, validatorsList, patternOrFieldName);
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      errors = errors.concat(e.errors);
    }
  }

  return errors;
};

var validateMany = function(patternsOrFieldsNames, stopOnFirstError) {
  if (_.isUndefined(stopOnFirstError)) {
    stopOnFirstError = true;
  }

  var doc = this;
  var Class = doc.constructor;

  // Get the list of validators and run validation.
  var validatorsLists = Astro.utils.validators.getValidators(
    Class,
    patternsOrFieldsNames
  );

  // Get the validation order.
  var validationOrder = Class.getValidationOrder();
  if (validationOrder) {
    // Get keys of validators that are not present in validation order. We will
    // add them at the end of the validation order to ensure that all validators
    // have been invoked.
    var diff = _.difference(_.keys(validatorsLists), validationOrder);
    // Add the rest of the validators at the end.
    if (diff.length > 0) {
      validationOrder = validationOrder.concat(diff);
    }
  } else {
    validationOrder = _.keys(validatorsLists);
  }

  // Callect errors. If the "stopOnFirstError" flag is set, then we stop collecting
  // errors after first error. Otherwise, we continue until we reach the last
  // validatorsList.
  var errors = [];
  _.every(validationOrder, function(patternOrFieldName) {
    try {
      var validatorsList = validatorsLists[patternOrFieldName];
      if (validatorsList) {
        validateList.call(doc, validatorsList, patternOrFieldName);
      }
    } catch (e) {
      if (e instanceof ValidationError) {
        errors = errors.concat(e.errors);
      }
    }

    if (stopOnFirstError && errors.length > 0) {
      return false;
    } else {
      return true;
    }
  });

  return errors;
};

var validateAll = function(stopOnFirstError) {
  if (_.isUndefined(stopOnFirstError)) {
    stopOnFirstError = true;
  }

  var doc = this;
  var Class = doc.constructor;

  // Get list of the all validators for the given class and run validation.
  var validatorsLists = Astro.utils.validators.getAllValidators(Class);

  // Validate all validators.
  return validateMany.call(doc, _.keys(validatorsLists), stopOnFirstError);
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
  validate: function() {
    var doc = this;

    var errors;
    if (arguments.length === 1) {
      if (_.isString(arguments[0])) {
        errors = validateOne.call(doc, arguments[0]);
      } else if (_.isArray(arguments[0])) {
        errors = validateMany.call(doc, arguments[0], true);
      }
    } else if (arguments.length === 0) {
      errors = validateAll.call(doc, true);
    }

    setErrors.call(doc, errors);

    return errors.length === 0;
  },

  validateAll: function() {
    var doc = this;

    var errors = validateAll.call(doc, false);

    setErrors.call(doc, errors);

    return errors.length === 0;
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
  toJsonValue: function(e) {
    var self = this;

    Tracker.nonreactive(function() {
      e.data.errors = self._errors.all();
    });
  },

  fromJsonValue: function(e) {
    this._errors.set(e.data.errors);
  }
};

onInitModule = function() {
  _.extend(Astro.base.Class.prototype, methods);

  Astro.eventManager.on('toJsonValue', events.toJsonValue);
  Astro.eventManager.on('fromJsonValue', events.fromJsonValue);
};
