Tinytest.add('Validators module - Validators', function(test) {
  Astro.classes = [];

  var Items = new Mongo.Collection('items');

  var Item = Astro.Class({
    name: 'Item',
    collection: Items,
    fields: [
      // Type.
      'string',
      'number',
      'boolean',
      'array',
      'object',
      'date',
      'email',
      // Existence.
      'required',
      'null',
      'notNull',
      'has',
      // Size.
      'length',
      'minLength',
      'maxLength',
      'gt',
      'gte',
      'lt',
      'lte',
      // Comparison.
      'choice',
      'unique',
      'equal',
      'equalTo',
      'regexp',
      // Logical.
      'and',
      'or'
    ],
    validators: {
      // Type.
      'string': Validators.string(),
      'number': Validators.number(),
      'boolean': Validators.boolean(),
      'array': Validators.array(),
      'object': Validators.object(),
      'date': Validators.date(),
      'email': Validators.email(),

      // Existence.
      'required': Validators.required(),
      'null': Validators.null(),
      'notNull': Validators.notNull(),
      'has': Validators.has('property'),

      // Size.
      'length': Validators.length(2),
      'minLength': Validators.minLength(2),
      'maxLength': Validators.maxLength(2),
      'gt': Validators.gt(2),
      'gte': Validators.gte(2),
      'lt': Validators.lt(2),
      'lte': Validators.lte(2),

      // Comparison.
      'choice': Validators.choice(['a', 'b', 'c']),
      'unique': Validators.unique(),
      'equal': Validators.equal('abc'),
      'equalTo': Validators.equalTo('equal'),
      'regexp': Validators.regexp(/^[0-9]+$/),

      // Logical.
      'and': Validators.and([
        Validators.required(),
        Validators.number()
      ]),
      'or': Validators.or([
        Validators.boolean(),
        Validators.number()
      ])
    }
  });

  var itemA = new Item({
    unique: 'abc'
  });
  itemA.save();

  var itemB = new Item();

  // Type.
  itemB.set('string', 88);
  itemB.set('number', 'abc');
  itemB.set('boolean', 'abc');
  itemB.set('array', 'abc');
  itemB.set('object', 'abc');
  itemB.set('date', 'abc');
  itemB.set('email', 'abc');
  test.isFalse(itemB.validate('string'),
    'Should not pass "string" validation'
  );
  test.isFalse(itemB.validate('number'),
    'Should not pass "number" validation'
  );
  // NaN case
  itemB.set('number', NaN);
  test.isFalse(itemB.validate('number'),
    'Should not pass "number" validation when NaN'
  );

  test.isFalse(itemB.validate('boolean'),
    'Should not pass "boolean" validation'
  );
  test.isFalse(itemB.validate('array'),
    'Should not pass "array" validation'
  );
  test.isFalse(itemB.validate('object'),
    'Should not pass "object" validation'
  );
  test.isFalse(itemB.validate('date'),
    'Should not pass "date" validation'
  );
  test.isFalse(itemB.validate('email'),
    'Should not pass "email" validation'
  );

  // Existence.
  itemB.set('required', undefined);
  itemB.set('null', 'abc');
  itemB.set('notNull', null);
  itemB.set('has', {});
  test.isFalse(itemB.validate('required'),
    'Should not pass "required" validation'
  );
  test.isFalse(itemB.validate('null'),
    'Should not pass "null" validation'
  );
  test.isFalse(itemB.validate('notNull'),
    'Should not pass "notNull" validation'
  );
  test.isFalse(itemB.validate('has'),
    'Should not pass "has" validation'
  );

  // Size.
  itemB.set('length', 'abc');
  itemB.set('minLength', 'a');
  itemB.set('maxLength', 'abc');
  itemB.set('gt', 2);
  itemB.set('gte', 1);
  itemB.set('lt', 2);
  itemB.set('lte', 3);
  test.isFalse(itemB.validate('length'),
    'Should not pass "length" validation'
  );
  test.isFalse(itemB.validate('minLength'),
    'Should not pass "minLength" validation'
  );
  test.isFalse(itemB.validate('maxLength'),
    'Should not pass "maxLength" validation'
  );
  test.isFalse(itemB.validate('gt'),
    'Should not pass "gt" validation'
  );
  test.isFalse(itemB.validate('gte'),
    'Should not pass "gte" validation'
  );
  test.isFalse(itemB.validate('lt'),
    'Should not pass "lt" validation'
  );
  test.isFalse(itemB.validate('lte'),
    'Should not pass "lte" validation'
  );

  // Comparison.
  itemB.set('choice', 'abc');
  itemB.set('unique', 'abc');
  itemB.set('equal', 'abcdef');
  itemB.set('equalTo', 'abc');
  itemB.set('regexp', 'abc');
  test.isFalse(itemB.validate('choice'),
    'Should not pass "choice" validation'
  );
  test.isFalse(itemB.validate('unique'),
    'Should not pass "unique" validation'
  );
  test.isFalse(itemB.validate('equal'),
    'Should not pass "equal" validation'
  );
  test.isFalse(itemB.validate('equalTo'),
    'Should not pass "equalTo" validation'
  );
  test.isFalse(itemB.validate('regexp'),
    'Should not pass "regexp" validation'
  );

  // Logical.
  itemB.set('and', 'abc');
  itemB.set('or', 'abc');
  test.isFalse(itemB.validate('and'),
    'Should not pass "and" validation'
  );
  test.isFalse(itemB.validate('or'),
    'Should not pass "or" validation'
  );

  //////////////////////////////////////////////////////////////////////////////

  // Type.
  itemB.set('string', 'abc');
  itemB.set('number', 123);
  itemB.set('boolean', false);
  itemB.set('array', []);
  itemB.set('object', {});
  itemB.set('date', new Date());
  itemB.set('email', 'luke.jagodzinski@gmail.com');
  test.isTrue(itemB.validate('string'),
    'Should pass "string" validation'
  );
  test.isTrue(itemB.validate('number'),
    'Should pass "number" validation'
  );
  test.isTrue(itemB.validate('boolean'),
    'Should pass "boolean" validation'
  );
  test.isTrue(itemB.validate('array'),
    'Should pass "array" validation'
  );
  test.isTrue(itemB.validate('object'),
    'Should pass "object" validation'
  );
  test.isTrue(itemB.validate('date'),
    'Should pass "date" validation'
  );
  test.isTrue(itemB.validate('email'),
    'Should pass "email" validation'
  );

  // Existence.
  itemB.set('required', 'abc');
  itemB.set('null', null);
  itemB.set('notNull', 'abc');
  itemB.set('has', {
    property: 'abc'
  });
  test.isTrue(itemB.validate('required'),
    'Should pass "required" validation'
  );
  test.isTrue(itemB.validate('null'),
    'Should pass "null" validation'
  );
  test.isTrue(itemB.validate('notNull'),
    'Should pass "notNull" validation'
  );
  test.isTrue(itemB.validate('has'),
    'Should pass "has" validation'
  );

  // Size.
  itemB.set('length', 'ab');
  itemB.set('minLength', 'ab');
  itemB.set('maxLength', 'ab');
  itemB.set('gt', 3);
  itemB.set('gte', 2);
  itemB.set('lt', 1);
  itemB.set('lte', 2);
  test.isTrue(itemB.validate('length'),
    'Should pass "length" validation'
  );
  test.isTrue(itemB.validate('minLength'),
    'Should pass "minLength" validation'
  );
  test.isTrue(itemB.validate('maxLength'),
    'Should pass "maxLength" validation'
  );
  test.isTrue(itemB.validate('gt'),
    'Should pass "gt" validation'
  );
  test.isTrue(itemB.validate('gte'),
    'Should pass "gte" validation'
  );
  test.isTrue(itemB.validate('lt'),
    'Should pass "lt" validation'
  );
  test.isTrue(itemB.validate('lte'),
    'Should pass "lte" validation'
  );

  // Comparison.
  itemB.set('choice', 'a');
  itemB.set('unique', '123');
  itemB.set('equal', 'abc');
  itemB.set('equalTo', 'abc');
  itemB.set('regexp', '123');
  test.isTrue(itemB.validate('choice'),
    'Should pass "choice" validation'
  );
  test.isTrue(itemB.validate('unique'),
    'Should pass "unique" validation'
  );
  test.isTrue(itemB.validate('equal'),
    'Should pass "equal" validation'
  );
  test.isTrue(itemB.validate('equalTo'),
    'Should pass "equalTo" validation'
  );
  test.isTrue(itemB.validate('regexp'),
    'Should pass "regexp" validation'
  );

  // Logical.
  itemB.set('and', 123);
  itemB.set('or', true);
  test.isTrue(itemB.validate('and'),
    'Should pass "and" validation'
  );
  test.isTrue(itemB.validate('or'),
    'Should pass "or" validation'
  );
  itemB.set('or', 123);
  test.isTrue(itemB.validate('or'),
    'Should pass "or" validation'
  );
});

Tinytest.add('Validators module - Nested fields', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
    fields: {
      object: 'object',
      array: 'array'
    },
    validators: {
      'object.property': Validators.string(),
      'array.0': Validators.object(),
      'array.$': Validators.object(),
      'array.$.property': Validators.string(),
    }
  });

  var item = new Item();

  test.isFalse(item.validate('object.property'),
    'Should not pass "object.property" validation'
  );
  test.isFalse(item.validate('array.0'),
    'Should not pass "array.0" validation'
  );
  item.array = [
    'abc'
  ];
  test.isFalse(item.validate('array.$'),
    'Should not pass "array.$" validation'
  );
  item.array = [{
    property: 123
  }];
  test.isFalse(item.validate('array.$.property'),
    'Should not pass "array.$.property" validation'
  );

  //////////////////////////////////////////////////////////////////////////////

  item.object = {
    property: 'abc'
  };
  item.array = [{
    property: 'abc'
  }, {
    property: 'def'
  }];
  test.isTrue(item.validate('object.property'),
    'Should pass "object.property" validation'
  );
  test.isTrue(item.validate('array.0'),
    'Should pass "array.0" validation'
  );
  test.isTrue(item.validate('array.$'),
    'Should pass "array.$" validation'
  );
  test.isTrue(item.validate('array.$.property'),
    'Should pass "array.$.property" validation'
  );
});

Tinytest.add('Validators module - Validation order', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
    fields: [
      'first',
      'second'
    ],
    validators: {
      'first': Validators.string(),
      'second': Validators.string()
    },
    validationOrder: [
      'second',
      'first'
    ]
  });

  var item = new Item();
  item.validate();
  var errors = item.getValidationErrors();
  test.isTrue(_.has(errors, 'second'),
    'The "second" validator should be run as a first');
});
