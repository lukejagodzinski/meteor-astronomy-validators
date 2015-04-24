Astronomy.Validator({
  name: 'equalTo',
  aliases: ['eqTo', 'eqt'],
  validate: function(value, compareFieldName, fieldName) {
    var compareValue = this.get(compareFieldName);

    return value === compareValue;
  },
  message: function(value, compareValue, fieldName) {
    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return 'The "' + fieldName + '" and "' + compareValue + '" fields have ' +
      'to be equal';
  }
});
