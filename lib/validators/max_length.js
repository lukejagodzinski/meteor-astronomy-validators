Astro.createValidator({
  name: 'maxLength',
  aliases: ['maxLen', 'maxlen'],
  validate: function(fieldName, value, maxLength) {
    if (!value) {
      return false;
    }

    return value.length <= maxLength;
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;
    var maxLength = e.data.options;

    return 'The "' + fieldName +
      '" field\'s value length has to be at most ' + maxLength;
  }
});
