Astronomy.Validator({
  name: 'lessThan',
  aliases: ['lt'],
  validate: function(value, compareValue, fieldName) {
    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return value < compareValue;
  },
  message: function(value, compareValue, fieldName) {
    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return 'The "' + fieldName + '" has to be less than "' + compareValue +
      '"';
  }
});
