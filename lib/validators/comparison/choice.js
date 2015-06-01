Astro.createValidator({
  name: 'choice',
  validate: function(fieldValue, fieldName, choices) {
    return _.contains(choices, fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var choices = e.data.options;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be one of "' + choices.join('", "') +
        '"';
    }
  }
});
