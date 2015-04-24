Astronomy.Validator({
  name: 'and',
  validate: function(value, validators, fieldName) {
    return _.all(validators, function(validator) {
      return validator.call(this, value, fieldName);
    }, this);
  }
});
