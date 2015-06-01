Astro.createValidator({
  name: 'null',
  validate: _.isNull,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be null';
    }
  }
});
