(function() {
'use strict';

angular.module('lstn.filters', [])
.filter('truncate', function() {
  return function(input, targetLength, separator) {
    targetLength = parseInt(targetLength, 10);

    if (!input || input.length <= targetLength) {
      return input;
    }

    separator = separator || '...';

    var length = targetLength - separator.length;

    return input.substr(0, length) + separator;
  };
})

.filter('middlecut', function() {
  return function(input, targetLength, separator) {
    targetLength = parseInt(targetLength, 10);

    if (!input || input.length <= targetLength) {
      return input;
    }

    separator = separator || '...';

    var charactersLength = targetLength - separator.length,
      frontCharacters = Math.ceil(charactersLength / 2),
      backCharacters = Math.floor(charactersLength / 2);

    return input.substr(0, frontCharacters) +
      separator +
      input.substr(input.length - backCharacters);
  };
});

})();
