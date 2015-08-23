var checks = {
  field: function(fieldName) {
    var Class = this;
    if (!Class.hasField(fieldName)) {
      throw new Error(
        'The validator\'s field name in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }
  },

  validator: function(fieldName, validator) {
    if (!Match.test(validator, Match.OneOf(Function, [Function]))) {
      throw new Error(
        'The validator for the "' + fieldName +
        '" field in the "' + this.getName() +
        '" class schema has to be a function or an array of functions'
      );
    }
  },

  validators: function(validators) {
    if (!_.isObject(validators)) {
      throw new Error(
        'The validator functions definition in the "' + this.getName() +
        '" class schema has to be an object'
      );
    }
  },

  validationOrder: function(validationOrder) {
    if (!Match.test(validationOrder, [String])) {
      throw new Error(
        'The validation order definition in the "' + this.getName() +
        '" class schema has to be an array of fields names'
      );
    }
  }
};

var methods = {
  hasValidator: function(fieldName) {
    checks.field.call(this, fieldName);

    return _.has(this.schema.validators, fieldName);
  },

  getValidator: function(fieldName) {
    checks.field.call(this, fieldName);

    return this.schema.validators[fieldName];
  },

  getValidators: function(fieldsNames) {
    if (_.isArray(fieldsNames)) {
      return _.pick(this.schema.validators, fieldsNames);
    }
    return this.schema.validators;
  },

  addValidator: function(fieldName, validator) {
    // Check if field name had been provided and is a string.
    checks.field.call(this, fieldName);
    // Check if validator is a function.
    checks.validator.call(this, fieldName, validator);

    this.schema.validators[fieldName] = _.isArray(validator) ?
      Validators.and(validator) : validator;
  },

  addValidators: function(validators) {
    var self = this;

    // Validators data has to be an object.
    checks.validators.call(self, validators);

    // Loop through list of validators data and add each one.
    _.each(validators, function(validator, fieldName) {
      self.addValidator(fieldName, validator);
    });
  },

  setValidationOrder: function(validationOrder) {
    // Check validity of the validation order option.
    checks.validationOrder.call(this, validationOrder);

    this.schema.validationOrder = validationOrder;
  },

  getValidationOrder: function() {
    var Class = this;

    // Create a list of all fields where the fields from the validation order
    // are at the beginning.
    var order = Class.schema.validationOrder;
    if (order) {
      // Get a list of all fields in the class.
      var allFieldsNames = Class.getFieldsNames();
      // Detect what fields are not in the validation order.
      var diff = _.difference(allFieldsNames, order);
      // If not all fields had been included in the validation order, then add
      // them at the and.
      if (diff.length > 0) {
        order = order.concat(diff);
      }
    } else {
      order = Class.getFieldsNames();
    }

    return order;
  }
};

var events = {
  afterSet: function(e) {
    var fieldName = e.data.field;

    // If a validator is defined for given field then clear error message for
    // that field.
    this._errors.delete(fieldName);
  },
  beforeInit: function() {
    var doc = this;

    doc._errors = new ReactiveMap();
  }
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  // Add the "validators" attribute to the schema.
  Class.schema.validators = {};

  // Add validators that are defined next to the field definition.
  _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
    if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'validators')) {
      Class.addValidator(fieldName, fieldDefinition.validators);
    }
  });

  // Add validators that are defined next to the embeded field definition.
  _.each(schemaDefinition.embedOne, function(fieldDefinition, fieldName) {
    if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'validators')) {
      Class.addValidator(fieldName, fieldDefinition.validators);
    }
  });
  _.each(schemaDefinition.embedMany, function(fieldDefinition, fieldName) {
    if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'validators')) {
      Class.addValidator(fieldName, fieldDefinition.validators);
    }
  });

  if (_.has(schemaDefinition, 'validators')) {
    // Add the validation order option to the class.
    Class.addValidators(schemaDefinition.validators);
  }

  if (_.has(schemaDefinition, 'validationOrder')) {
    // Add the validation order option to the class.
    Class.setValidationOrder(schemaDefinition.validationOrder);
  }

  Class.addEvents(events);
});
