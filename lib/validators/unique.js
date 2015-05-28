Astro.createValidator({
  name: 'unique',
  aliases: ['isUnique'],
  validate: function(fieldValue, options, fieldName) {
    var Collection = this.constructor.getCollection();

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
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be unique';
    }
  }
});
