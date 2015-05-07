var afterSet = function() {
  this._hasErrors.set(false);
};

initSchema = function(Class, definition) {
  this._validators = {};

  if (_.has(definition, 'validators')) {
    this.addValidators(definition.validators);
  }

  this.addEvent('afterSet', afterSet);
};
