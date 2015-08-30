Astro.createValidator({
  name: 'array',
  validate: _.isArray,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.data.message = 'The value of the "' + fieldName +
        '" field has to be an array';
    }
  }
});
