Astro.createValidator({
  name: 'isDate',
  aliases: ['date'],
  validate: function(fieldName, value) {
    return _.isDate(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" field\'s value has to be a date';
  }
});
