Astro.createValidator({
  name: 'or',
  validate: function(fieldName, value, validators) {
    return _.some(validators, function(validator) {
      return validator.call(this, fieldName, value);
    }, this);
  }
});
