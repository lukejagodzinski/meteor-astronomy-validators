Astronomy.Validator({
  name: 'isEmail',
  aliases: ['email'],
  validate: function(fieldName, value) {
    // Create email regular expression.
    var re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

    return re.test(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" has to be an appropiate email address';
  }
});
