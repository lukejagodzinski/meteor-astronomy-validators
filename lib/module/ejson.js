var events = {};

events.toJSONValue = function(e) {
  var doc = this;
  var json;

  Tracker.nonreactive(function() {
    json = {
      errors: doc._errors.all()
    }
  });

  _.extend(e.data, json);
};

events.fromJSONValue = function(e) {
  var doc = this;
  var json = e.data;

  doc._errors.set(json.errors);
};

Astro.eventManager.on('toJSONValue', events.toJSONValue);
Astro.eventManager.on('fromJSONValue', events.fromJSONValue);
