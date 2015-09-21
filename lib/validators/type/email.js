Astro.createValidator({
  name: 'email',
  validate: function(fieldValue) {
    // Create email regular expression.
    var re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

    return re.test(fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.setMessage(
        'The value of the "' + fieldName +
        '" field has to be an appropiate email address'
      );
    }
  }
});
