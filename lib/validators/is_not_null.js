Astro.createValidator({
  name: 'isNotNull',
  aliases: ['notNull', 'notnull', 'required'],
  validate: function(fieldName, value) {
    return !_.isNull(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" is required';
  }
});
