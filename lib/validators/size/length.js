Astro.createValidator({
  name: 'length',
  validate: function(fieldValue, fieldName, length) {
    if (_.isNull(fieldValue) || !_.has(fieldValue, 'length')) {
      return false;
    }

    return fieldValue.length === length;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;
      var length = e.data.param;

      e.setMessage(
        'The length of the value of the "' + fieldName +
        '" field has to be ' + length
      );
    }
  }
});
