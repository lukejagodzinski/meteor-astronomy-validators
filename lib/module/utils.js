Astro.utils.validators = {
  findValidator: function(Class, validatorName) {
    return Astro.utils.class.findInClass(Class, function(Class) {
      return Class.getValidator(validatorName);
    });
  },

  getAllValidators: function(Class) {
    var validators = {};

    Astro.utils.class.eachClass(Class, function(Class) {
      _.extend(validators, Class.getValidators());
    });

    return validators;
  }
};
