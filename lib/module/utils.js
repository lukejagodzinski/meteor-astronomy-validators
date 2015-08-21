Astro.utils.validators = {
  isPattern: function(pattern) {
    return pattern.indexOf('.$') !== -1;
  },

  getFieldsNamesFromPattern: function(doc, pattern) {
    var self = this;

    // If it isn't nested pattern so it has to be regular field name. In that
    // case we just return this field name as an array with a single element.
    if (!self.isPattern(pattern)) {
      return [pattern];
    }

    var values = doc;

    // Variable for storing fields' names that match the pattern.
    var fieldsNames = [];

    // First split pattern by the "." sign.
    var segments = pattern.split('.');

    // Recursive function for finding fields names.
    var find = function(value, segmentIndex, fieldName) {
      // If we reached the end of a nested data, then we don't try to find the
      // field name.
      if (_.isUndefined(value)) {
        return;
      }

      // Check if we haven't reached the last segment.
      if (segmentIndex < segments.length) {
        var segment = segments[segmentIndex];

        // We reached a segment indicating that we are dealing with array.
        if (segment === '$') {
          // We have to make sure that value is an array, if it's not then we
          // stop looking for this field name.
          if (!_.isArray(value)) {
            return;
          }

          // Recursively look for fields names in the array.
          _.each(value, function(arrayElement, arrayIndex) {
            find(arrayElement, segmentIndex + 1, fieldName + '.' +
              arrayIndex);
          });
        } else {
          // Concatenate segment to compose field name.
          fieldName = fieldName + '.' + segment;
          // Recursively try to compose field name with the next segment.
          find(value[segment], segmentIndex + 1, fieldName);
        }
      } else {
        // If we reached the last segment then we can add composed field name.
        fieldsNames.push(fieldName.slice(1));
      }
    };

    find(values, 0, '');

    return fieldsNames;
  }
};
