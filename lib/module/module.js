Astro.Module({
  name: 'Validators',
  initClass: function() {
    this.prototype.validate = methods.validate;
    this.prototype.getError = methods.getError;
    this.prototype.hasError = methods.hasError;
    this.prototype.hasErrors = methods.hasErrors;
  },
  initSchema: function(Class, definition) {
    this._validators = {};

    if (_.has(definition, 'validators')) {
      this.addValidators(definition.validators);
    }

    this.addEvent('afterSet', methods.afterSet);
  },
  initInstance: function(attrs) {
    this._errors = new ReactiveDict();
    this._hasErrors = new ReactiveVar(false);
  }
});
