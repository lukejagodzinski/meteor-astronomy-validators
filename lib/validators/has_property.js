Astro.createValidator({
  name: 'hasProperty',
  aliases: ['has', 'hasProp'],
  validate: function(fieldName, value, propertyName) {
    return _.has(value, propertyName);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;
    var propertyName = e.data.options;

    return 'The "' + fieldName + '" has to have "' + propertyName +
      '" property';
  }
});
