Package.describe({
  name: 'jagi:astronomy-validators',
  version: '0.10.0',
  summary: 'Validators for Meteor Astronomy',
  git: 'https://github.com/jagi/meteor-astronomy-validators.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jagi:astronomy@0.10.0');
  api.use('jagi:reactive-map@0.2.1');
  api.use('underscore');
  api.use('ui');

  api.imply('jagi:astronomy');

  // Module.
  api.addFiles('lib/module/global.js', ['client', 'server']);
  api.addFiles('lib/module/utils.js', ['client', 'server']);
  api.addFiles('lib/module/validator_definition.js', ['client', 'server']);
  api.addFiles('lib/module/validator.js', ['client', 'server']);
  api.addFiles('lib/module/init_module.js', ['client', 'server']);
  api.addFiles('lib/module/init_class.js', ['client', 'server']);
  api.addFiles('lib/module/init_instance.js', ['client', 'server']);
  api.addFiles('lib/module/module.js', ['client', 'server']);

  // Validators.
  api.addFiles('lib/validators/string.js', ['client', 'server']);
  api.addFiles('lib/validators/number.js', ['client', 'server']);
  api.addFiles('lib/validators/array.js', ['client', 'server']);
  api.addFiles('lib/validators/object.js', ['client', 'server']);
  api.addFiles('lib/validators/date.js', ['client', 'server']);
  api.addFiles('lib/validators/email.js', ['client', 'server']);

  api.addFiles('lib/validators/required.js', ['client', 'server']);
  api.addFiles('lib/validators/null.js', ['client', 'server']);
  api.addFiles('lib/validators/not_null.js', ['client', 'server']);

  api.addFiles('lib/validators/length.js', ['client', 'server']);
  api.addFiles('lib/validators/min_length.js', ['client', 'server']);
  api.addFiles('lib/validators/max_length.js', ['client', 'server']);
  api.addFiles('lib/validators/gt.js', ['client', 'server']);
  api.addFiles('lib/validators/gte.js', ['client', 'server']);
  api.addFiles('lib/validators/lt.js', ['client', 'server']);
  api.addFiles('lib/validators/lte.js', ['client', 'server']);

  api.addFiles('lib/validators/has.js', ['client', 'server']);
  api.addFiles('lib/validators/choice.js', ['client', 'server']);
  api.addFiles('lib/validators/unique.js', ['client', 'server']);
  api.addFiles('lib/validators/equal.js', ['client', 'server']);
  api.addFiles('lib/validators/equal_to.js', ['client', 'server']);
  api.addFiles('lib/validators/regexp.js', ['client', 'server']);

  api.export(['Validators'], ['client', 'server']);
});
