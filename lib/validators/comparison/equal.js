Astro.createValidator({
  name: 'equal',
  validate: function(fieldValue, fieldName, compareValue) {
    return fieldValue === compareValue;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var compareValue = e.data.options;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be equal "' + compareValue + '"';
    }
  }
});
