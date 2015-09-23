var FieldValidator =
Astro.FieldValidator = function FieldValidator(fieldValidatorDefinition) {
  var self = this;

  // self.name = fieldValidatorDefinition.validator.name;
  self.validator = fieldValidatorDefinition.validator;
  self.param = fieldValidatorDefinition.param;
  self.message = fieldValidatorDefinition.message;
};

FieldValidator.prototype.validate = function(doc, fieldName, fieldValue) {
  var self = this;

  // If a function was passed as a validator's param, then it may mean that we
  // want it to evalute to some value.
  var param = _.isFunction(self.param) ? self.param.call(doc) : self.param;

  if (!self.validator.validate.call(doc, fieldValue, fieldName, param)) {
    // Throw error.
    throw new Astro.ValidationError({
      document: doc,
      fieldValidator: self,
      fieldName: fieldName,
      fieldValue: fieldValue,
      param: param
    });
  }

  return true;
};
