Astro.createValidator({
  name: 'or',
  validate: function(fieldValue, fieldName, fieldValidators) {
    var doc = this;
    var error;
    var doc = this;

    if (!_.some(fieldValidators, function(fieldValidator) {
      try {
        return fieldValidator.validate(
          doc, fieldName, fieldValue
        );
      } catch (e) {
        if (e instanceof Astro.ValidationError) {
          // We get the first error that occured. We will throw it again if
          // there are no validators that pass.
          if (!error) {
            error = e;
          }
          return false;
        } else {
          throw e;
        }
      }
    })) {
      throw error;
    }

    return true;
  }
});
