Package.describe({
  name: 'jagi:astronomy-validators',
  version: '0.10.4',
  summary: 'Validators for Meteor Astronomy',
  git: 'https://github.com/jagi/meteor-astronomy-validators.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jagi:astronomy@0.10.4');
  api.use('jagi:reactive-map@0.2.1');
  api.use('underscore');
  api.use('ui');

  api.imply('jagi:astronomy');

  // Module.
  api.addFiles('lib/module/global.js', ['client', 'server']);
  api.addFiles('lib/module/error.js', ['client', 'server']);
  api.addFiles('lib/module/utils.js', ['client', 'server']);
  api.addFiles('lib/module/validator_definition.js', ['client', 'server']);
  api.addFiles('lib/module/validator.js', ['client', 'server']);
  api.addFiles('lib/module/init_module.js', ['client', 'server']);
  api.addFiles('lib/module/init_class.js', ['client', 'server']);
  api.addFiles('lib/module/init_instance.js', ['client', 'server']);
  api.addFiles('lib/module/module.js', ['client', 'server']);

  // Type validators.
  api.addFiles('lib/validators/type/string.js', ['client', 'server']);
  api.addFiles('lib/validators/type/number.js', ['client', 'server']);
  api.addFiles('lib/validators/type/boolean.js', ['client', 'server']);
  api.addFiles('lib/validators/type/array.js', ['client', 'server']);
  api.addFiles('lib/validators/type/object.js', ['client', 'server']);
  api.addFiles('lib/validators/type/date.js', ['client', 'server']);
  api.addFiles('lib/validators/type/email.js', ['client', 'server']);

  // Existence validators.
  api.addFiles('lib/validators/existence/required.js', ['client', 'server']);
  api.addFiles('lib/validators/existence/null.js', ['client', 'server']);
  api.addFiles('lib/validators/existence/not_null.js', ['client', 'server']);
  api.addFiles('lib/validators/existence/has.js', ['client', 'server']);

  // Size validators.
  api.addFiles('lib/validators/size/length.js', ['client', 'server']);
  api.addFiles('lib/validators/size/min_length.js', ['client', 'server']);
  api.addFiles('lib/validators/size/max_length.js', ['client', 'server']);
  api.addFiles('lib/validators/size/gt.js', ['client', 'server']);
  api.addFiles('lib/validators/size/gte.js', ['client', 'server']);
  api.addFiles('lib/validators/size/lt.js', ['client', 'server']);
  api.addFiles('lib/validators/size/lte.js', ['client', 'server']);

  // Comparison validators.
  api.addFiles('lib/validators/comparison/choice.js', ['client', 'server']);
  api.addFiles('lib/validators/comparison/unique.js', ['client', 'server']);
  api.addFiles('lib/validators/comparison/equal.js', ['client', 'server']);
  api.addFiles('lib/validators/comparison/equal_to.js', ['client', 'server']);
  api.addFiles('lib/validators/comparison/regexp.js', ['client', 'server']);

  // Logical operators.
  api.addFiles('lib/validators/logical/and.js', ['client', 'server']);
  api.addFiles('lib/validators/logical/or.js', ['client', 'server']);

  api.export(['Validators'], ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('insecure');
  api.use('jagi:astronomy-validators@0.10.4');

  api.addFiles('test/validators.js', ['client', 'server']);
});
