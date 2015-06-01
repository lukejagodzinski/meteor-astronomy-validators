Astro.createValidator({
  name: 'lt',
  validate: function(fieldValue, fieldName, compareValue) {
    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return fieldValue < compareValue;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var compareValue = e.data.options;

      if (_.isFunction(compareValue)) {
        compareValue = compareValue.call(this);
      }

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be less than "' + compareValue + '"';
    }
  }
});
