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
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0']
};
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

//  Вырезает нужное количество элементов из массива
var cutElements = function (elements) {
  var length = getRandomInt(1, elements.length);
  return elements.slice(0, length);
};

//  Перемешивает массив
var shuffleArray = function (elements) {
  var mixedElements = [];
  var randomIndex;
  var elem;
  var copyElements = elements.slice(0);
  while (copyElements.length > 0) {
    randomIndex = getRandomInt(0, copyElements.length - 1);
    elem = copyElements.splice(randomIndex, 1)[0];
    mixedElements.push(elem);
  }

  return mixedElements;
};

//  Получает массив случайных значений, нужной длинны
var getRandomArray = function (elements) {
  return cutElements(shuffleArray(elements));
};

//  Создает массив объектов
var creatingArrayAds = function (count) {
  var ads = [];
  for (var i = 1; i <= count; i++) {
    var LOCATION_X = getRandomInt(0, 1200);
    var LOCATION_Y = getRandomInt(130, 630);
    ads.push({
      'author': {
        'avatar': 'img/avatars/user' + addZero(i) + '.png'
      },
      'offer': {
        'title': TITLES[i],
        'price': getRandomInt(5000, 20000),
        'type': getRandomElement(TYPE_HOUSINGS),
        'address': LOCATION_X + ', ' + LOCATION_Y,
        'rooms': getRandomInt(1, 3),
        'guests': getRandomInt(1, 3),
        'checkin': getRandomElement(REGISTRATION_TIMES),
        'checkout': getRandomElement(REGISTRATION_TIMES),
        'features': getRandomArray(FEATURES),
        'description': getRandomElement(DESCRIPTIONS),
        'photos': getRandomArray(PHOTOS)
      },
      'location': {
        'x': LOCATION_X,
        'y': LOCATION_Y
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

//  Добавляет DOM-элементы объявлений в блок mapPinsElement
var renderBlockAds = function (ads) {
  var fragment = document.createDocumentFragment();
  ads.forEach(function (item) {
    fragment.appendChild(renderAd(item));
  });
  mapPinsElement.appendChild(fragment);
};
var ads = creatingArrayAds(NUMBER_ADS);

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

//  Создает DOM-элемент карточки объявления по шаблону
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

  return cardElement;
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
var enablesElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
};

//  Выключает элементы
var disablesElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
};

//  Активирует страницу
var activationPage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  renderBlockAds(ads);
  enablesElements(adFormFieldsets);
  enablesElements(mapFiltersElement.children);
  fillAddressInput(true);
  attachingEventChangeToSelect(roomNumberSelect);
  attachingEventChangeToSelect(capacitySelect);
};

//  Деактивирует страницу
var deactivationPage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  disablesElements(adFormFieldsets);
  disablesElements(mapFiltersElement.elements);
  fillAddressInput(false);
  mapPinMain.addEventListener('mousedown', onMapPinMousedown);
  mapPinMain.addEventListener('keydown', onMapPinKeydown);
  roomNumberSelect.removeEventListener('change', onSelectChange);
  capacitySelect.removeEventListener('change', onSelectChange);
};

//  Функция-обработчик клика левой кнопки мыши на элементе
var onMapPinMousedown = function (evt) {
  if (evt.button === 0) {
    activationPage();
    mapPinMain.removeEventListener('mousedown', onMapPinMousedown);
  }
};

//  Функция-обработчик клика клавиши Enter на элементе
var onMapPinKeydown = function (evt) {
  if (evt.key === 'Enter') {
    activationPage();
    mapPinMain.removeEventListener('keydown', onMapPinKeydown);
  }
};
//  Навешивает событие change на select
var attachingEventChangeToSelect = function (select) {
  select.addEventListener('change', onSelectChange);
};

//  Обработчик события change на select
var onSelectChange = function () {
  var isContains = false;
  var rooms = roomNumberSelect.value;
  var capacity = capacitySelect.value;
  for (var i = 0; i < GUEST_ROOM[rooms].length; i++) {
    if (GUEST_ROOM[rooms][i] === capacity) {
      isContains = true;
    }
  }
  if (!isContains) {
    roomNumberSelect.setCustomValidity('Выберите больше комнат');
  } else {
    roomNumberSelect.setCustomValidity('');
  }
};

deactivationPage();
map.insertBefore(renderCard(ads[0]), mapFiltersContainer);
onSelectChange();
