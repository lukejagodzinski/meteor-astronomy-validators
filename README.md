# Meteor Astronomy Validators

**Table of Contents**
- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
  - [Adding validators](#adding-validators)
  - [Validation](#validation)
  - [Getting errors](#getting-errors)
  - [Displaying errors](#displaying-errors)
- [Validators](#validators)
  - [and](#and)
  - [or](#or)
  - [isString](#isstring)
  - [isNumber](#isnumber)
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
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  transform: true,
  fields: ['title'],
  validators: {
    title: Astro.Validators.minLength(5, 'At least 5 character!')
  }
});
```

As you can see, we've added `minLength` validator to the `title` field. We just pass an object of key - value pairs, where key is the field name and value is validation function. The `minLength` is one of many predefined validation functions. You can also create your own functions. In the next section of this document you will find list of all validators.

The validation function takes two arguments, both are optional. The first one is the option(s) that given validator may need to work. It can be array, string, number, boolean or any object. It depends on validator type. The second argument is custom error message. You can skip that one if you want to display default message.

We also have several ways of adding validators to already defined schema.

```js
Post.schema.addValidator('email', Astro.Validators.isEmail());

Post.schema.addValidators({
  title: Astro.Validators.isString(),
  email: Astro.Validators.isEmail()
});
```

Sometimes writing such long names of validators may be frustrating. To avoid that we suggest creating local alias for the `Astronomy.Validators` namespace.

```js
// Local (in given file) alias.
var v = Astro.Validators;
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
}(Astro.Validators)));
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

At the root of validation system is the possiblity of getting error message for fields that didn't pass validation. We can get an error message for a particular field using the `getError` function which is a reactive data source.

```js
var post = new Post();
if (post.validate()) {
  post.save();
} else {
  alert(post.getError('title')); // Get error message (if present) for `title` field.
}
```

Another very important thing is possibility to check whether there are any errors, not only for particular field. The `hasError` method is also a reactive data source.

```js
var post = new Post();
post.validate();
if (post.hasError()) {
  alert(post.getError('title')); // Get error message (if present) for `title` field.
}
```

### Displaying errors

Of course, you are not going to get error messages by hand for most of the time. Instead it's better to use a template's helper function that can be used next to the form field related with the given object's field.

```hbs
{{#with post}}
<input type="text" name="title" />
<div class="error">{{getError "title"}}</div>
{{/with}}
```

The `getError` helper has two required arguments: `object` and `field`. You don't have to pass the `object` argument, if helper is called in the context of a Meteor Astronomy object. You don't have also to name the first argument. Like in the example above instead of writing `field="title"`, we just wrote `"title"`. We can do so, because the first unnamed argument is treated as a `field` argument. Of course, we can name all the arguments.

```hbs
<input type="text" name="title" />
<div class="error">{{getError field="title" object=post}}</div>
```

Sometimes we display `div` element with error message that has some styling and we wouldn't want this element to be visible until validation happens and there are any errors. We can use in this case the `hasError` method that is a reactive data source.

```hbs
<input type="text" name="title" />
{{#if post.hasError}}<div class="error">{{getError field="title" object=post}}</div>{{/if}}
```

## Validators

### and

*Aliases: -*

The `and` validator takes array of validation functions as a parameter. All validators in the array have to pass validation. It will be probably the most used validator, because almost always you will need more than one rule per field.

```js
Post.schema.addValidator('title', Astro.Validators.and([
  Astro.Validators.isString(),
  Astro.Validators.minLength(5)
]));
```

### or

*Aliases: -*

The `or` validator is similar to `and` with one difference that only one validator from the list has to pass validation test. In the example below the `title` field's value has to be at least 5 characters long or has to be equal `test`.

```js
Post.schema.addValidator('title', Astro.Validators.or([
  Astro.Validators.minLength(5),
  Astro.Validators.equal('test')
]));
```

### isString

*Aliases: `isStr`, `string`, `str`*

The `isString` validator doesn't take any options as the first argument and it's function is to check whether the field's value is a string. In the example below, we used `str` alias to make it shorter.

```js
Post.schema.addValidator('title', Astro.Validators.str());
```

### isNumber

*Aliases: `isNum`, `number`, `num`*

The `isNumber` validator doesn't take any options as the first argument and it's function is to check whether the field's value is a number. In the example below, we used `num` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Astro.Validators.num());
```

### isDate

*Aliases: `date`*

The `isDate` validator doesn't take any options as the first argument and it's function is to check whether the field's value is a date. In the example below, we used `date` alias to make it shorter.

```js
Post.schema.addValidator('createdAt', Astro.Validators.date());
```

### isNull

*Aliases: `null`*

The `isNull` validator doesn't take any options as the first argument and it's function is to check whether the field's value is null. In the example below, we used `null` alias to make it shorter.

```js
Post.schema.addValidator('title', Astro.Validators.null());
```

### isNotNull

*Aliases: `notNull`, `notnull`, `required`*

The `isNotNull` validator doesn't take any options as the first argument and it's function is to check whether the field's value is not null. In the example below, we used `notnull` alias to make it shorter.

```js
Post.schema.addValidator('title', Astro.Validators.notnull());
```

### isEmail

*Aliases: `email`*

The `isEmail` validator doesn't take any options as the first argument and it's function is to check whether the field's value is a valid e-mail address. In the example below, we used `email` alias to make it shorter.

```js
Post.schema.addValidator('createdAt', Astro.Validators.email());
```

### minLength

*Aliases: `minLen`, `minlen`*

The `minLength` validator takes a number as the first argument and it's function is to check whether the field's value is at least X characters long. Where X is the first argument of the validator. It can also work on fields of `Array` type, then it checks number of elements in the array. In the example below, we used `minlen` alias to make it shorter.

```js
Post.schema.addValidator('title', Astro.Validators.minlen(5));
```

### maxLength

*Aliases: `maxLen`, `maxlen`*

The `maxLength` validator takes a number as the first argument and it's function is to check whether the field's value is at most X characters long. Where X is the first argument of the validator. It can also work on fields of `Array` type, then it checks number of elements in the array. In the example below, we used `maxlen` alias to make it shorter.

```js
Post.schema.addValidator('title', Astro.Validators.maxlen(10));
```

### greaterThan

*Aliases: `gt`*

The `greaterThan` validator takes as the first argument a number, a date or any other value that can be compared. Its function is to check whether the field's value is greater than one provided as the argument. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `gt` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Astro.Validators.gt(10));
// In this example we are checking whether end date is greater than beginning
// date that is stored in the same object. As you can see, `this` points to the
// object on which validation takes place.
Post.schema.addValidator('endDate', Astro.Validators.gt(function() {
  return this.begDate;
});
```

### greaterThanOrEqual

*Aliases: `gte`*

The `greaterThanEqual` validator takes as the first argument a number, a date or any other value that can be compared. Its function is to check whether the field's value is greater or equal to the one provided as the argument. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `gte` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Astro.Validators.gte(10));
// In this example we are checking whether end date is greater than on equal to
// beginning date that is stored in the same object. As you can see, `this`
// points to the object on which validation takes place.
Post.schema.addValidator('endDate', Astro.Validators.gte(function() {
  return this.begDate;
});
```

### lessThan

*Aliases: `lt`*

The `lessThan` validator takes as the first argument a number, a date or any other value that can be compared. Its function is to check whether the field's value is less than one provided as the argument. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `lt` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Astro.Validators.lt(10));
// In this example we are checking whether end date is less than beginning
// date that is stored in the same object. As you can see, `this` points to the
// object on which validation takes place.
Post.schema.addValidator('endDate', Astro.Validators.lt(function() {
  return this.begDate;
});
```

### lessThanOrEqual

*Aliases: `lte`*

The `lessThanOrEqual` validator takes as the first argument a number, a date or any other value that can be compared. Its function is to check whether the field's value is less or equal to the one provided as the argument. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `lte` alias to make it shorter.

```js
Post.schema.addValidator('commentsCount', Astro.Validators.lte(10));
// In this example we are checking whether end date is less than on equal to
// beginning date that is stored in the same object. As you can see, `this`
// points to the object on which validation takes place.
Post.schema.addValidator('endDate', Astro.Validators.lte(function() {
  return this.begDate;
});
```

### hasProperty

*Aliases: `has`, `hasProp`*

The `hasProperty` validator takes as the first argument a property name. Its function is to check whether the field's value, which should be an object, has given property. In the example below, we used `has` alias to make it shorter.

```js
Post.schema.addValidator('object', Astro.Validators.has('propertyName'));
```

### equal

*Aliases: `eq`*

The `equal` validator checks whether the field's value is equal to the value of the first argument passed to the validator. It can also take a function as the argument, then it will be executed first and returned value will be used in the comparison. In the example below, we used `eq` alias to make it shorter.

```js
Post.schema.addValidator('title', Astro.Validators.eq('test'));
```

### equalTo

*Aliases: `eqTo`, `eqt`*

The `equalTo` validator checks whether the field's value is equal to value of the field which name was passed to the validator as the first argument. In the example below, we used `eqt` alias to make it shorter.

```js
Post.schema.addValidator('pass1', Astro.Validators.eqt('pass2'));
```

### regExp

*Aliases: `regexp`, `regex`, `re`*

The `regExp` validator checks whether the field's value matches the regular expression pattern that was passed to the validator as the first argument. In the example below, we used `re` alias to make it shorter.

```js
Post.schema.addValidator('title', Astro.Validators.re(/^[a-zA-Z0-9]+$/));
```

### choice

*Aliases: `oneOf`, `oneof`*

The `choice` validator checks whether the field's value is equal to one of the values provided as the first argument of the validator. In the example below, we used `oneof` alias to make it shorter.

```js
Post.schema.addValidator('sex', Astro.Validators.oneof(['male', 'female']));
```

## Writing validators

We will describe process of creating validator on the example of the `isString` validator. There is a whole code of this validator in the listing below.

```js
Astronomy.Validator({
  name: 'isString',
  aliases: ['isStr', 'string', 'str'],
  validate: function(value, undefined, fieldName) {
    return _.isString(value);
  },
  message: function(value, undefined, fieldName) {
    return 'The "' + fieldName + '" has to be a string';
  }
});
```

We have two mandatory attributes. The first one is `name` attribute which will be used to add validator to `Astronomy.Validators` object under that name. We can also assign value returned from `Astronomy.Validator` function to our custom variable and use it as an alias.

```js
isStr = Astronomy.Validator({
  name: 'isString',
  validate: _.isString
});
```

The second mandatory attribute is `validate` function. It should return boolean value indicating if given field passed validation. The `validate` function receives three arguments: value, option(s) and field name. The options (second) argument can be for instance the number with which we are comparing current field's value.

There are also two optional attributes. First one is the `message` function that receives the same arguments as the `validate` function. It has to return error message in case of not passing validation test. It will be a default validation error message that can be overwritten by a developer using the validator.

There is also one more attribute that needs attention. It's `aliases` array. Given validator will be added to the `Astronomy.Validators` object under names defined in the `aliases` array.

## Contribution

If you have any suggestions or want to write new modules please contact me, or just create issue or pull request.

## License

MIT
