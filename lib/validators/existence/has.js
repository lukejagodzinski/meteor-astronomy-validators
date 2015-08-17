Astro.createValidator({
  name: 'has',
  validate: function(fieldValue, fieldName, propertyName) {
    if (!_.isObject(fieldValue)) {
      return false;
    }

    return _.has(fieldValue, propertyName);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;
      var propertyName = e.data.options;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to have "' + propertyName + '" property';
    }
  }
});
