'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeoutId = null;

  var debounce = function (callback) {
    if (lastTimeoutId) {
      window.clearTimeout(lastTimeoutId);
    }

    lastTimeoutId = window.setTimeout(function () {
      callback();
    }, DEBOUNCE_INTERVAL);
  };

  window.debounce = debounce;
})();
