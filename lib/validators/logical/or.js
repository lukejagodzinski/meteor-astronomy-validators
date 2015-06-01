Astro.createValidator({
  name: 'or',
  validate: function(fieldValue, validators, fieldName) {
    return _.some(validators, function(validator) {
      return validator.call(this, fieldValue, fieldName);
    }, this);
  }
});
