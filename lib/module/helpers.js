UI.registerHelper('getError', function(options) {
  var fieldName;

  // If developer haven't named first helper's argument, then we assume that
  // it's field name. All other arguments should be named and will be stored
  // in the "options" arguments. If helper was called within the context of the
  // class instance, then field name is only required argument.
  if (arguments.length > 1) {
    fieldName = arguments[0];
    options = arguments[1] || {};
  }

  // Get named arguments from the "options.hash".
  var opts = options && options.hash;
  opts = opts || {};

  // If field haven't been passed as unnamed argument then look for in the named
  // arguments list.
  fieldName = fieldName || opts.field;
  if (!fieldName) {
    throw new Error(
      'The "field" argument in the "getError" helper has to be provided'
    );
  }

  // If object to get error from haven't been passed as named argument, then we
  // assume that helper had been called within the context of such object.
  var object = opts.object || this;
  // TODO: We could check here whether object is an instance created using
  // Meteor Astronomy. Right now we don't have any way of checking so. Of course
  // we could look for existance of schema in the object constructor but we
  // should use "instanceof" for that task. We should have some base class
  // constructor from which all created classes should inherit.

  return object.getError(fieldName);
});

UI.registerHelper('hasError', function(options) {
  var fieldName;

  // If developer haven't named first helper's argument, then we assume that
  // it's field name. All other arguments should be named and will be stored
  // in the "options" arguments. If helper was called within the context of the
  // class instance, then field name is only required argument.
  if (arguments.length > 1) {
    fieldName = arguments[0];
    options = arguments[1] || {};
  }

  // Get named arguments from the "options.hash".
  var opts = options && options.hash;
  opts = opts || {};

  // If field haven't been passed as unnamed argument then look for in the named
  // arguments list.
  fieldName = fieldName || opts.field;
  if (!fieldName) {
    throw new Error(
      'The "field" argument in the "hasError" helper has to be provided'
    );
  }

  // If object to get error from haven't been passed as named argument, then we
  // assume that helper had been called within the context of such object.
  var object = opts.object || this;
  // TODO: We could check here whether object is an instance created using
  // Meteor Astronomy. Right now we don't have any way of checking so. Of course
  // we could look for existance of schema in the object constructor but we
  // should use "instanceof" for that task. We should have some base class
  // constructor from which all created classes should inherit.

  return object.hasError(fieldName);
});
