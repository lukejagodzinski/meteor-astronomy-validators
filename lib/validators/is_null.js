Astronomy.Validator({
  name: 'isNull',
  aliases: ['null'],
  validate: function(value, undefined, fieldName) {
    return _.isNull(value);
  },
  message: function(value, undefined, fieldName) {
    return 'The "' + fieldName + '" has to be empty';
  }
});
