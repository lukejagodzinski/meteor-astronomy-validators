_.extend(Astro.errors._errors, {
  'validators.validate_all_deprecated': 'ASTRONOMY: The "validateAll()" method is deprecated and will be removed on v1.0 release. Use the "validate(false)" method to run all validators and do not stop after the first error.',
  'validators.field_not_exist': 'The "{0}" field does not exist in the "{1}" class',
  'validators.validator_definition': 'The validator for the "{0}" field in the "{1}" class schema has to be a function or an array of functions',
  'validators.validators_definitions': 'The validators definitions in the "{0}" class schema has to be an object',
  'validators.validation_order': 'The validation order definition in the "{0}" class schema has to be an array of fields names'
});
