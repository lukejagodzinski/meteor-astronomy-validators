Astro.createValidator({
  name: 'regExp',
  aliases: ['regexp', 'regex', 're'],
  validate: function(fieldName, value, pattern) {
    return pattern.test(value);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var pattern = e.data.options.toString();

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to match "' + pattern +
        '" regular expression';
    }
  }
});
