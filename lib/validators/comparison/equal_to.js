Astro.createValidator({
  name: 'equalTo',
  validate: function(fieldValue, fieldName, compareFieldName) {
    var compareValue = this.get(compareFieldName);

    return fieldValue === compareValue;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;
      var compareFieldName = e.data.param;
      var compareValue = this.get(compareFieldName);

      e.setMessage(
        'The values of the "' + fieldName + '" and "' +
        compareValue + '" fields have to be equal'
      );
    }
  }
});
