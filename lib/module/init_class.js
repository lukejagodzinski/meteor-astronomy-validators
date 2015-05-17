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

initClass = function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  // Add the "validators" attribute to the schema.
  Class.schema.validators = {};

  if (_.has(schemaDefinition, 'validators')) {
    Class.addValidators(schemaDefinition.validators);
  }
};
