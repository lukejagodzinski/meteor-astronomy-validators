Astro.createValidator({
  name: 'maxLength',
  validate: function(fieldValue, fieldName, maxLength) {
    if (_.isNull(fieldValue) || !_.has(fieldValue, 'length')) {
      return false;
    }

    return fieldValue.length <= maxLength;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;
      var maxLength = e.data.param;

      e.setMessage(
        'The length of the value of the "' + fieldName +
        '" field has to be at most ' + maxLength
      );
    }
  }
});
