Astronomy.Validator({
  name: 'isNull',
  aliases: ['null'],
  validate: function(fieldName, value) {
    return _.isNull(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" has to be empty';
  }
});
