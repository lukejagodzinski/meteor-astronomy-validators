Astro.createValidator({
  name: 'notNull',
  validate: function(fieldValue) {
    return !_.isNull(fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value can\'t be null';
    }
  }
});
