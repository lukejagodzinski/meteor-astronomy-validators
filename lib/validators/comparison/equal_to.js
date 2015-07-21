Astro.createValidator({
  name: 'equalTo',
  validate: function(fieldValue, fieldName, compareFieldName) {
    var compareValue = this.get(compareFieldName);

    return fieldValue === compareValue;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var compareFieldName = e.data.options;
      var compareValue = this.get(compareFieldName);

      e.data.message = 'The "' + fieldName + '" and "' + compareValue +
        '" field\'s values have to be equal';
    }
  }
});
