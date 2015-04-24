Astronomy.Validator({
  name: 'maxLength',
  aliases: ['maxLen', 'maxlen'],
  validate: function(value, maxLength) {
    return value.length <= maxLength;
  },
  message: function(value, maxLength, fieldName) {
    return 'The "' + fieldName + '" length has to be at most ' + maxLength;
  }
});
