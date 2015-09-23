var ValidationError =
Astro.ValidationError = function ValidationError(data) {
  this.name = 'ValidationError';
  this.stack = (new Error()).stack;
  this.document = data.document;
  this.fieldValidator = data.fieldValidator;
  this.fieldName = data.fieldName;
  this.fieldValue = data.fieldValue;
  this.param = data.param;
};

ValidationError.prototype = Object.create(Error.prototype);

ValidationError.prototype.generateMessage = function() {
  var doc = this.document;
  var Class = doc.constructor;

  if (this.fieldValidator.message) {
    // Use the user defined error message in a field validator.
    return this.fieldValidator.message;
  }

  // Prepare an event object for the "validationError" event.
  var event = new Astro.ValidationErrorEvent({
    validator: this.fieldValidator.validator,
    fieldValue: this.fieldValue,
    fieldName: this.fieldName,
    param: this.param,
    message: this.message
  });
  event.target = doc;

  // Generate an error message using the "validationError" event.
  Class.emitEvent(event);
  var message = event.getMessage();
  if (event.stopped) {
    return message;
  }

  // Get a default validation error by executing the "validatioError" event on
  // the validator.
  this.fieldValidator.validator.emit(event);
  var message = event.getMessage();
  if (message) {
    return message;
  }

  // Default validation error.
  return 'The value of the "' + this.fieldName + '" field is invalid';
};
