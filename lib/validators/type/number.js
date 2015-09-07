Astro.createValidator({
  name: 'number',
  validate: function() {
    return !_.isNaN(value) && _.isNumber(value);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.data.message = 'The value of the "' + fieldName +
        '" field has to be a number';
    }
  }
});
