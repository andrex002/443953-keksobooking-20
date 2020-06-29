'use strict';

(function () {
  var BEGINNING_MAP_X = window.data.BEGINNING_MAP_X;
  var END_MAP_X = window.data.END_MAP_X;
  var BEGINNING_MAP_Y = window.data.BEGINNING_MAP_Y;
  var END_MAP_Y = window.data.END_MAP_Y;
  var mapPinMain = window.main.mapPinMain;
  var fillAddressInput = window.main.fillAddressInput;
  var activatePage = window.main.activatePage;

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY,
        };
        var topPin = mapPinMain.offsetTop - shift.y;
        var leftPin = mapPinMain.offsetLeft - shift.x;
        if (topPin < BEGINNING_MAP_Y - mapPinMain.offsetHeight) {
          topPin = BEGINNING_MAP_Y - mapPinMain.offsetHeight;
        } else if (topPin > END_MAP_Y - mapPinMain.offsetHeight) {
          topPin = END_MAP_Y - mapPinMain.offsetHeight;
        }
        if (leftPin < BEGINNING_MAP_X - mapPinMain.offsetWidth / 2) {
          leftPin = BEGINNING_MAP_X - mapPinMain.offsetWidth / 2;
        } else if (leftPin > END_MAP_X - mapPinMain.offsetWidth / 2) {
          leftPin = END_MAP_X - mapPinMain.offsetWidth / 2;
        }
        mapPinMain.style.top = topPin + 'px';
        mapPinMain.style.left = leftPin + 'px';
        fillAddressInput(true);
      };

      var onMouseUp = function () {
        activatePage();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  });
})();
