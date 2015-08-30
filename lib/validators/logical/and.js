Astro.createValidator({
  name: 'and',
  validate: function(fieldValue, fieldName, fieldValidators) {
    var doc = this;

    return _.every(fieldValidators, function(fieldValidator) {
      return fieldValidator.validate(
        doc, fieldName, fieldValue
      );
    });
  }
});
