var addValidator = function(fieldName, validator) {
  var schema = this;

  schema.validators[fieldName] = validator;
};

Astro.eventManager.on(
  'initSchema', function onInitSchemaValidators(schemaDefinition) {
    var schema = this;

    // Add the "validators" attribute to the schema.
    schema.validators = schema.validators || {};

    if (_.has(schemaDefinition, 'validators')) {
      _.each(schemaDefinition.validators, function(validator, fieldName) {
        addValidator.call(schema, fieldName, validator);
      });
    }

    if (_.has(schemaDefinition, 'validationOrder')) {
      schema.validationOrder = schemaDefinition.validationOrder;
    }
  }
);
