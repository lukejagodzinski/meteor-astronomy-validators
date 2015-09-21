Astro.createValidator({
  name: 'null',
  validate: _.isNull,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.setMessage(
        'The value of the "' + fieldName + '" field has to be null'
      );
    }
  }
});
