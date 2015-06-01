Astro.createValidator({
  name: 'and',
  validate: function(fieldValue, validators, fieldName) {
    return _.every(validators, function(validator) {
      return validator.call(this, fieldValue, fieldName);
    }, this);
  }
});
