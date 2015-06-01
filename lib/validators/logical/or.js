Astro.createValidator({
  name: 'or',
  validate: function(fieldValue, fieldName, validators) {
    return _.some(validators, function(validator) {
      return validator.call(this, fieldValue, fieldName);
    }, this);
  }
});
