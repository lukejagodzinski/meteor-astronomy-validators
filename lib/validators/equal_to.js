Astronomy.Validator({
  name: 'equalTo',
  aliases: ['eqTo', 'eqt'],
  validate: function(fieldName, value, compareFieldName) {
    var compareValue = this.get(compareFieldName);

    return value === compareValue;
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;
    var compareValue = e.data.options;

    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return 'The "' + fieldName + '" and "' + compareValue + '" fields have ' +
      'to be equal';
  }
});
