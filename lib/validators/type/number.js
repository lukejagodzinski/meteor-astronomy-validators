Astro.createValidator({
  name: 'number',
  validate: _.isNumber,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.data.message = 'The value of the "' + fieldName +
        '" field has to be a number';
    }
  }
});
