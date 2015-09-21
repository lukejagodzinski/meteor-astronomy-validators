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
      var fieldName = e.data.fieldName;
      var propertyName = e.data.param;

      e.setMessage(
        'The value of the "' + fieldName +
        '" field has to have "' + propertyName + '" property'
      );
    }
  }
});
