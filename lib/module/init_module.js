var onAfterSet = function(fieldName) {
  // Look for the schema with the validator's definition for the "fieldName"
  // field.
  var schema = _.find(this.constructor.schemas, function(schema) {
    return schema.hasValidator(fieldName);
  });

  if (schema) {
    // If a validator is defined for given field then clear error message for
    // that field.
    this._errors.set(fieldName, undefined);

    // Unset the "hasError" reactive variable so that no errors will be
    // displayed until the next validation process.
    this._hasErrors.set(false);
  }
};

initModule = function() {
  Astro.eventManager.on('afterset', onAfterSet);

  var prototype = Astro.Schema.prototype;

  prototype.hasValidator = function(fieldName) {
    if (!_.isString(fieldName)) {
      return;
    }

    return _.has(this._validators, fieldName);
  };

  prototype.getValidator = function(fieldName) {
    if (!_.isString(fieldName)) {
      return;
    }

    return this._validators[fieldName];
  };

  prototype.getValidators = function() {
    return this._validators;
  };

  prototype.addValidator = function(fieldName, validatorFunction) {
    // Check if field name had been provided and is a string.
    if (!_.isString(fieldName)) {
      throw new Error(
        'The validator\'s field name in the "' + this.getName() +
        '" class ' +
        'schema has to be a string'
      );
    }

    // Check if validator is a function.
    if (!_.isFunction(validatorFunction)) {
      throw new Error(
        'The validator for the field "' + fieldName + '" in the "' +
        this.getName() + '" class schema has to be a function'
      );
    }

    this._validators[fieldName] = validatorFunction;
  };

  prototype.addValidators = function(validatorsData) {
    // Validators data has to be an object.
    if (!_.isObject(validatorsData)) {
      throw new Error(
        'The validators data in the "' + this.getName() +
        '" class schema ' +
        'has to be an object'
      );
    }

    // Loop through list of validators data and add each one.
    _.each(validatorsData, function(validatorFunction, fieldName) {
      this.addValidator(fieldName, validatorFunction);
    }, this);
  };
};
