var events = {};

events.toJSONValue = function(e) {
  var self = this;

  Tracker.nonreactive(function() {
    e.data.errors = self._errors.all();
  });
};

events.fromJSONValue = function(e) {
  this._errors.set(e.data.errors);
};

Astro.eventManager.on('toJSONValue', events.toJSONValue);
Astro.eventManager.on('fromJSONValue', events.fromJSONValue);
