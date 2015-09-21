Astro.createValidator({
  name: 'object',
  validate: _.isObject,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.setMessage(
        'The value of the "' + fieldName + '" field has to be an object'
      );
    }
  }
});
