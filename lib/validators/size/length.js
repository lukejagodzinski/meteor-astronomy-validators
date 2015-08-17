Astro.createValidator({
  name: 'length',
  validate: function(fieldValue, fieldName, length) {
    if (
      _.isUndefined(fieldValue) ||
      _.isNull(fieldValue) ||
      !_.has(fieldValue, 'length')
    ) {
      return false;
    }

    return fieldValue.length === length;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var length = e.data.options;

      e.data.message = 'The "' + fieldName +
        '" field\'s value length has to be ' + length;
    }
  }
});
