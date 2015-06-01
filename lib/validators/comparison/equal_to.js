Astro.createValidator({
  name: 'equalTo',
  validate: function(fieldValue, compareFieldName, fieldName) {
    var compareValue = this.get(compareFieldName);

    return fieldValue === compareValue;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var compareValue = e.data.options;

      if (_.isFunction(compareValue)) {
        compareValue = compareValue.call(this);
      }

      e.data.message = 'The "' + fieldName + '" and "' + compareValue +
        '" field\'s values have to be equal';
    }
  }
});
