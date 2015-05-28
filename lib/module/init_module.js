var methods = {};

var generateMessage = function(validator, fieldName, fieldValue) {
  // Prepare an event object for the "validationerror" event.
  var event = new Astro.Event('validationerror', {
    value: fieldValue,
    field: fieldName,
    options: validator.options,
    message: null,
  });
  event.target = this;

  // Prepare variable for storing an error message.
  var errorMessage;

  // VALIDATION MESSAGE PASSED TO VALIDATOR.
  if (_.isString(validator.message)) {
    // If user passed a string message then use it.
    errorMessage = validator.message;
  } else if (_.isFunction(validator.message)) {
    // If user passed a function message then run it as it would be an event.
    validator.message.call(this, event);
    errorMessage = event.data.message;
  }
  if (errorMessage) {
    return errorMessage;
  }

  // VALIDATION MESSAGE ON THE LEVEL OF THE CLASS OR IN THE GLOBAL SCOPE.
  // If user haven't defined any custom validation message then check
  // whether there are any "validationerror" events that could generate
  // error message.
  this.constructor.emitEvent(event);
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

var validateOne = function(validators, fieldName) {
  var self = this;

  // Get the field's value.
  var fieldValue = self.get(fieldName);

  // Loop through validators list for the given field name and run each one.
  var isValid = _.every(validators, function(validator) {
    var isOneValid = validator.call(
      self,
      fieldValue,
      fieldName,
      validator.options
    );

    if (!isOneValid) {
      // Prepare variable for storing error message.
      var errorMessage = generateMessage.call(
        self,
        validator,
        fieldName,
        fieldValue
      );

      // Add validation error message to the given field.
      self._errors.set(fieldName, errorMessage);
    }

    return isOneValid;
  });

  if (isValid) {
    self._errors.delete(fieldName);
  }

  return isValid;
};

methods.validate = function(fieldName) {
  var self = this;

  // Run validation for current and parent classes. The "isValid" variable will
  // be set to true when all validators for all classes passed validation.
  var isValid = Astro.utils.everyClass(self.constructor, function(Class) {
    if (fieldName) {
      // Get validators only for the given field name.
      var validators = Class.getValidator(fieldName);

      // Validate field only if there are any validators.
      if (validators) {
        return validateOne.call(self, validators, fieldName);
      } else {
        return true;
      }
    } else {
      // Get list of the all validators for the given class and run validation.
      var validators = Class.getValidators();

      // Perform validation in the order, if provided.
      var validationOrder = Class.getValidationOrder();
      if (validationOrder) {
        var keys = _.keys(validators);
        var diff = _.difference(keys, validationOrder);
        var order;
        if (diff.length > 0) {
          order = validationOrder.concat(diff);
        } else {
          order = validationOrder;
        }

        return _.every(order, function(fieldName) {
          return validateOne.call(self, validators[fieldName], fieldName);
        });
      } else {
        return _.every(validators, function(validator, fieldName) {
          return validateOne.call(self, validator, fieldName);
        });
      }
    }
  });

  return isValid;
};

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

var events = {};

events.toJsonValue = function(e) {
  var self = this;

  Tracker.nonreactive(function() {
    e.data.errors = self._errors.all();
  });
};

events.fromJsonValue = function(e) {
  this._errors.set(e.data.errors);
};

onInitModule = function() {
  _.extend(Astro.BaseClass.prototype, methods);

  Astro.eventManager.on('toJsonValue', events.toJsonValue);
  Astro.eventManager.on('fromJsonValue', events.fromJsonValue);
};
