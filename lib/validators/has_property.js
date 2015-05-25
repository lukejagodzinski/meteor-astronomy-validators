Astro.createValidator({
  name: 'hasProperty',
  aliases: ['has', 'hasProp'],
  validate: function(fieldName, value, propertyName) {
    return _.has(value, propertyName);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var propertyName = e.data.options;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to have "' + propertyName + '" property';
    }
  }
});
