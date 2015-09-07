Astro.createValidator({
  name: 'number',
  validate: function(fieldValue) {
    return !_.isNaN(fieldValue) && _.isNumber(fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.data.message = 'The value of the "' + fieldName +
        '" field has to be a number';
    }
  }
});
