Astro.createValidator({
  name: 'greaterThanOrEqual',
  aliases: ['gte'],
  validate: function(fieldName, value, compareValue) {
    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return value >= compareValue;
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;
    var compareValue = e.data.options;

    if (_.isFunction(compareValue)) {
      compareValue = compareValue.call(this);
    }

    return 'The "' + fieldName +
      '" field\'s value has to be greater than or equal "' + compareValue +
      '"';
  }
});
