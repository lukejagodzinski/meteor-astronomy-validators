Astro.createValidator({
  name: 'number',
  validate: _.isNumber,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be a number';
    }
  }
});
