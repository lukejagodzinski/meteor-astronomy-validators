var checkValidator = function(validatorDefinition) {
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

var Validator = Astro.Validator = function Validator(validatorDefinition) {
  checkValidator.apply(this, arguments);
  var self = this;

  self.name = validatorDefinition.name;
  self.validate = validatorDefinition.validate;

  if (_.has(validatorDefinition, 'events')) {
    _.each(validatorDefinition.events, function(eventHandler, eventName) {
      self.on(eventName, eventHandler);
    });
  }
};

Validator.prototype.createFieldValidatorGenerator = function() {
  var self = this;

  return function fieldValidatorGenerator(param, message) {
    return new Astro.FieldValidator({
      validator: self,
      param: param,
      message: message
    });
  };
};

Astro.Events.mixin(Validator.prototype);
