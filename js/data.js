'use strict';

(function () {
  var TYPE_HOUSING = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var TYPE_PRICE = {
    'bungalo': {
      'minPrice': 0,
      'errorText': 'Минимальная цена 0 руб'
    },
    'flat': {
      'minPrice': 1000,
      'errorText': 'Минимальная цена 1000 руб'
    },
    'house': {
      'minPrice': 5000,
      'errorText': 'Минимальная цена 5000 руб'
    },
    'palace': {
      'minPrice': 10000,
      'errorText': 'Минимальная цена 10000 руб'
    }
  };
  var GUEST_ROOM = {
    '1': {
      'guests': ['1'],
      'errorText': '1 комната для 1 гостя'
    },
    '2': {
      'guests': ['1', '2'],
      'errorText': '2 комнаты для 1 или 2 гостей'
    },
    '3': {
      'guests': ['1', '2', '3'],
      'errorText': '3 комнаты для 1, 2 или 3 гостей'
    },
    '100': {
      'guests': ['0'],
      'errorText': '100 комнат не для гостей'
    }
  };
  var BEGINNING_MAP_X = 0;
  var END_MAP_X = 1200;
  var BEGINNING_MAP_Y = 130;
  var END_MAP_Y = 630;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  //  Удаляет DOM-элементы по селектору
  var deleteItems = function (selector) {
    var elements = document.querySelectorAll(selector);
    if (elements) {
      elements.forEach(function (item) {
        item.remove();
      });
    }
  };

  //  Включает элементы
  var enableElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    }
  };

  //  Выключает элементы
  var disableElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }
  };

  window.data = {
    BEGINNING_MAP_X: BEGINNING_MAP_X,
    END_MAP_X: END_MAP_X,
    BEGINNING_MAP_Y: BEGINNING_MAP_Y,
    END_MAP_Y: END_MAP_Y,
    TYPE_HOUSING: TYPE_HOUSING,
    TYPE_PRICE: TYPE_PRICE,
    GUEST_ROOM: GUEST_ROOM,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    deleteItems: deleteItems,
    enableElements: enableElements,
    disableElements: disableElements
  };
})();
