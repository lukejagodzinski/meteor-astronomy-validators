Astro.createValidator({
  name: 'isObject',
  aliases: ['isObj', 'isobj', 'obj', 'object'],
  validate: _.isObject,
  events: {
    validationerror: function(e) {
      var fieldName = e.data.field;

      e.data.message = 'The "' + fieldName +
        '" field\'s value has to be an object';
    }
  }
});
