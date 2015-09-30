
Astro.eventManager.on(
  'initSchema', function onInitSchemaValidators(schemaDefinition) {
    var schema = this;

    // Add the "validators" attribute to the schema.
    schema.validators = schema.validators || {};

    if (_.has(schemaDefinition, 'validators')) {
      _.extend(schema.validators, schemaDefinition.validators);
    }

    if (_.has(schemaDefinition, 'validationOrder')) {
      schema.validationOrder = schemaDefinition.validationOrder;
    }
  }
);
