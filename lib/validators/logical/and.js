Astro.createValidator({
  name: 'and',
  validate: function(fieldValue, fieldName, validators) {
    var error;

    var isValid = _.every(validators, function(validator, index) {
      try {
        var isValid = validator.call(this, fieldValue, fieldName);
        if (!isValid && !error) {
          error = new ValidationError([{
            validator: validator,
            patternOrFieldName: fieldName,
            fieldValue: fieldValue,
            name: validator.definition.name
          }]);
        }
        return isValid;
      } catch (e) {
        if (!error) {
          error = e;
        }
        return false;
      }
    });

    if (!isValid && error) {
      throw error;
    }

    return isValid;
  }
});
