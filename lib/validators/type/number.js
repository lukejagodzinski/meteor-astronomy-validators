Astro.createValidator({
  name: 'number',
  validate: function(fieldValue) {
    return _.isNumber(fieldValue) && !_.isNaN(fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.setMessage(
        'The value of the "' + fieldName + '" field has to be a number'
      );
    }
  }
});
