Astronomy.Validator({
  name: 'minLength',
  aliases: ['minLen', 'minlen'],
  validate: function(value, minLength) {
    if (!value) {
      return false;
    }

    return value.length >= minLength;
  },
  message: function(value, minLength, fieldName) {
    return 'The "' + fieldName + '" length has to be at least ' + minLength;
  }
});
