var validateOne = function(fieldName, stopOnFirstError) {
  var doc = this;
  var Class = doc.constructor;

  try {
    // Get definition of the field.
    var field = Class.getField(fieldName);
    // Get value of the field.
    var fieldValue = doc._getValue(fieldName);

    // If value of the field is not required and it's null, then we passed
    // validation.
    if (_.isNull(fieldValue) && !field.required) {
      return true;
    }

    // Get a validator for the given field name and run validation if it exists.
    var fieldValidator = Class.getValidator(fieldName);
    if (fieldValidator) {
      fieldValidator.validate(
        doc,
        fieldName,
        fieldValue
      );
    }

    // Check whether the field is embeded.
    if (field instanceof Astro.EmbedField) {
      // Check whether the field has the class.
      if (field.getClass()) {
        // Depending on the embeded field type execute validation on the embeded
        // values.
        if (field instanceof Astro.EmbedOneField) {
          return fieldValue.validate(stopOnFirstError);
        } else if (field instanceof Astro.EmbedManyField) {
          return _.every(fieldValue, function(nestedDoc) {
            return nestedDoc.validate(stopOnFirstError);
          });
        }
      }
    }

    // Remove a validator error message when no error occured.
    doc._errors.delete(fieldName);

    return true;
  } catch (e) {
    // If the error is not an instance of the Astro.ValidationError then throw
    // error again.
    if (!(e instanceof Astro.ValidationError)) {
      throw e;
    }

    // Generate an error message from the validator that didn't pass.
    var errorMessage = e.fieldValidator.generateErrorMessage(
      doc, fieldName, fieldValue
    );

    // Set validation error for the field.
    doc._errors.set(fieldName, errorMessage);

    return false;
  }
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

    Astro.errors.warn('validators.validate_all_deprecated');

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
