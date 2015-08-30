Astro.createValidator({
  name: 'date',
  validate: _.isDate,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.data.message = 'The value of the "' + fieldName +
        '" field has to be a date';
    }
  }
});
