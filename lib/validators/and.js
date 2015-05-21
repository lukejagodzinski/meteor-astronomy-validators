Astro.createValidator({
  name: 'and',
  validate: function(fieldName, value, validators) {
    return _.all(validators, function(validator) {
      return validator.call(this, fieldName, value);
    }, this);
  }
});
