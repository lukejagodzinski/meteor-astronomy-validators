var validateOne = function(validatorFunction, fieldName) {
  // Get field value.
  var value = this.get(fieldName);

  try {
    // Run validator function which throws exception which we have to catch and
    // add error message to appropriate field.
    validatorFunction.call(this, value, fieldName);

    return true;
  } catch (e) {
    if (e instanceof ValidationError) {
      this._errors.set(fieldName, e.message);
    } else {
      throw e;
    }

    return false;
  }
};

var validate = function(fieldName) {
  // Functions "schema.getValidator" and "schema.getValidators" get validation
  // data defined in the given class schema not global validator object.

  // Get schema for given object instance.
  var schema = this.constructor.schema;

  var validators = schema.getValidators();
  _.each(validators, function(validator, fieldName) {
    this._errors.set(fieldName, undefined);
  }, this);

  if (fieldName) {
    // Get validation function for given field name.
    var validatorFunction = schema.getValidator(fieldName);
    return validateOne.call(this, validatorFunction, fieldName);
  } else {
    // Get schema validators and run each one.
    return _.all(validators, validateOne, this);
  }
};

var getError = function(fieldName) {
  return this._errors.get(fieldName);
};

Astro.Module({
  name: 'Validators',
  initSchema: function(Class, definition) {
    this._validators = {};

    if (_.has(definition, 'validators')) {
      this.addValidators(definition.validators);
    }

    Class.prototype.validate = validate;
    Class.prototype.getError = getError;
  },
  initInstance: function(attrs) {
    this._errors = new ReactiveDict();
  }
});
