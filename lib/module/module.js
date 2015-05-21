Astro.createModule({
  name: 'validators',
  init: onInitModule,
  events: {
    initclass: onInitClass,
    initinstance: onInitInstance
  }
});
