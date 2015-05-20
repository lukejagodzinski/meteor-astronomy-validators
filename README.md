# Meteor Astronomy Validators

**Table of Contents**
- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
  - [Adding validators](#adding-validators)
  - [Validation](#validation)
  - [Getting errors](#getting-errors)
  - [Creating error message](#creating-error-message)
  - [Displaying errors](#displaying-errors)
- [Validators](#validators)
  - [and](#and)
  - [or](#or)
  - [isString](#isstring)
  - [isNumber](#isnumber)
  - [isArray](#isarray)
  - [isObject](#isobject)
  - [isDate](#isdate)
  - [isNull](#isnull)
  - [isNotNull](#isnotnull)
  - [isEmail](#isemail)
  - [minLength](#minlength)
  - [maxLength](#maxlength)
  - [greaterThan](#greaterthan)
  - [greaterThanOrEqual](#greaterthanorequal)
  - [lessThan](#lessthan)
  - [lessThanOrEqual](#lessthanorequal)
  - [hasProperty](#hasproperty)
  - [equal](#equal)
  - [equalTo](#equalto)
  - [regExp](#regexp)
  - [choice](#choice)
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

### Adding validators

Let's see how to add validators to our model.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  validators: {
    title: Validators.minLength(5, 'At least 5 character!')
  }
});
```

As you can see, we've added `minLength` validator to the `title` field. We just pass an object of key - value pairs, where key is the field name and value is validation function. The `minLength` is one of many predefined validation functions. You can also create your own functions. In the next section of this document you will find list of all validators.

The validation function takes two arguments, both are optional. The first one is the option(s) that given validator may need to work. It can be array, string, number, boolean or any object. It depends on the validator's type. The second argument is a custom error message. You can skip that one if you want to display default message.

We also have several ways of adding validators to already defined schema.

```js
Post.schema.addValidator('email', Validators.isEmail());

Post.schema.addValidators({
  title: Validators.isString(),
  email: Validators.isEmail()
});
```

Sometimes writing such long names of validators may be frustrating. To avoid that we suggest creating shorter alias for the `Validators` variable.

```js
// Local (in given file) alias.
var v = Validators;
Post.schema.addValidators({
  title: v.isString(),
  email: v.isEmail()
});

// Self executing function returning all validators object.
Post.schema.addValidators((function(v) {
  return {
    title: v.isString(),
    email: v.isEmail()
  };
}(Validators)));
```

### Validation

To validate object against defined validation rules, we have to call the `validate` function on given object. It returns `true` if object passed all validation rules and `false` otherwise.

```js
var post = new Post();
if (post.validate()) {
  post.save();
}
```

### Getting errors

At the root of validation system is the possiblity of getting error message for fields that didn't pass validation. We can get an error message for a particular field using the `getValidationError` function which is a reactive data source.

```js
var post = new Post();
if (post.validate()) {
  post.save();
} else {
  alert(post.getValidationError('title')); // Get error message (if present) for `title` field.
}
```

Another very important thing is possibility to check whether there are any errors. We can check if there are any errors or if the given field has a validation error. For that purpose we have two function `hasValidationErrors` and `hasValidationError`. Both methods are the reactive data sources.

```js
var post = new Post();
post.validate();

if (post.hasValidationErrors()) {
  alert(post.getValidationError('title')); // Get error message for `title` field.
}

if (post.hasValidationError('title')) {
  alert(post.getValidationError('title')); // Get error message for `title` field.
}
```

### Creating error message

In case of a validation error, we have to generate an error message. The error message generation consists of few steps which we will discuss in the moment. We can leave this process to the validator. However if we want something more than a standard error message, then we should consider hooking into the process.

The validation error can be generated in the one of few steps.

- Custom validation error message/function passed as a second argument of the validator
- The `validationerror` event triggered on the object
- The global `validationerror` event
- Default validator's error message
- Standard validation error message

We can hook into two first steps.

The first one you already got familiar with. Take an example.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  validators: {
    title: Validators.minLength(5, 'Custom error message')
  }
});
```

The second one is more flexible...

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  validators: {
    title: Validators.minLength(5)
  },
  events: {
    validationerror: function(e) {
      var messages = {
        title: 'Not correct title!'
      };

      return messages[e.data.field];
    }
  }
});
```

... or something like...

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  validators: {
    title: Validators.minLength(5)
  },
  events: {
    validationerror: function(e) {
      var messages = {
        minLength: 'Too short!'
      };

      return messages[e.data.validator.name];
    }
  }
});
```

The third step is the global `validationerror` event which can override the process of an error message generation.

```js
Astro.on('validationerror', function(e) {
  var messages = {
    minLength: 'Too short!'
  };

  return messages[e.data.validator.name];
});
```

As you can see we can compose an error message based on many rules that are passed to the event. The event object contains `data` attribute which stores few valuable attributes:

- `data.field` - name of the field
- `data.value` - value of the field
- `data.validator` - the whole validator object that generates error
- `data.validator.name` - the name of the validator
- `data.options` - options passed to the validation in the class schema definition

Thanks to that flexibility, we can create error messages that fits our needs. We can for instance internationalize error messages or create some dictionary of error messages - there are no limitations.

### Displaying errors

For displaying errors in templates you can use all three mentioned above methods: `getValidationError`, `hasValidationsErrors` and `hasValidationError`. You use them as normal methods in the templates.

```hbs
{{#with post}}
<input type="text" name="title" />
<div class="error">{{getValidationError "title"}}</div>
{{/with}}
```

Sometimes we display a `div` element with an error message that has some styling and we wouldn't want this element to be visible until validation happens and there are any errors. In this case, we can use the `hasValidationErrors` method that is a reactive data source.

```hbs
<input type="text" name="title" />
{{#if post.hasValidationErrors}}<div class="error">{{post.getValidationError "title"}}</div>{{/if}}
```

Or when we want to check presence of the validation error only for the particular field.

```hbs
<input type="text" name="title" />
{{#if post.hasValidationError "title"}}<div class="error">{{post.getValidationError "title"}}</div>{{/if}}
```

## Validators

### and

*Aliases: -*

The `and` validator takes array of validation functions as a parameter. All validators in the array have to pass validation. It will be probably the most used validator, because almost always you will need more than one rule per field.

```js
Post.schema.addValidator('title', Validators.and([
  Validators.isString(),
  Validators.minLength(5)
]));
```

### or

*Aliases: -*

The `or` validator is similar to `and` with one difference that only one validator from the list has to pass validation test. In the example below the `title` field's value has to be at least 5 characters long or has to be equal `test`.

```js
Post.schema.addValidator('title', Validators.or([
  Validators.minLength(5),
  Validators.equal('test')
]));
```

### isString

*Aliases: `isStr`, `string`, `str`*

The `isString` validator doesn't take any options as the first argument and it's function is to check whether the field's value is a string. In the example below, we used `str` alias to make it shorter.

```js
Post.schema.addValidator('title', Validators.str());
```

### isNumber

*Aliases: `isNum`, `number`, `num`*

The `isNumber` validator doesn't take any options as the first argument and it's function is to check whether the field's value is a number. In the example below, we used `num` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Validators.num());
```

### isArray

*Aliases: `isarray`, `array`*

The `isArray` validator doesn't take any options as the first argument and it's function is to check whether the field's value is an array. In the example below, we used `array` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Validators.array());
```

### isObject

*Aliases: `isObj`, `isobj`, `obj`, `object`*

The `isObject` validator doesn't take any options as the first argument and it's function is to check whether the field's value is an object. In the example below, we used `obj` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Validators.obj());
```

### isDate

*Aliases: `date`*

The `isDate` validator doesn't take any options as the first argument and it's function is to check whether the field's value is a date. In the example below, we used `date` alias to make it shorter.

```js
Post.schema.addValidator('createdAt', Validators.date());
```

### isNull

*Aliases: `null`*

The `isNull` validator doesn't take any options as the first argument and it's function is to check whether the field's value is null. In the example below, we used `null` alias to make it shorter.

```js
Post.schema.addValidator('title', Validators.null());
```

### isNotNull

*Aliases: `notNull`, `notnull`, `required`*

The `isNotNull` validator doesn't take any options as the first argument and it's function is to check whether the field's value is not null. In the example below, we used `notnull` alias to make it shorter.

```js
Post.schema.addValidator('title', Validators.notnull());
```

### isEmail

*Aliases: `email`*

The `isEmail` validator doesn't take any options as the first argument and it's function is to check whether the field's value is a valid e-mail address. In the example below, we used `email` alias to make it shorter.

```js
Post.schema.addValidator('createdAt', Validators.email());
```

### minLength

*Aliases: `minLen`, `minlen`*

The `minLength` validator takes a number as the first argument and it's function is to check whether the field's value is at least X characters long. Where X is the first argument of the validator. It can also work on fields of `Array` type, then it checks number of elements in the array. In the example below, we used `minlen` alias to make it shorter.

```js
Post.schema.addValidator('title', Validators.minlen(5));
```

### maxLength

*Aliases: `maxLen`, `maxlen`*

The `maxLength` validator takes a number as the first argument and it's function is to check whether the field's value is at most X characters long. Where X is the first argument of the validator. It can also work on fields of `Array` type, then it checks number of elements in the array. In the example below, we used `maxlen` alias to make it shorter.

```js
Post.schema.addValidator('title', Validators.maxlen(10));
```

### greaterThan

*Aliases: `gt`*

The `greaterThan` validator takes as the first argument a number, a date or any other value that can be compared. Its function is to check whether the field's value is greater than one provided as the argument. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `gt` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Validators.gt(10));
// In this example we are checking whether end date is greater than beginning
// date that is stored in the same object. As you can see, `this` points to the
// object on which validation takes place.
Post.schema.addValidator('endDate', Validators.gt(function() {
  return this.begDate;
});
```

### greaterThanOrEqual

*Aliases: `gte`*

The `greaterThanEqual` validator takes as the first argument a number, a date or any other value that can be compared. Its function is to check whether the field's value is greater or equal to the one provided as the argument. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `gte` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Validators.gte(10));
// In this example we are checking whether end date is greater than on equal to
// beginning date that is stored in the same object. As you can see, `this`
// points to the object on which validation takes place.
Post.schema.addValidator('endDate', Validators.gte(function() {
  return this.begDate;
});
```

### lessThan

*Aliases: `lt`*

The `lessThan` validator takes as the first argument a number, a date or any other value that can be compared. Its function is to check whether the field's value is less than one provided as the argument. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `lt` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Validators.lt(10));
// In this example we are checking whether end date is less than beginning
// date that is stored in the same object. As you can see, `this` points to the
// object on which validation takes place.
Post.schema.addValidator('endDate', Validators.lt(function() {
  return this.begDate;
});
```

### lessThanOrEqual

*Aliases: `lte`*

The `lessThanOrEqual` validator takes as the first argument a number, a date or any other value that can be compared. Its function is to check whether the field's value is less or equal to the one provided as the argument. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `lte` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Validators.lte(10));
// In this example we are checking whether end date is less than on equal to
// beginning date that is stored in the same object. As you can see, `this`
// points to the object on which validation takes place.
Post.schema.addValidator('endDate', Validators.lte(function() {
  return this.begDate;
});
```

### hasProperty

*Aliases: `has`, `hasProp`*

The `hasProperty` validator takes as the first argument a property name. Its function is to check whether the field's value, which should be an object, has given property. In the example below, we used `has` alias to make it shorter.

```js
Post.schema.addValidator('object', Validators.has('propertyName'));
```

### equal

*Aliases: `eq`*

The `equal` validator checks whether the field's value is equal to the value of the first argument passed to the validator. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `eq` alias to make it shorter.

```js
Post.schema.addValidator('title', Validators.eq('test'));
```

### equalTo

*Aliases: `eqTo`, `eqt`*

The `equalTo` validator checks whether the field's value is equal to value of the field which name was passed to the validator as the first argument. In the example below, we used `eqt` alias to make it shorter.

```js
Post.schema.addValidator('pass1', Validators.eqt('pass2'));
```

### regExp

*Aliases: `regexp`, `regex`, `re`*

The `regExp` validator checks whether the field's value matches the regular expression pattern that was passed to the validator as the first argument. In the example below, we used `re` alias to make it shorter.

```js
Post.schema.addValidator('title', Validators.re(/^[a-zA-Z0-9]+$/));
```

### choice

*Aliases: `oneOf`, `oneof`*

The `choice` validator checks whether the field's value is equal to one of the values provided as the first argument of the validator. In the example below, we used `oneof` alias to make it shorter.

```js
Post.schema.addValidator('sex', Validators.oneof(['male', 'female']));
```

## Writing validators

We will describe process of creating validator on the example of the `isString` validator. There is a whole code of this validator in the listing below.

```js
Astro.Validator({
  name: 'maxLength',
  aliases: ['maxLen', 'maxlen'],
  validate: function(fieldName, value, maxLength /* option(s) */) {
    if (!value) {
      return false;
    }

    return value.length <= maxLength;
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;
    var maxLength = e.data.options;

    return 'The "' + fieldName + '" length has to be at most ' + maxLength;
  }
});

```

We have two mandatory attributes. The first one is the `name` attribute which will be used to add a validator to the global `Validators` object under that name. We can also assign a returned value from the `Validator` function to our custom variable and use it as an alias.

```js
isStr = Astro.Validator({
  name: 'isString',
  validate: function() {
    /* ... */
  }
});
```

The second mandatory attribute is the `validate` function. It should return a boolean value indicating if given field passed validation. The `validate` function receives three arguments: field name, value and option(s). The options argument can be for instance the number with which we are comparing current field's value. In the example of the `maxLength` validator, the options argument is `maxLength` of the string.

There are also two optional attributes.

The first one is the `onvalidationerror` function which is an event triggered when an error occured during the validation process. It has to return an error message. It will be a default validation error message that can be overwritten by a developer using validator's custom message or the `onvalidationerror` event defined on the level of class schema definition.

There is also one more attribute that needs attention. It's the `aliases` array. Given validator will be also added to the global `Validators` object under the names defined in the `aliases` array.

## Contribution

If you have any suggestions or want to write new modules please contact me, or just create issue or pull request.

## License

MIT
