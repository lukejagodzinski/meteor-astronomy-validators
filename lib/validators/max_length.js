Astro.createValidator({
  name: 'maxLength',
  aliases: ['maxLen', 'maxlen'],
  validate: function(fieldValue, maxLength, fieldName) {
    if (!fieldValue) {
      return false;
    }

    return fieldValue.length <= maxLength;
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var maxLength = e.data.options;

      e.data.message = 'The "' + fieldName +
        '" field\'s value length has to be at most ' + maxLength;
    }
  }
});
