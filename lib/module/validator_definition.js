ValidatorDefinition = function(validatorDefinition) {
  var self = this;

  self.name = validatorDefinition.name;
  self.validate = validatorDefinition.validate;

  if (_.has(validatorDefinition, 'events')) {
    _.each(validatorDefinition.events, function(eventHandler, eventName) {
      self.on(eventName, eventHandler);
    });
  }
};

Astro.Events.mixin(ValidatorDefinition.prototype);
