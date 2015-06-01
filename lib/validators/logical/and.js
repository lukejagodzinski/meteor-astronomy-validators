Astro.createValidator({
  name: 'and',
  validate: function(fieldValue, fieldName, validators) {
    return _.every(validators, function(validator) {
      return validator.call(this, fieldValue, fieldName);
    }, this);
  }
});
