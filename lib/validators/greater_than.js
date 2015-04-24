Astronomy.Validator({
  name: 'greaterThan',
  aliases: ['gt'],
  validate: function(value, compareValue, fieldName) {
    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return value > compareValue;
  },
  message: function(value, compareValue, fieldName) {
    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return 'The "' + fieldName + '" has to be greater than "' +
      compareValue + '"';
  }
});
