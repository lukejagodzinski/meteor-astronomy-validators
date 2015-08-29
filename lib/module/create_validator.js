var checkCreateValidator = function(validatorDefinition) {
  // Check if the validator definition is an object.
  if (!_.isObject(validatorDefinition)) {
    Astro.errors.throw('validators.provide_definition');
  }
  // Check if the validator name is provided.
  if (!_.has(validatorDefinition, 'name')) {
    Astro.errors.throw('validators.provide_name');
  }
  // Check if the validator name is a string.
  if (!_.isString(validatorDefinition.name)) {
    Astro.errors.throw('validators.name_is_string');
  }
  // Check if the validator with the given name already exists.
  if (_.has(Validators, validatorDefinition.name)) {
    Astro.errors.throw('validators.already_exist', validatorDefinition.name);
  }
  // Check if the validation function is provided.
  if (!_.has(validatorDefinition, 'validate')) {
    Astro.errors.throw('validators.provide_validate_function');
  }
  // Check if the "validate" attribute is function.
  if (!_.isFunction(validatorDefinition.validate)) {
    Astro.errors.throw('validators.validate_is_function');
  }
};

Astro.createValidator = function(validatorDefinition) {
  checkCreateValidator.apply(this, arguments);

  var definition = new ValidatorDefinition(validatorDefinition);

  var validatorGenerator = function(options, userMessage) {
    var validateFunction = function(fieldValue, fieldName) {
      var doc = this;
      var calcOptions;

      if (_.isFunction(options)) {
        calcOptions = options.call(doc);
      } else {
        calcOptions = options;
      }

      return validateFunction.definition.validate.call(
        doc,
        fieldValue,
        fieldName,
        calcOptions, // Validator options passed by user.
        validateFunction // Parent validator.
      );
    };

    _.extend(validateFunction, {
      definition: definition,
      options: options,
      message: userMessage
    });

    return validateFunction;
  };

  // Validator is just a function with the "definition" property where all the
  // validator definition is stored.
  Validators[definition.name] = validatorGenerator;

  // We also return created validator if someone would like not to use long
  // default namespace which is e.g. `Validators.isString`.
  return validatorGenerator;
};
