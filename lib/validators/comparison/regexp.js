Astro.createValidator({
  name: 'regexp',
  validate: function(fieldValue, fieldName, pattern) {
    return pattern.test(fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var pattern = e.data.options.toString();

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to match "' + pattern +
        '" regular expression';
    }
  }
});
