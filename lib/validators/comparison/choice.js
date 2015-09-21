Astro.createValidator({
  name: 'choice',
  validate: function(fieldValue, fieldName, choices) {
    return _.contains(choices, fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;
      var choices = e.data.param;

      e.setMessage(
        'The value of the "' + fieldName +
        '" field has to be one of "' + choices.join('", "') + '"'
      );
    }
  }
});
