Astro.createValidator({
  name: 'isNumber',
  aliases: ['isNum', 'number', 'num'],
  validate: _.isNumber,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be a number';
    }
  }
});
