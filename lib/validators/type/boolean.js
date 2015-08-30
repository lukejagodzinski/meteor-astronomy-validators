Astro.createValidator({
  name: 'boolean',
  validate: _.isBoolean,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.data.message = 'The value of the "' + fieldName +
        '" field has to be a boolean';
    }
  }
});
