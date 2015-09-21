Astro.createValidator({
  name: 'regexp',
  validate: function(fieldValue, fieldName, pattern) {
    return pattern.test(fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;
      var pattern = e.data.param.toString();

      e.setMessage(
        'The value of the "' + fieldName +
        '" field has to match the "' + pattern + '" regular expression'
      );
    }
  }
});
