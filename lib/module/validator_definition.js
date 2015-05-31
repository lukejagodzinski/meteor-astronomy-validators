var checks = {
  validatorDefinition: function(validatorDefinition) {
    // Check if the validator definition is an object.
    if (!_.isObject(validatorDefinition)) {
      throw new Error('Provide a validator definition');
    }

    // Check if the validator name is provided.
    if (!_.has(validatorDefinition, 'name')) {
      throw new Error('Provide a validator name');
    }

    // Check if the validator name is a string.
    if (!_.isString(validatorDefinition.name)) {
      throw new Error('The validator name has to be a string');
    }

    // Check if the validator with the given name already exists.
    if (_.has(Validators, validatorDefinition.name)) {
      throw new Error('Validator with the name `' + validatorDefinition.name +
        '` is already defined');
    }

    // Check if the validation function is provided.
    if (!_.has(validatorDefinition, 'validate')) {
      throw new Error('Provide the `validate` function');
    }

    // Check if the `validate` attribute is function.
    if (!_.isFunction(validatorDefinition.validate)) {
      throw new Error('The `validate` attribute has to be a function');
    }
  }
};

ValidatorDefinition = function(validatorDefinition) {
  checks.validatorDefinition(validatorDefinition);

  var self = this;

  self.name = validatorDefinition.name;
  self.validate = validatorDefinition.validate;

  if (_.has(validatorDefinition, 'events')) {
    _.each(validatorDefinition.events, function(eventHandler, eventName) {
      self.on(eventName, eventHandler);
    });
  }
};

Astro.Events.mixin(ValidatorDefinition.prototype);
