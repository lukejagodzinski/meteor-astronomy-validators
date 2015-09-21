Astro.createValidator({
  name: 'contains',
  validate: function(fieldValue, fieldName, sought) {
    if (!(_.isArray(fieldValue) || _.isObject(fieldValue))) {
      return false;
    }

    return _.contains(fieldValue, sought);
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;
      var sought = e.data.param;

      e.setMessage(
        'The value of the "' + fieldName +
        '" field has to contain the "' + sought + '" value'
      );
    }
  }
});
