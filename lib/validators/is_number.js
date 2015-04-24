Astronomy.Validator({
  name: 'isNumber',
  aliases: ['isNum', 'number', 'num'],
  validate: function(value, undefined, fieldName) {
    return _.isNumber(value);
  },
  message: function(value, undefined, fieldName) {
    return 'The "' + fieldName + '" has to be a number';
  }
});
