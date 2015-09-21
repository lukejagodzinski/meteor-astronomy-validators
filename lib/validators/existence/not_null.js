Astro.createValidator({
  name: 'notNull',
  validate: function(fieldValue) {
    return !_.isNull(fieldValue);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.setMessage(
        'The value of the "' + fieldName + '" field can not be null'
      );
    }
  }
});
