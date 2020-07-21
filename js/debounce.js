'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeoutId = null;

  window.debounce = function (callback) {
    if (lastTimeoutId) {
      window.clearTimeout(lastTimeoutId);
    }

    lastTimeoutId = window.setTimeout(function () {
      callback();
    }, DEBOUNCE_INTERVAL);
  };
})();
