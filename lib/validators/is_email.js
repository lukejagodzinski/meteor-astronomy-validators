Astro.createValidator({
  name: 'isEmail',
  aliases: ['email'],
  validate: function(fieldName, value) {
    // Create email regular expression.
    var re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

    return re.test(value);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be an appropiate email address';
    }
  }
});
