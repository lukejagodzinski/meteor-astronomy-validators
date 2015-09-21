Astro.createValidator({
  name: 'string',
  validate: _.isString,
  events: {
    validationError: function(e) {
      var fieldName = e.data.fieldName;

      e.setMessage(
        'The value of the "' + fieldName + '" field has to be a string'
      );
    }
  }
});
