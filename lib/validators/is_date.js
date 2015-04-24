Astronomy.Validator({
  name: 'isDate',
  aliases: ['date'],
  validate: function(value, undefined, fieldName) {
    return _.isDate(value);
  },
  message: function(value, undefined, fieldName) {
    return 'The "' + fieldName + '" has to be a date';
  }
});
