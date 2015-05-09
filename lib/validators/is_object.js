Astronomy.Validator({
  name: 'isObject',
  aliases: ['isObj', 'isobj', 'obj', 'object'],
  validate: function(fieldName, value) {
    return _.isObject(value);
  },
  onvalidationerror: function(e) {
    var fieldName = e.data.field;

    return 'The "' + fieldName + '" has to be an object';
  }
});
