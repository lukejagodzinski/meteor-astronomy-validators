var methods = {};

methods._validateOne = function(fieldName, stopOnFirstError) {
  var doc = this;
  var result = true;

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
      // Get value of the field.
      var nestedFieldValue = nestedDoc.get(nestedFieldName);

      // If value of the field is optional and it's null, then we passed
      // validation. Clear any existing error
      if (_.isNull(nestedFieldValue) && field.optional) {
        nestedDoc._errors.delete(nestedFieldName);
        return;
      }

      try {
        // Get a validator for the given field name and run validation if it
        // exists.
        var nestedFieldValidator = Class.getValidator(nestedFieldName);
        if (nestedFieldValidator) {
          nestedFieldValidator.validate(
            nestedDoc,
            nestedFieldName,
            nestedFieldValue
          );
        }

        // Remove a validator error message when no error occured.
        nestedDoc._errors.delete(nestedFieldName);

        // Depending on the nested field type execute validation on the nested
        // values. The nested field has also have defined class.
        if (nestedFieldValue && field.class) {
          if (field instanceof Astro.fields.object) {
            result = nestedFieldValue.validate(stopOnFirstError);
          } else if (field instanceof Astro.fields.array) {
            if (stopOnFirstError) {
              result = _.every(nestedFieldValue, function(nestedDoc) {
                if (nestedDoc) {
                  return nestedDoc.validate(stopOnFirstError);
                }
                return true;
              });
            } else {
              _.each(nestedFieldValue, function(nestedDoc) {
                if (nestedDoc && !nestedDoc.validate(stopOnFirstError)) {
                  result = false;
                }
              });
            }
          }
        }
      } catch (e) {
        // If the error is not an instance of the Astro.ValidationError then
        // throw error again.
        if (!(e instanceof Astro.ValidationError)) {
          throw e;
        }

        // Generate an error message from the validator that didn't pass.
        var errorMessage = e.generateMessage();

        // Set validation error for the field.
        nestedDoc._errors.set(nestedFieldName, errorMessage);

        result = false;
      }
    }
  );

  return result;
};

methods._validateMany = function(fieldsNames, stopOnFirstError) {
  var doc = this;
  var Class = doc.constructor;

  // Run validation for each field. If the "stopOnFirstError" flag is set, then
  // we stop validating after the first error. Otherwise, we continue until we
  // reach the last validator.
  if (stopOnFirstError) {
    return _.every(fieldsNames, function(fieldName) {
      return doc._validateOne(fieldName, stopOnFirstError);
    });
  } else {
    var valid = true;
    _.each(fieldsNames, function(fieldName) {
      if (!doc._validateOne(fieldName, stopOnFirstError)) {
        valid = false;
      }
    });
    return valid;
  }
};

// Public.

methods.validate = function(fieldsNames, stopOnFirstError) {
  var doc = this;
  var Class = doc.constructor;

  if (arguments.length === 0) {

    // Get list of all fields in the proper validation order.
    fieldsNames = Class.getValidationOrder();

  } else if (arguments.length === 1) {

    if (_.isString(fieldsNames)) {
      fieldsNames = [fieldsNames];
    } else if (_.isBoolean(fieldsNames)) {
      // Rewrite value of the "fieldsNames" argument into the
      // "stopOnFirstError" argument.
      stopOnFirstError = fieldsNames;
      // Get list of all validators.
      fieldsNames = Class.getValidationOrder();
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

  return doc._validateMany(fieldsNames, stopOnFirstError);
};

_.extend(Astro.BaseClass.prototype, methods);
