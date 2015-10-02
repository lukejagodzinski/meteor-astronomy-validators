var checkValidator = function(
  validator, fieldName, className
) {
  if (!Match.test(
    validator,
    Match.OneOf(Astro.FieldValidator, [Astro.FieldValidator])
  )) {
    throw new TypeError(
      'The validator for the "' + fieldName +
      '" field in the "' + className + '" class schema has to be a ' +
      'function, an array of validators or a single validator'
    );
  }
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionValidators(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;
    var validatorsDefinitions = {};
    var validationOrder;

    if (_.has(schemaDefinition, 'validationOrder')) {
      validationOrder = [].concat(schemaDefinition.validationOrder);
    }

    if (_.has(schemaDefinition, 'fields')) {
      _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
        if (_.has(fieldDefinition, 'validator')) {
          var validator = fieldDefinition.validator;

          if (_.isArray(validator)) {
            validator = Validators.and(validator);
          }

          if (validator) {
            // Check validity of the validator definition.
            checkValidator(validator, fieldName, Class.getName());
            validatorsDefinitions[fieldName] = validator;
          }
        }
      });
    }

    if (_.has(schemaDefinition, 'validators')) {
      _.each(schemaDefinition.validators, function(validator, fieldName) {
        var validator;

        if (_.isArray(validator)) {
          validator = Validators.and(validator);
        }

        if (validator) {
          // Check validity of the validator definition.
          checkValidator(validator, fieldName, Class.getName());
          validatorsDefinitions[fieldName] = validator;
        }
      });
    }

    if (_.size(validatorsDefinitions) > 0) {
      // Add validators to the schema.
      _.extend(schema.validators, validatorsDefinitions);
    }
    if (validationOrder) {
      // Add validation order to the schema.
      schema.validationOrder = validationOrder;
    }
  }
);
