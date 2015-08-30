Astro.createValidator = function(validatorDefinition) {
  var self = this;

  var validator = new Astro.Validator(validatorDefinition);
  Validators[validator.name] = validator.createFieldValidatorGenerator();

  return Validators[validator.name];
};
