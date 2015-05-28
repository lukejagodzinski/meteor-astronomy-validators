var checks = {};

checks.fieldName = function(fieldName) {
  if (!Match.test(fieldName, String)) {
    throw new Error(
      'The validator\'s field name in the "' + this.getName() +
      '" class schema has to be a string'
    );
  }
};

checks.validator = function(fieldName, validator) {
  if (!Match.test(validator, Match.OneOf(Function, [Function]))) {
    throw new Error(
      'The validator for the "' + fieldName +
      '" field in the "' + this.getName() +
      '" class schema has to be a function or an array of functions'
    );
  }
};

checks.validators = function(validators) {
  if (!Match.test(validators, Object)) {
    throw new Error(
      'The validator functions definition in the "' + this.getName() +
      '" class schema has to be an object'
    );
  }
};

var methods = {};

methods.hasValidator = function(fieldName) {
  checks.fieldName.call(this, fieldName);

  return _.has(this.schema.validators, fieldName);
};

methods.getValidator = function(fieldName) {
  checks.fieldName.call(this, fieldName);

  return this.schema.validators[fieldName];
};

methods.getValidators = function() {
  return this.schema.validators;
};

methods.addValidator = function(fieldName, validators) {
  // Check if field name had been provided and is a string.
  checks.fieldName.call(this, fieldName);
  // Check if validator is a function.
  checks.validator.call(this, fieldName, validators);

  this.schema.validators[fieldName] = this.schema.validators[fieldName] || [];
  this.schema.validators[fieldName] = this.schema.validators[fieldName].
    concat(validators);
};

methods.addValidators = function(validators) {
  var self = this;

  // Validators data has to be an object.
  checks.validators.call(self, validators);

  // Loop through list of validators data and add each one.
  _.each(validators, function(validator, fieldName) {
    self.addValidator(fieldName, validator);
  });
};

var events = {};

events.afterset = function(e) {
  var fieldName = e.data.field;

  // If a validator is defined for given field then clear error message for
  // that field.
  this._errors.delete(fieldName);
};

onInitClass = function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  // Add the "validators" attribute to the schema.
  Class.schema.validators = {};

  if (_.has(schemaDefinition, 'validators')) {
    Class.addValidators(schemaDefinition.validators);

    // Add "afterset" event to all classes having validators.
    Class.addEvents(events);
  }
};
