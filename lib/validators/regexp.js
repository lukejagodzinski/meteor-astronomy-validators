Astronomy.Validator({
  name: 'regExp',
  aliases: ['regexp', 'regex', 're'],
  validate: function(fieldName, value, pattern) {
    return pattern.test(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;
    var pattern = e.data.options.toString();

    return 'The "' + fieldName + '" has to match "' + pattern +
      '" regular expression';
  }
});
