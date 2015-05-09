Astronomy.Validator({
  name: 'isArray',
  aliases: ['isarray', 'array'],
  validate: function(fieldName, value) {
    return _.isArray(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" has to be an array';
  }
});
