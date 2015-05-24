var checks = {};

checks.fieldName = function(fieldName) {
  if (!_.isString(fieldName)) {
    throw new Error(
      'The validator\'s field name in the "' + this.getName() +
      '" class schema has to be a string'
    );
  }
};

checks.validatorFunction = function(fieldName, validatorFunction) {
  if (!_.isFunction(validatorFunction)) {
    throw new Error(
      'The validator for the "' + fieldName + '" field in the "' +
      this.getName() + '" class schema has to be a function'
    );
  }
};

checks.validatorFunctions = function(validatorFunctions) {
  if (!_.isObject(validatorFunctions)) {
    throw new Error(
      'The validator functions definition in the "' + this.getName() +
      '" class schema has to be an object'
    );
  }
};

checks.added = function(fieldName) {
  if (Astro.utils.findValidator(this, fieldName)) {
    throw new Error(
      'The validator for the "' + fieldName + '" field in the "' +
      this.getName() + '" class schema had already been added'
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

methods.addValidator = function(fieldName, validatorFunction) {
  // Check if field name had been provided and is a string.
  checks.fieldName.call(this, fieldName);
  // Check if validator is a function.
  checks.validatorFunction.call(this, fieldName, validatorFunction);
  // Check if a validaor for the given field had already been added.
  checks.added.call(this, fieldName);

  this.schema.validators[fieldName] = validatorFunction;
};

methods.addValidators = function(validatorFunctions) {
  // Validators data has to be an object.
  checks.validatorFunctions.call(this, validatorFunctions);

  // Loop through list of validators data and add each one.
  _.each(validatorFunctions, function(validatorFunction, fieldName) {
    this.addValidator(fieldName, validatorFunction);
  }, this);
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
