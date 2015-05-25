Astro.createValidator({
  name: 'isDate',
  aliases: ['date'],
  validate: function(fieldName, value) {
    return _.isDate(value);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be a date';
    }
  }
});
