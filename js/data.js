'use strict';

(function () {
  var TITLES = [
    'Большая квартира на Советской',
    'Светлая квартира',
    'Уютное жилье для вас',
    'Уютное бунгало',
    'Маленькая квартирка',
    'Жилье для молодых пар',
    'Гостевой домик',
    'Отель 5 звезд'
  ];
  var DESCRIPTIONS = [
    'Предлагаю размещение в просторных апартаментах с двумя балконами в одном из лучших мест',
    'Сдаю посуточно хорошую уютную квартиру с ремонтом',
    'Сдаётся квартира до лета . Красивый новый ремонт.',
    'Квартира в центре, элитный ЖК',
    'Есть ещё пара свободных квартир, по всем вопросам с удовольствием отвечу'
  ];
  var TYPE_HOUSINGS = ['palace', 'flat', 'house', 'bungalo'];
  var REGISTRATION_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
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
  var NUMBER_ADS = 8;


  //  Добавляет 0 перед числом
  var addZero = function (num) {
    return num < 10 ? '0' + num : num;
  };

  //  Находит случайное число в интервале
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //  Возвращает случайный элемент из массива
  var getRandomElement = function (elements) {
    return elements[getRandomInt(0, elements.length - 1)];
  };

  //  Вырезает случайное количество элементов из массива
  var cutElements = function (elements) {
    var length = getRandomInt(1, elements.length);
    return elements.slice(0, length);
  };

  //  Перемешивает массив
  var shuffleArray = function (elements) {
    var copyElements = elements.slice();
    var lastIndex = copyElements.length - 1;
    for (var i = lastIndex; i > 0; i--) {
      var j = getRandomInt(0, lastIndex);
      var temp = copyElements[i];
      copyElements[i] = copyElements[j];
      copyElements[j] = temp;
    }
    return copyElements;
  };

  //  Получает массив случайных значений, нужной длинны
  var getRandomArray = function (elements) {
    return cutElements(shuffleArray(elements));
  };

  //  Создает массив объектов
  var fillAdsData = function (count) {
    var ads = [];
    for (var i = 1; i <= count; i++) {
      var locationX = getRandomInt(BEGINNING_MAP_X, END_MAP_X);
      var locationY = getRandomInt(BEGINNING_MAP_Y, END_MAP_Y);
      ads.push({
        'author': {
          'avatar': 'img/avatars/user' + addZero(i) + '.png'
        },
        'offer': {
          'title': TITLES[i - 1],
          'price': getRandomInt(5000, 20000),
          'type': getRandomElement(TYPE_HOUSINGS),
          'address': locationX + ', ' + locationY,
          'rooms': getRandomInt(1, 3),
          'guests': getRandomInt(1, 3),
          'checkin': getRandomElement(REGISTRATION_TIMES),
          'checkout': getRandomElement(REGISTRATION_TIMES),
          'features': getRandomArray(FEATURES),
          'description': getRandomElement(DESCRIPTIONS),
          'photos': getRandomArray(PHOTOS)
        },
        'location': {
          'x': locationX,
          'y': locationY
        }
      });
    }
    return ads;
  };

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
    TYPE_HOUSING: TYPE_HOUSING,
    TYPE_PRICE: TYPE_PRICE,
    GUEST_ROOM: GUEST_ROOM,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    NUMBER_ADS: NUMBER_ADS,
    fillAds: fillAdsData,
    deleteItems: deleteItems,
    enableElements: enableElements,
    disableElements: disableElements
  };
})();
