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
  'initDefinition', function onInitDefinitionValidators(subSchema) {
    var Class = this;
    var validatorsDefinitions = {};
    var validationOrder;
    var schemaDefinition = subSchema.definition;

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
      subSchema.validators = validatorsDefinitions;
    }
    if (validationOrder) {
      subSchema.validationOrder = validationOrder;
    }
  }
);
