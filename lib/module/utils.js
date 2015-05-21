Astro.utils.findValidator = function(Class, validatorName) {
  return Astro.utils.findInClass(Class, function(Class) {
    return Class.getValidator(validatorName);
  });
};
