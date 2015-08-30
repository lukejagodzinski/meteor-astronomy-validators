Astro.createValidator({
  name: 'unique',
  validate: function(fieldValue, fieldName) {
    var doc = this;
    var Class = doc.constructor;
    var Collection = Class.getCollection();

    // If a Class is not related with any collection then document is unique.
    if (!Collection) {
      return true;
    }

    // The unique validator is used only during insert operation. If the "_id"
    // fields is present, then object is being updated not inserted.
    if (this._id) {
      return true;
    }

    // Prepare selector.
    var selector = {};
    selector[fieldName] = fieldValue;

    // Check if a record with the given field value exists.
    return _.isUndefined(Collection.findOne(selector));
  },
  events: {
    validationerror: function(e) {
      var fieldName = e.data.fieldName;

      e.data.message = 'The value of the "' + fieldName +
        '" field has to be unique';
    }
  }
});
