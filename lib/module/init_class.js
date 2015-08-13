var checks = {
  fieldName: function(fieldName) {
    if (!Match.test(fieldName, String)) {
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
    if (!Match.test(validators, Object)) {
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
        '" class schema has to be an array of strings'
      );
    }
  }
};

var methods = {
  hasValidator: function(fieldName) {
    checks.fieldName.call(this, fieldName);

    return _.has(this.schema.validators, fieldName);
  },

  getValidator: function(fieldName) {
    checks.fieldName.call(this, fieldName);

    return this.schema.validators[fieldName];
  },

  getValidators: function() {
    return this.schema.validators;
  },

  addValidator: function(fieldName, validators) {
    // Check if field name had been provided and is a string.
    checks.fieldName.call(this, fieldName);
    // Check if validator is a function.
    checks.validator.call(this, fieldName, validators);

    this.schema.validators[fieldName] = this.schema.validators[fieldName] || [];
    this.schema.validators[fieldName] = this.schema.validators[fieldName].
    concat(validators);
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
    return this.schema.validationOrder;
  }
};

var events = {
  afterSet: function(e) {
    var fieldName = e.data.field;

    // If a validator is defined for given field then clear error message for
    // that field.
    this._errors.delete(fieldName);
  }
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  // Add the "validators" attribute to the schema.
  Class.schema.validators = {};

  // Add validators that are defined next to the field definition.
  _.each(
    schemaDefinition.fields,
    function(fieldDefinition, fieldName) {
      if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'validators')) {
        Class.addValidator(fieldName, fieldDefinition.validators);
      }
    }
  );

  if (_.has(schemaDefinition, 'validators')) {
    Class.addValidators(schemaDefinition.validators);

    // Add "afterset" event to all classes having validators.
    Class.addEvents(events);
  }

  if (_.has(schemaDefinition, 'validationOrder')) {
    // Add the validation order option to the class.
    Class.setValidationOrder(schemaDefinition.validationOrder);
  }
});
