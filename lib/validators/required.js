Astro.createValidator({
  name: 'required',
  validate: function(fieldValue, options, fieldName) {
    return !_.isNull(fieldValue) && fieldValue !== '';
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value is required';
    }
  }
});
