Astro.createValidator({
  name: 'lessThan',
  aliases: ['lt'],
  validate: function(fieldName, value, compareValue) {
    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return value < compareValue;
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;
    var compareValue = e.data.options;

    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return 'The "' + fieldName + '" field\'s value has to be less than "' +
      compareValue + '"';
  }
});
