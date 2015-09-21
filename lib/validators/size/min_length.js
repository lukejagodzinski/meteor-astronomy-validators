Astro.createValidator({
  name: 'minLength',
  validate: function(fieldValue, fieldName, minLength) {
    if (_.isNull(fieldValue) || !_.has(fieldValue, 'length')) {
      return false;
    }

    return fieldValue.length >= minLength;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;
      var minLength = e.data.param;

      e.setMessage(
        'The length of the value of the "' + fieldName +
        '" field has to be at least ' + minLength
      );
    }
  }
});
