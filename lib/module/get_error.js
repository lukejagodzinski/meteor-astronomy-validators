var methods = {};

methods.getValidationError = function(fieldName) {
  var doc = this;
  var error;

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
      if (nestedDoc instanceof Astro.BaseClass) {
        error = nestedDoc._errors.get(nestedFieldName);
      }
    }
  );

  return error;
};

methods.getValidationErrors = function() {
  var doc = this;
  var Class = doc.constructor;

  var errors = this._errors.all();
  var fields = Class.getFields();
  _.each(fields, function(field, fieldName) {
    if (doc[fieldName] && field.class) {
      if (field instanceof Astro.fields.object) {
        var nestedErrors = doc[fieldName].getValidationErrors();
        _.each(nestedErrors, function(nestedError, nestedFieldName) {
          errors[fieldName + '.' + nestedFieldName] = nestedError;
        });
      } else if (field instanceof Astro.fields.array) {
        _.each(doc[fieldName], function(nestedDoc, index) {
          if (nestedDoc) {
            var nestedErrors = nestedDoc.getValidationErrors();
            _.each(nestedErrors, function(nestedError, nestedFieldName) {
              errors[
                fieldName + '.' + index + '.' + nestedFieldName
              ] = nestedError;
            });
          }
        });
      }
    }
  });

  return errors;
};

methods.hasValidationError = function(fieldName) {
  var doc = this;
  var has;

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
      if (nestedDoc instanceof Astro.BaseClass) {
        has = nestedDoc._errors.has(nestedFieldName);
      }
    }
  );

  return has;
};

methods.hasValidationErrors = function() {
  var errors = this.getValidationErrors();
  return _.size(errors) > 0;
};

methods.clearValidationErrors = function() {
  var doc = this;
  var Class = doc.constructor;

  doc._errors.clear();

  var fields = Class.getFields();
  _.each(fields, function(field, fieldName) {
    if (
      doc[fieldName] && field instanceof Astro.fields.object && field.class
    ) {
      doc[fieldName]._errors.clear();
    } else if (
      doc[fieldName] && field instanceof Astro.fields.array && field.class
    ) {
      _.each(doc[fieldName], function(nestedDoc, index) {
        if (nestedDoc instanceof Astro.BaseClass) {
          nestedDoc._errors.clear();
        }
      });
    }
  });
};

methods.throwValidationException = function() {
  throw new Meteor.Error('validation-error', this.getValidationErrors());
};

methods.catchValidationException = function(exception) {
  if (!(exception instanceof Meteor.Error) ||
    exception.error !== 'validation-error' ||
    !_.isObject(exception.reason)
  ) {
    return false;
  }

  var doc = this;
  var errors = exception.reason;

  _.each(errors, function(error, fieldName) {
    Astro.utils.fields.traverseNestedDocs(
      doc,
      fieldName,
      function(nestedDoc, nestedFieldName, Class, field, index) {
        if (nestedDoc instanceof Astro.BaseClass) {
          nestedDoc._errors.set(nestedFieldName, error);
        }
      }
    );
  });
  return true;
};

_.extend(Astro.BaseClass.prototype, methods);
