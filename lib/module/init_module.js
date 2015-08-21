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

var callValidator = function(validator, fieldName) {
  var doc = this;
  var Class = doc.constructor;

  // Get the value of the field.
  var fieldValue = Astro.utils.fields.getValue(doc, fieldName);

  // Run validator.
  var isValid = validator.call(doc, fieldValue, fieldName);

  if (!isValid) {
    // Add a validation error message for the given field.
    var errors = [{
      validator: validator,
      fieldName: fieldName,
      fieldValue: fieldValue
    }];

    // Throw errors.
    throw new ValidationError(errors);
  } else {
    // Remove a validator error message if present.
    doc._errors.delete(fieldName);
  }
};

var validateOne = function(fieldName, stopOnFirstError) {
  var doc = this;
  var Class = doc.constructor;

  try {
    // Get a validator for the given field name and run validation if it exists.
    var validator = Class.getValidator(fieldName);
    if (validator) {
      callValidator.call(doc, validator, fieldName);
    } else {
      var field = Class.getField(fieldName);
      if (field instanceof Astro.EmbedOneField) {
        return doc.get(fieldName).validate(stopOnFirstError);
      } else if (field instanceof Astro.EmbedManyField) {
        return _.every(doc.get(fieldName), function(nestedField) {
          return nestedField.validate(stopOnFirstError);
        });
      }
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      _.each(e.errors, function(error) {
        var message = generateMessage.call(
          doc,
          error.validator,
          error.fieldName,
          error.fieldValue
        );
        doc._errors.set(error.fieldName, message);
      });
      return false;
    } else {
      throw e;
    }
  }

  return true;
};

var validateMany = function(fieldsNames, stopOnFirstError) {
  var doc = this;
  var Class = doc.constructor;

  // Get the validation order.
  var validationOrder = Class.getValidationOrder();
  fieldsNames = _.intersection(validationOrder, fieldsNames);

  // Run validation for each field. If the "stopOnFirstError" flag is set, then
  // we stop validating after the first error. Otherwise, we continue until we
  // reach the last validator.
  if (stopOnFirstError) {
    return _.every(fieldsNames, function(fieldName) {
      return validateOne.call(doc, fieldName, stopOnFirstError);
    });
  } else {
    var valid = true;
    _.each(fieldsNames, function(fieldName) {
      if (!validateOne.call(doc, fieldName, stopOnFirstError)) {
        valid = false;
      }
    });
    return valid;
  }
};

var methods = {
  validate: function(fieldsNames, stopOnFirstError) {
    var doc = this;
    var Class = doc.constructor;

    if (arguments.length === 0) {

      // Get list of all fields
      fieldsNames = Class.getFieldsNames();

    } else if (arguments.length === 1) {

      if (_.isString(fieldsNames)) {
        fieldsNames = [fieldsNames];
      } else if (_.isBoolean(fieldsNames)) {
        // Rewrite value of the "fieldsNames" argument into the
        // "stopOnFirstError" argument.
        stopOnFirstError = fieldsNames;
        // Get list of all validators.
        fieldsNames = Class.getFieldsNames();
      }

    } else if (arguments.length === 2) {

      if (_.isString(fieldsNames)) {
        fieldsNames = [fieldsNames];
      }

    }

    // Set default value of the "stopOnFirstError" argument.
    if (_.isUndefined(stopOnFirstError)) {
      stopOnFirstError = true;
    }

    return validateMany.call(doc, fieldsNames, stopOnFirstError);
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
