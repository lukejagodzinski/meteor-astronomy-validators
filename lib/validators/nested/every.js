Astro.createValidator({
  name: 'every',
  validate: function(fieldValue, fieldName, fieldValidator) {
    var doc = this;

    if (!_.isArray(fieldValue)) {
      return true;
    }

    return _.every(fieldValue, function(value) {
      return fieldValidator.validate(
        doc,
        fieldName,
        value
      );
    });
  }
});
