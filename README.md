# Meteor Astronomy Validators

**Table of Contents**
- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Validators](#validators)
  - [String](#string)
  - [Number](#number)
  - [Date](#date)
  - [Regex](#regex)
  - [Email](#email)
  - [Choice](#choice)
  - [Compare](#compare)
- [Writing validators](#writing-validators)
- [Contribution](#contribution)
- [License](#license)

## About

Meteor Astronomy Validators is a module for [Meteor Astronomy](https://github.com/jagi/meteor-astronomy) package that introduces validation feature into you model. Validators are nice way of checking fields values' validity. For instance, we can check whether given field value is an email string or matches given regular expression. You can also write your own validators.

## Installation

```sh
$ meteor add jagi:astronomy-validators
```

## Usage

Let's see how to add validators to our model.

```js
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  transform: true,
  fields: ['title'],
  validators: [{
    type: 'String',
    options: {
      field: 'title',
      min: 10
    },
    messages: {
      min: 'Title is to short!'
    }
  }]
});
```

As you can see, we've added `String` validator. We just pass the array of validators. Each validator object has to have required `type` attribute. In the next section of this document you can find all predefined validator types.

Another attribute that you will always provide is `options`. Depending on the validator type it can vary. In most cases there is at least `field` option, which tells on what model's field validation should take place. We also have here `min` option that tells validator that `title` field's value should be at least 10 characters long.

Validator can also take `messages` object that delivers error messages when some requirement had not been fulfilled. In this example, we told validator to display `Title is to short!` message when the length of `title` field's value is shorter than 10 characters.

We also have several ways of adding validators to already defined schema.

```js
Post.schema.addValidator({
  type: 'Email',
  options: {
    field: 'email'
  }
});

Post.schema.addValidators([{
  type: 'String',
  options: {
    field: 'title',
    min: 10
  }
}, {
  type: 'Email',
  options: {
    field: 'email'
  }
}]);
```

## Validators

### String

```js
Post.schema.addValidator({
  type: 'String',
  options: {
    field: 'title',
    min: 10,
    max: 20
  }
});
```

Besides `field` option, we have two options `min` and `max` telling what is the minimum and maximum field's value length.

### Number

```js
Post.schema.addValidator({
  type: 'Number',
  options: {
    field: 'commentsCount',
    min: 10,
    max: 20
  }
});
```

Besides `field` option, we have two options `min` and `max` telling what is the minimum and maximum field's value.

### Date

```js
Post.schema.addValidator({
  type: 'Date',
  options: {
    field: 'expires',
    min: new Date(2015, 0, 1),
    max: new Date(2016, 0, 1)
  }
});
```

Besides `field` option, we have two options `min` and `max` telling that date in the `expires` field should be grater or equal `2015-01-01` and lower or equal `2016-01-01`.

### Regex

```js
Post.schema.addValidator({
  type: 'Regex',
  options: {
    field: 'email',
    pattern: /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i
  }
});
```

Besides `field` option, we have `pattern` option which is regular expression pattern which will be used for validation.

### Email

```js
Post.schema.addValidator({
  type: 'Email',
  options: {
    field: 'email'
  }
});
```

The only option here is `field` which tells validator which field's value should be correct e-mail address.

### Choice

```js
Post.schema.addValidator({
  type: 'Choice',
  options: {
    field: 'colors',
    choices: ['red', 'green', 'blue'],
    multiple: true,
    min: 1,
    max: 2
  }
});
```

We have many options here. Besides `field` option we have `choices` option containing array of possible options. The string value of `colors` field should be one of the defined in the `choices` array.

We also defined `multiple` option which tells that `colors` field's value should be array and contain at least 1 (`min`) and at most 2 (`max`) values from `choices` array. If user provide string value instead array, the error will be thrown.

### Compare

```js
Post.schema.addValidator({
  type: 'Compare',
  options: {
    fields: ['pass1', 'pass2'],
    operator: '==='
  }
});
```

This validator type executes validation on more than one field. As you can see, we have here `fields` options instead `field` and its value is an array of two fields that will be compared to each other. We also have to provide `operator` option that tells which type of comparison on fields should be executed. We can choose from following operators: `==`, `!=`, `===`, `!==`, `<`, `<=`, `>`, `>=`.

## Writing validators

We will describe process of creating validator on the example of `String` validator. There is a whole code of this validator in the listing below.

```js
Astronomy.Validator({
  name: 'String',
  requiredOptions: ['field'],
  messages: {
    invalid: '"{value}" is not valid value',
    min: 'Value must be at least {min, plural,' +
      'one {1 character}' +
      'other {# characters}' +
      '} long',
    max: 'Value must be at most {max, plural,' +
      'one {1 character}' +
      'other {# characters}' +
      '} long'
  },
  validate: function(options, messages) {
    // Get field value.
    var value = this.get(options.field);

    if (!_.isString(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }

    if (_.has(options, 'min') && value.length < options.min) {
      throw new Astronomy.ValidationError(messages.min);
    }

    if (_.has(options, 'max') && value.length > options.max) {
      throw new Astronomy.ValidationError(messages.max);
    }
  }
});
```

We have here few mandatory attributes. The first one is `name` attribute which will be used when adding validators to class schema in the `type` attribute.

The next one is the array of required options. Of course, we have to execute validation on some field, so it's way we have required `field` option.

Later, we have a bunch of error messages for `min` and `max` options. Errors with given message will be thrown when particular requirement is not fulfilled.

And the most important one `validate` function. It receives `options` and `messages` as arguments that was defined in the class schema for given validator. If user hadn't provided any messages, we will get default.

## Contribution

If you have any suggestions or want to write new modules please contact me, or just create issue or pull request.

## License

MIT
