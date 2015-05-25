Astro.createValidator({
  name: 'isString',
  aliases: ['isStr', 'string', 'str'],
  validate: function(fieldName, value) {
    return _.isString(value);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be a string';
    }
  }
});
