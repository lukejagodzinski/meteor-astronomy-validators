Astronomy.Validator({
  name: 'isNotNull',
  aliases: ['notNull', 'notnull', 'required'],
  validate: function(value, undefined, fieldName) {
    return !_.isNull(value);
  },
  message: function(value, undefined, fieldName) {
    return 'The "' + fieldName + '" can not to be null';
  }
});
