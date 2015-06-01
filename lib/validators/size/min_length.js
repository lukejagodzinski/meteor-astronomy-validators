Astro.createValidator({
  name: 'minLength',
  validate: function(fieldValue, fieldName, minLength) {
    if (!fieldValue) {
      return false;
    }

    return fieldValue.length >= minLength;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var minLength = e.data.options;

      e.data.message = 'The "' + fieldName +
        '" field\'s value length has to be at least ' + minLength;
    }
  }
});
