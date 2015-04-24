Astronomy.Validator({
  name: 'choice',
  aliases: ['oneOf', 'oneof'],
  validate: function(value, choices, fieldName) {
    return _.contains(choices, value);
  },
  message: function(value, choices, fieldName) {
    return 'The "' + fieldName + '" has to be one of "' + choices.join('", "') +
      '"';
  }
});
