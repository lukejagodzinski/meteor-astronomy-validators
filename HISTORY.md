# 1.1.2 (2015-11-25)

- Removes all existing errors for a field on validation, if it's optional and now changed to null

# 1.1.1 (2015-10-31)

- Removed the `ui` package to not load `blaze` and `jquery` packages unnecessary

# 1.1.0 (2015-10-28)

- Ability to validate nested fields from the top level document.
  - Now you can do `doc.validate('field.nestedField')`
  - Now you can do `doc.getValidationError('field.nestedField')`
  - Now you can do `doc.hasValidationError('field.nestedField')`
  - All the following methods also work with the nested fields: `doc.getValidationErrors()`, `doc.hasValidationErrors()`, `doc.clearValidationErrors()`, `doc.throwValidationException()`, `doc.catchValidationException()`

# 1.0.4 (2015-10-11)

- Use ReactiveMap 2.0

# 1.0.3 (2015-10-08)

- Fixed wrong property name in the `afterSet` event

# 1.0.2 (2015-10-02)

- Fixed validation error when no validators defined

# 1.0.1 (2015-10-01)

- Don't use the `initSchema` event for the validators module

# 1.0.0 (2015-09-28)
