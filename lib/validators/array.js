Astro.createValidator({
  name: 'array',
  validate: _.isArray,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be an array';
    }
  }
});
