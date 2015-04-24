Astronomy.Validator({
  name: 'minLength',
  aliases: ['minLen', 'minlen'],
  validate: function(value, minLength) {
    return value.length >= minLength;
  },
  message: function(value, minLength, fieldName) {
    return 'The "' + fieldName + '" length has to be at least ' + minLength;
  }
});
