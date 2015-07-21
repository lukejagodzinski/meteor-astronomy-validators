Astro.utils.validators = {
  getValidator: function(ParentClass, validatorName) {
    return Astro.utils.class.findInClass(ParentClass, function(ChildClass) {
      return ChildClass.getValidator(validatorName);
    });
  },

  getValidators: function(ParentClass, validatorsNames) {
    var self = this;
    var validators = {};

    _.each(validatorsNames, function(validatorName) {
      var validator = self.getValidator(ParentClass, validatorName);
      if (validator) {
        validators[validatorName] = validator;
      }
    });

    return validators;
  },

  getAllValidators: function(ParentClass) {
    var validators = {};

    Astro.utils.class.eachClass(ParentClass, function(ChildClass) {
      _.extend(validators, ChildClass.getValidators());
    });

    return validators;
  }
};
