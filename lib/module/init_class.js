var checks = {
  pattern: function(pattern) {
    if (!Match.test(pattern, String)) {
      throw new Error(
        'The validator\'s field name in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }
  },

  validator: function(pattern, validator) {
    if (!Match.test(validator, Match.OneOf(Function, [Function]))) {
      throw new Error(
        'The validator for the "' + pattern +
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
  hasValidator: function(pattern) {
    checks.pattern.call(this, pattern);

    return _.has(this.schema.validators, pattern);
  },

  getValidator: function(pattern) {
    checks.pattern.call(this, pattern);

    return this.schema.validators[pattern];
  },

  getValidators: function() {
    return this.schema.validators;
  },

  addValidator: function(pattern, validator) {
    // Check if field name had been provided and is a string.
    checks.pattern.call(this, pattern);
    // Check if validator is a function.
    checks.validator.call(this, pattern, validator);

    this.schema.validators[pattern] = _.isArray(validator) ?
      Validators.and(validator) : validator;
  },

  addValidators: function(validators) {
    var self = this;

    // Validators data has to be an object.
    checks.validators.call(self, validators);

    // Loop through list of validators data and add each one.
    _.each(validators, function(validator, pattern) {
      self.addValidator(pattern, validator);
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
    var pattern = e.data.field;

    // If a validator is defined for given field then clear error message for
    // that field.
    this._errors.delete(pattern);
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
    function(fieldDefinition, pattern) {
      if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'validators')) {
        Class.addValidator(pattern, fieldDefinition.validators);
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
