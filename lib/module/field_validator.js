var FieldValidator =
Astro.FieldValidator = function FieldValidator(fieldValidatorDefinition) {
  var self = this;

  // self.name = fieldValidatorDefinition.validator.name;
  self.validator = fieldValidatorDefinition.validator;
  self.param = fieldValidatorDefinition.param;
  self.message = fieldValidatorDefinition.message;
};

FieldValidator.prototype.validate = function(doc, fieldName, fieldValue) {
  var self = this;

  // If a function was passed as a validator's param, then it may mean that we
  // want it to evalute to some value.
  var param = _.isFunction(self.param) ? self.param.call(doc) : self.param;

  if (!self.validator.validate.call(
    doc, fieldValue, fieldName, param
  )) {
    // Throw error.
    throw new Astro.ValidationError(self);
  }

  return true;
};

FieldValidator.prototype.generateErrorMessage = function(
  doc, fieldName, fieldValue
) {
  var self = this;
  var Class = doc.constructor;

  // If a function was passed as a validator's param, then it may mean that we
  // want it to evalute to some value.
  var param = _.isFunction(self.param) ? self.param.call(doc) : self.param;

  // Prepare an event object for the "validationError" event.
  var event = new Astro.Event('validationError', {
    validator: self,
    fieldValue: fieldValue,
    fieldName: fieldName,
    param: param
  });
  event.target = doc;

  // If the user defined error message was provided then use it.
  if (self.message) {
    return self.message;
  }

  // Generate an error message using the "validationError" event.
  Class.emitEvent(event);
  if (event.data.message) {
    return event.data.message;
  }

  // Get a default validation error by executing the "validatioError" event on
  // the validator.
  self.validator.emit(event);
  if (event.data.message) {
    return event.data.message;
  }

  // Default validation error.
  return 'The value of the "' + fieldName + '" field is invalid';
};
