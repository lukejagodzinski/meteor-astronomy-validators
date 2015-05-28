Astro.createValidator = function(validatorDefinition) {
  var definition = new ValidatorDefinition(validatorDefinition);

  var validatorGenerator = function(options, userMessage) {
    var validator = function(fieldValue, fieldName) {
      return validator.definition.validate.call(
        this,
        fieldValue,
        options,
        fieldName
      );
    };

    _.extend(validator, {
      definition: definition,
      options: options,
      message: userMessage
    });

    return validator;
  };

  // Validator is just a function with the "definition" property where all the
  // validator definition is stored.
  Validators[definition.name] = validatorGenerator;

  // Add aliases.
  if (_.isArray(definition.aliases)) {
    _.each(definition.aliases, function(alias) {
      Validators[alias] = validatorGenerator;
    });
  }

  // We also return created validator if someone would like not to use long
  // default namespace which is e.g. `Validators.isString`.
  return validatorGenerator;
};
