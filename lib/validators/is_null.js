Astro.createValidator({
  name: 'isNull',
  aliases: ['null'],
  validate: function(fieldName, value) {
    return _.isNull(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" field\'s value has to be empty';
  }
});
