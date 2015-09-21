Astro.createValidator({
  name: 'required',
  validate: function(fieldValue) {
    return !_.isNull(fieldValue) && fieldValue !== '';
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.setMessage(
        'The value of the "' + fieldName + '" field is required'
      );
    }
  }
});
