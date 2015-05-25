Astro.createValidator({
  name: 'isNotNull',
  aliases: ['notNull', 'notnull', 'required'],
  validate: function(fieldName, value) {
    return !_.isNull(value);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value is required';
    }
  }
});
