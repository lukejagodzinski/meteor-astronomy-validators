var checkFieldName = function(fieldName) {
  if (!this.hasField(fieldName)) {
    throw new Error(
      'The "' + fieldName +
      '" field does not exist in the "' + this.getName() + '" class'
    );
  }
};

var checkValidator = function(fieldName, validator) {
  if (!Match.test(
    validator,
    Match.OneOf(Function, Astro.FieldValidator, [Astro.FieldValidator])
  )) {
    throw new TypeError(
      'The validator for the "' + fieldName +
      '" field in the "' + this.getName() + '" class schema has to be a ' +
      'function or an array of validators or a single validator object'
    );
  }
};

var checkValidatorsList = function(validators) {
  if (!Match.test(validators, Object)) {
    throw new TypeError(
      'The validators definitions in the "' + this.getName() +
      '" class schema has to be an object'
    );
  }
};

var checkValidationOrder = function(validationOrder) {
  if (!Match.test(validationOrder, [String])) {
    throw new TypeError(
      'The validation order definition in the "' + this.getName() +
      '" class schema has to be an array of fields names'
    );
  }
};

var methods = {
  hasValidator: function(fieldName) {
    return _.has(this.schema.validators, fieldName);
  },

  getValidator: function(fieldName) {
    return this.schema.validators[fieldName];
  },

  getValidators: function(fieldsNames) {
    if (_.isArray(fieldsNames)) {
      return _.pick(this.schema.validators, fieldsNames);
    }
    return this.schema.validators;
  },

  addValidator: function(fieldName, validator) {
    checkFieldName.call(this, fieldName);
    checkValidator.call(this, fieldName, validator);

    this.schema.validators[fieldName] = _.isArray(validator) ?
      Validators.and(validator) : validator;
  },

  addValidators: function(validators) {
    checkValidatorsList.call(this, validators);
    var self = this;

    // Loop through list of validators data and add each one.
    _.each(validators, function(validator, fieldName) {
      self.addValidator(fieldName, validator);
    });
  },

  setValidationOrder: function(validationOrder) {
    checkValidationOrder.call(this, validationOrder);

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
    if (this._errors) {
      this._errors.delete(fieldName);
    }
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
