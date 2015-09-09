var checkValidatorDefinition = function(validatorDefinition) {
  // Check if the validator definition is an object.
  if (!Match.test(validatorDefinition, Object)) {
    throw new Error(
      'The validator definition has to be an object'
    );
  }
  // Check if the validator name is provided.
  if (!_.has(validatorDefinition, 'name')) {
    throw new Error(
      'Provide a validator name'
    );
  }
  // Check if the validator name is a string.
  if (!Match.test(validatorDefinition.name, String)) {
    throw new Error(
      'The validator name has to be a string'
    );
  }
  // Check if the validator with the given name already exists.
  if (_.has(Validators, validatorDefinition.name)) {
    throw new Error(
      'Validator with the name "' + validatorDefinition.name +
      '" is already defined'
    );
  }
  // Check if the validation function is provided.
  if (!_.has(validatorDefinition, 'validate')) {
    throw new Error(
      'Provide the "validate" function'
    );
  }
  // Check if the "validate" attribute is function.
  if (!Match.test(validatorDefinition.validate, Function)) {
    throw new Error(
      'The "validate" attribute has to be a function'
    );
  }
};

var Validator = Astro.Validator = function Validator(validatorDefinition) {
  checkValidatorDefinition.apply(this, arguments);
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
