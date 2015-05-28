Astro.createValidator({
  name: 'isString',
  aliases: ['isStr', 'string', 'str'],
  validate: _.isString,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be a string';
    }
  }
});
