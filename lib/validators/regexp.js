Astronomy.Validator({
  name: 'regExp',
  aliases: ['regexp', 'regex', 're'],
  validate: function(value, pattern, fieldName) {
    return pattern.test(value);
  },
  message: function(value, pattern, fieldName) {
    return 'The "' + fieldName + '" has to match regular expression';
  }
});
