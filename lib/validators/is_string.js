Astronomy.Validator({
  name: 'isString',
  aliases: ['isStr', 'string', 'str'],
  validate: function(fieldName, value) {
    return _.isString(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" has to be a string';
  }
});
