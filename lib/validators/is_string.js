Astronomy.Validator({
  name: 'isString',
  aliases: ['isStr', 'string', 'str'],
  validate: function(value, undefined, fieldName) {
    return _.isString(value);
  },
  message: function(value, undefined, fieldName) {
    return 'The "' + fieldName + '" has to be a string';
  }
});
