Astro.createValidator({
  name: 'date',
  validate: function(fieldValue) {
    return _.isDate(fieldValue) && !_.isNaN(fieldValue.valueOf());
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.setMessage(
        'The value of the "' + fieldName + '" field has to be a date'
      );
    }
  }
});
