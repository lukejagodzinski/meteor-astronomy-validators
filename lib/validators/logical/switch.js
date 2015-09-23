Astro.createValidator({
  name: 'switch',
  validate: function(fieldValue, fieldName, options) {
    var doc = this;

    if (!_.has(options, 'cases') || !_.isObject(options.cases)) {
      throw new Error(
        'The "cases" option in the "switch" validator is required'
      );
    }

    if (_.has(options, 'expression') && !_.isFunction(options.expression)) {
      throw new Error(
        'The "expression" option in the "switch" validator has to be a function'
      );
    }

    var expression;
    if (_.has(options, 'expression')) {
      expression = options.expression.call(doc, fieldValue, fieldName);
    } else {
      expression = fieldValue;
    }

    if (_.has(options.cases, expression)) {
      return options.cases[expression].validate(doc, fieldName, fieldValue);
    }

    return true;
  }
});
