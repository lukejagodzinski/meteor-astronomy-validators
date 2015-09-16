Astro.createValidator({
  name: 'if',
  validate: function(fieldValue, fieldName, options) {
    var doc = this;

    if (!_.has(options, 'condition') || !_.isFunction(options.condition)) {
      throw new Error(
        'The "condition" option in the "if" validator is required'
      );
    }

    if (
      !_.has(options, 'true') || !options.true instanceof Astro.FieldValidator
    ) {
      throw new Error(
        'The "true" option in the "if" validator is required'
      );
    }

    if (options.condition.call(doc, fieldValue, fieldName)) {
      return options.true.validate(doc, fieldName, fieldValue);
    }

    if (
      _.has(options, 'false') &&
      options.false instanceof Astro.FieldValidator
    ) {
      return options.false.validate(doc, fieldName, fieldValue);
    }

    return true;
  }
});
