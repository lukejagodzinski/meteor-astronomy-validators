Astronomy.Validator({
  name: 'isDate',
  aliases: ['date'],
  validate: function(fieldName, value) {
    return _.isDate(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" has to be a date';
  }
});
