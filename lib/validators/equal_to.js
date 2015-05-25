Astro.createValidator({
  name: 'equalTo',
  aliases: ['eqTo', 'eqt'],
  validate: function(fieldName, value, compareFieldName) {
    var compareValue = this.get(compareFieldName);

    return value === compareValue;
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
