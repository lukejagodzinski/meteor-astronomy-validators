Astronomy.Validator({
  name: 'isEmail',
  aliases: ['email'],
  validate: function(value, undefined, fieldName) {
    // Create email regular expression.
    var re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

    return re.test(value);
  },
  message: function(value, undefined, fieldName) {
    return 'The "' + fieldName + '" has to be an appropiate email address';
  }
});
