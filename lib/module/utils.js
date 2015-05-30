Astro.utils.findValidator = function(Class, validatorName) {
  return Astro.utils.class.findInClass(Class, function(Class) {
    return Class.getValidator(validatorName);
  });
};
