Astro.createValidator({
  name: 'isNull',
  aliases: ['null'],
  validate: function(fieldName, value) {
    return _.isNull(value);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be empty';
    }
  }
});
