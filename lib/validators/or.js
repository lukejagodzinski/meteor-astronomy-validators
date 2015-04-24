Astronomy.Validator({
  name: 'or',
  validate: function(value, validators, fieldName) {
    return _.some(validators, function(validator) {
      return validator.call(this, value, fieldName);
    }, this);
  }
});
