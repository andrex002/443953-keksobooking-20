'use strict';

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
var map = document.querySelector('.map');
var mapPinsElement = map.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapPinMain = mapPinsElement.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var mapFiltersElement = map.querySelector('.map__filters');
var addressInput = adForm.querySelector('#address');
var roomNumberSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');

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
        'title': TITLES[i],
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

//  Создает DOM-элемент объявления по шаблону
var renderAd = function (ad) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var adElement = pinTemplate.cloneNode(true);
  var pinImg = adElement.querySelector('img');
  pinImg.src = ad.author.avatar;
  pinImg.alt = ad.offer.title;
  adElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
  adElement.style.top = ad.location.y - PIN_HEIGHT + 'px';

  return adElement;
};

//  Добавляет DOM-элементы (метки) объявлений в блок mapPinsElement
var renderBlockAds = function (ads) {
  var fragment = document.createDocumentFragment();
  ads.forEach(function (item) {
    fragment.appendChild(renderAd(item));
  });
  mapPinsElement.appendChild(fragment);
};

//  Удаляет DOM-элементы (метки) объявлений
var removesAdTags = function () {
  var adTags = map.querySelectorAll('button[type="button"]');
  if (adTags) {
    adTags.forEach(function (item) {
      item.remove();
    });
  }
};

//  Создает фрагмент с особенностями объявления
var createFeaturesFragment = function (data) {
  var featuresFragment = document.createDocumentFragment();
  data.forEach(function (item) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature');
    featureItem.classList.add('popup__feature--' + item);
    featuresFragment.appendChild(featureItem);
  });

  return featuresFragment;
};

//  Создает фрагмент с фотографиями по шаблону
var createPhotosFragment = function (photos, template) {
  var photosFragment = document.createDocumentFragment();
  photos.forEach(function (item) {
    var photoItem = template.cloneNode(true);
    photoItem.src = item;
    photosFragment.appendChild(photoItem);
  });

  return photosFragment;
};

//  Создает и вставляет в разметку DOM-элемент карточки объявления по шаблону
var renderCard = function (ad) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  var cardTitle = cardElement.querySelector('.popup__title');
  var cardAddress = cardElement.querySelector('.popup__text--address');
  var cardPrice = cardElement.querySelector('.popup__text--price');
  var cardTypeHousing = cardElement.querySelector('.popup__type');
  var cardCapacity = cardElement.querySelector('.popup__text--capacity');
  var cardRegistrationTime = cardElement.querySelector('.popup__text--time');
  var cardFeatures = cardElement.querySelector('.popup__features');
  var cardDescription = cardElement.querySelector('.popup__description');
  var cardPhotos = cardElement.querySelector('.popup__photos');
  var cardPhoto = cardPhotos.querySelector('.popup__photo');
  var cardAvatar = cardElement.querySelector('.popup__avatar');
  cardTitle.textContent = ad.offer.title;
  cardAddress.textContent = ad.offer.address;
  cardPrice.innerHTML = ad.offer.price + '&#x20bd;<span>/ночь</span>';
  cardTypeHousing.textContent = TYPE_HOUSING[ad.offer.type];
  cardCapacity.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardRegistrationTime.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  cardFeatures.innerHTML = '';
  cardFeatures.appendChild(createFeaturesFragment(ad.offer.features));
  cardDescription.textContent = ad.offer.description;
  cardPhotos.innerHTML = '';
  cardPhotos.appendChild(createPhotosFragment(ad.offer.photos, cardPhoto));
  cardAvatar.src = ad.author.avatar;

  mapFiltersContainer.insertAdjacentElement('beforebegin', cardElement);
};

//  Определяет позицию элемента
var getPositionPin = function (pin, isActive) {
  var posX = Math.round(parseInt(pin.style.left, 10) + pin.offsetWidth / 2);
  var posY;
  if (isActive) {
    posY = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight);
  } else {
    posY = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight / 2);
  }

  return posX + ', ' + posY;
};

//  Заполняет поле адреса
var fillAddressInput = function (isActive) {
  addressInput.value = getPositionPin(mapPinMain, isActive);
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

//  Активирует страницу
var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  renderBlockAds(ads);
  enableElements(adFormFieldsets);
  enableElements(mapFiltersElement.children);
  fillAddressInput(true);
  mapPinMain.removeEventListener('mousedown', onMapPinMousedown);
  mapPinMain.removeEventListener('keydown', onMapPinKeydown);
};

//  Деактивирует страницу
var deactivatePage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  removesAdTags();
  disableElements(adFormFieldsets);
  disableElements(mapFiltersElement.elements);
  fillAddressInput(false);
  mapPinMain.addEventListener('mousedown', onMapPinMousedown);
  mapPinMain.addEventListener('keydown', onMapPinKeydown);
  roomNumberSelect.removeEventListener('change', onSelectChange);
  capacitySelect.removeEventListener('change', onSelectChange);
};

//  Функция-обработчик клика левой кнопки мыши на элементе
var onMapPinMousedown = function (evt) {
  if (evt.button === 0) {
    activatePage();
  }
};

//  Функция-обработчик клика клавиши Enter на элементе
var onMapPinKeydown = function (evt) {
  if (evt.key === 'Enter') {
    activatePage();
  }
};

//  Валидация roomNumberSelect и capacitySelect
var validateRooms = function () {
  var rooms = roomNumberSelect.value;
  var capacity = capacitySelect.value;
  if (!GUEST_ROOM[rooms]['guests'].includes(capacity)) {
    roomNumberSelect.setCustomValidity(GUEST_ROOM[rooms]['errorText']);
  } else {
    roomNumberSelect.setCustomValidity('');
  }
};

//  Обработчик события change на select
var onSelectChange = function () {
  validateRooms();
};

//  Навешивает событие change на select
var addsEventChange = function (select) {
  select.addEventListener('change', onSelectChange);
};

var ads = fillAdsData(NUMBER_ADS);
deactivatePage();
addsEventChange(roomNumberSelect);
addsEventChange(capacitySelect);
renderCard(ads[0]);
validateRooms();
