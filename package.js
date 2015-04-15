Package.describe({
  summary: 'Validators for Meteor Astronomy',
  version: '0.1.0',
  name: 'jagi:astronomy-validators',
  git: 'https://github.com/jagi/meteor-astronomy-validators.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  api.use('jagi:astronomy@0.2.0');
  api.use('underscore');

  // Module.
  api.addFiles('lib/module/global.js', ['client', 'server']);
  api.addFiles('lib/module/schema.js', ['client', 'server']);
  api.addFiles('lib/module/error.js', ['client', 'server']);
  api.addFiles('lib/module/validator.js', ['client', 'server']);
  api.addFiles('lib/module/module.js', ['client', 'server']);

  // Validators.
  api.addFiles('lib/validators/number.js', ['client', 'server']);
  api.addFiles('lib/validators/string.js', ['client', 'server']);
  api.addFiles('lib/validators/regex.js', ['client', 'server']);
  api.addFiles('lib/validators/email.js', ['client', 'server']);
  api.addFiles('lib/validators/date.js', ['client', 'server']);
  api.addFiles('lib/validators/choice.js', ['client', 'server']);
  api.addFiles('lib/validators/compare.js', ['client', 'server']);
});
