Astronomy.Validator({
  name: 'hasProperty',
  aliases: ['has', 'hasProp'],
  validate: function(value, propertyName) {
    return _.has(value, propertyName);
  },
  message: function(value, propertyName, fieldName) {
    return 'The "' + fieldName + '" has to have "' + propertyName +
      '" property';
  }
});
