var checkValidatorDefinition = function(
  validatorDefinition, fieldName, className
) {
  // checkFieldName.call(this, fieldName);
  // checkValidator.call(this, fieldName, validator);
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionValidators(schemaDefinition) {
    var className = schemaDefinition.className;

    var validators = {};

    if (_.has(schemaDefinition, 'fields')) {
      _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
        if (_.has(fieldDefinition, 'validators')) {
          var validator = fieldDefinition.validators;

          if (_.isFunction(validator)) {
          } else if (_.isArray(validator)) {
            validator = Validators.and(validator);
          }

          if (_.isObject(validator)) {
            // Check validity of the validator definition.
            checkValidatorDefinition(validator, fieldName, className);
            validators[fieldName] = validator;
          }
        }
      });
    }

    if (_.has(schemaDefinition, 'validators')) {
      _.each(schemaDefinition.validators, function(validator, fieldName) {
        var validator;

        if (_.isFunction(validator)) {
        } else if (_.isArray(validator)) {
          validator = Validators.and(validator);
        }

        if (_.isObject(validator)) {
          // Check validity of the validator definition.
          checkValidatorDefinition(validator, fieldName, className);
          validators[fieldName] = validator;
        }
      });
    }

    schemaDefinition.validators = validators;
  }
);
