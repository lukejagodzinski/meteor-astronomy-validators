_.extend(Astro.errors._errors, {
  'validators.validate_all_deprecated': 'ASTRONOMY: The "validateAll()" method is deprecated and will be removed on v1.0 release. Use the "validate(false)" method to run all validators and do not stop after the first error.',
  'validators.field_not_exist': 'The "{0}" field does not exist in the "{1}" class',
  'validators.validator_definition': 'The validator for the "{0}" field in the "{1}" class schema has to be a function or an array of functions',
  'validators.validators_definitions': 'The validators definitions in the "{0}" class schema has to be an object',
  'validators.validation_order': 'The validation order definition in the "{0}" class schema has to be an array of fields names',
  'validators.provide_definition': 'The validator definition has to be an object',
  'validators.provide_name': 'Provide a validator name',
  'validators.name_is_string': 'The validator name has to be a string',
  'validators.already_exist': 'Validator with the name "{0}" is already defined',
  'validators.provide_validate_function': 'Provide the "validate" function',
  'validators.validate_is_function': 'The "validate" attribute has to be a function'
});
