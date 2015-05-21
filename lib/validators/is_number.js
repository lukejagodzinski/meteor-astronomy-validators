Astro.createValidator({
  name: 'isNumber',
  aliases: ['isNum', 'number', 'num'],
  validate: function(fieldName, value) {
    return _.isNumber(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" has to be a number';
  }
});
