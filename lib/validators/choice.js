Astro.createValidator({
  name: 'choice',
  aliases: ['oneOf', 'oneof'],
  validate: function(fieldName, value, choices) {
    return _.contains(choices, value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;
    var choices = e.data.options;

    return 'The "' + fieldName + '" has to be one of "' + choices.join('", "') +
      '"';
  }
});
