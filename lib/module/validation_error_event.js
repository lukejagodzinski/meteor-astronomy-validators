Astro.ValidationErrorEvent = function(data) {
  var type = 'validationError';
  data = _.extend({
    validator: null,
    fieldName: null,
    fieldValue: null,
    param: null,
    message: null
  }, data);

  Astro.Event.call(this, type, data);
};

Astro.utils.class.inherits(Astro.ValidationErrorEvent, Astro.Event);

Astro.ValidationErrorEvent.prototype.setMessage = function(message) {
  this.data.message = message;
};

Astro.ValidationErrorEvent.prototype.getMessage = function() {
  return this.data.message;
};
