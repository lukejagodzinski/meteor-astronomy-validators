Astro.eventManager.on('initInstance', function() {
  var doc = this;

  doc._errors = new ReactiveMap();
});
