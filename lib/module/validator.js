Astro.Validator = function(validatorDefinition) {
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

  // Validator definition is just a description of validator. For each validator
  // we have to create function that makes use of it.
  Validators[validatorDefinition.name] = function(options, message) {
    // When using validator in schema, developer will pass some options to
    // validator. We collect here these options and return function that have
    // access to them. Developer can also pass custom message (second argument)
    // which will be thrown instead of one defined in the validator definition.

    return function(value, fieldName) {
      // This function is executed when validation actually takes place.

      // We build array of params in order: value, options, fieldName.
      // Such array of params will be passed to the `validate` and `message`
      // methods provided in the validator definition.
      var args = [value];
      args.push(options);
      args.push(fieldName);

      if (!validatorDefinition.validate.apply(this, args)) {
        var eventManager = this.constructor.schema._eventManager;
        var eventMessage = eventManager.emit('validationerror', {
          validator: validatorDefinition.name,
          value: value,
          field: fieldName
        }, this);

        // If custom user message was not defined, then we have to check whether
        // validator has `message` function or string.
        if (_.isUndefined(message) || _.isNull(message)) {
          if (_.isFunction(validatorDefinition.message)) {
            message = validatorDefinition.message.apply(this, args);
          } else if (_.isString(validatorDefinition.message)) {
            message = validatorDefinition.message;
          }
        } else if (_.isFunction(message)) {
          message = message.apply(this, args);
        }

        throw new ValidationError(message);
      }

      return true;
    };
  };

  // Add aliases.
  if (
    _.has(validatorDefinition, 'aliases') &&
    _.isArray(validatorDefinition.aliases)
  ) {
    _.each(validatorDefinition.aliases, function(alias) {
      Validators[alias] = Validators[validatorDefinition.name];
    });
  }

  // We also return created validator if someone would like not to use long
  // default namespace which is e.g. `Validators.isString`.
  return Validators[validatorDefinition.name];
};
