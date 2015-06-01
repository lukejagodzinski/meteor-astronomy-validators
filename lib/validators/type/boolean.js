Astro.createValidator({
  name: 'boolean',
  validate: _.isBoolean,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be a boolean';
    }
  }
});
