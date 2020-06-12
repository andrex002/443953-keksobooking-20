'use strict';

var map = document.querySelector('.map');
var mapPinsElement = document.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var titles = [
  'Большая квартира на Советской',
  'Светлая квартира',
  'Уютное жилье для вас',
  'Уютное бунгало',
  'Маленькая квартирка',
  'Жилье для молодых пар',
  'Гостевой домик',
  'Отель 5 звезд'
];
var typeHousing = ['palace', 'flat', 'house', 'bungalo'];
var registrationTime = ['12:00', '13:00', '14:00'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var descriptions = [
  'Предлагаю размещение в просторных апартаментах с двумя балконами в одном из лучших мест',
  'Сдаю посуточно хорошую уютную квартиру с ремонтом',
  'Сдаётся квартира до лета . Красивый новый ремонт.',
  'Квартира в центре, элитный ЖК',
  'Есть ещё пара свободных квартир, по всем вопросам с удовольствием отвечу'
];
var photosList = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

//  Добавляет 0 перед числом
var addZero = function (num) {
  if (num < 10) {
    num = '0' + num;
  }

  return num;
};

//  Находит случайное число в интервале
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//  Вырезает нужное количество элементов из массива
var cutElements = function (arr, length) {
  return arr.splice(0, length);
};

//  Перемешивает массив
var shufflesArray = function (arr) {
  var result = [];
  var randomIndex;
  var elem;
  var arr1 = arr.slice(0);
  while (arr1.length > 0) {
    randomIndex = getRandomInt(0, arr1.length - 1);
    elem = arr1.splice(randomIndex, 1)[0];
    result.push(elem);
  }

  return result;
};

//  Получает массив случайных значений, нужной длинны
var getRandomArray = function (arr, length) {
  return cutElements(shufflesArray(arr), length);
};

//  Создает массив объектов
var creatingArrayObjects = function (count) {
  var ads = [];
  for (var i = 0; i < count; i++) {
    ads[i] = {
      'author': {
        'avatar': 'img/avatars/user' + addZero(i + 1) + '.png'
      },
      'offer': {
        'title': titles[i],
        'price': getRandomInt(5000, 20000),
        'type': typeHousing[getRandomInt(0, typeHousing.length - 1)],
        'rooms': getRandomInt(1, 6),
        'guests': getRandomInt(1, 10),
        'checkin': registrationTime[getRandomInt(0, registrationTime.length - 1)],
        'checkout': registrationTime[getRandomInt(0, registrationTime.length - 1)],
        'features': getRandomArray(featuresList, getRandomInt(1, featuresList.length)),
        'description': descriptions[getRandomInt(0, descriptions.length - 1)],
        'photos': getRandomArray(photosList, getRandomInt(1, photosList.length))
      },
      'location': {
        'x': getRandomInt(30, map.offsetWidth - 30),
        'y': getRandomInt(130, 630)
      }
    };
    ads[i].offer.address = ads[i].location.x + ', ' + ads[i].location.y;
  }

  return ads;
};

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

//  Создает DOM-элемент объявления по шаблону
var renderAd = function (ad) {
  var adElement = pinTemplate.cloneNode(true);
  var pinImg = adElement.querySelector('img');
  pinImg.src = ad.author.avatar;
  pinImg.alt = ad.offer.title;
  adElement.style.left = ad.location.x - 25 + 'px';
  adElement.style.top = ad.location.y - 70 + 'px';

  return adElement;
};

//  Добавляет DOM-элементы объявлений в блок
var renderBlockAds = function (ads, block) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderAd(ads[i]));
  }
  block.appendChild(fragment);
};
var adsArray = creatingArrayObjects(8);


var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var typeHousingObj = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

//  Создает фрагмент с особенностями объявления
var createFeaturesFragment = function (data) {
  var featuresFragment = document.createDocumentFragment();
  for (var i = 0; i < data.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature');
    featureItem.classList.add('popup__feature--' + data[i]);
    featuresFragment.appendChild(featureItem);
  }

  return featuresFragment;
};

//  Создает фрагмент с фотографиями по шаблону
var createPhotosFragment = function (photos, template) {
  var photosFragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    var photoItem = template.cloneNode(true);
    photoItem.src = photos[i];
    photosFragment.appendChild(photoItem);
  }

  return photosFragment;
};

//  Создает DOM-элемент карточки объявления по шаблону
var renderCard = function (ad) {
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
  cardTypeHousing.textContent = typeHousingObj[ad.offer.type];
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

// map.insertBefore(renderCard(adsArray[0]), mapFiltersContainer);


var mapPinMain = mapPinsElement.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var mapFiltersElement = map.querySelector('.map__filters');
var addressInput = adForm.querySelector('#address');
for(var i = 0; i < adFormFieldsets.length; i++) {
  adFormFieldsets[i].disabled = true;
}

//  Определяет позицию элемента
var getPositionPin = function (pin, toCenter) {
  var posX = Math.round(pin.offsetLeft + pin.offsetWidth / 2);
  var posY;
  if(toCenter) {
    posY = Math.round(pin.offsetTop + pin.offsetHeight / 2);
  } else {
    posY = Math.round(pin.offsetTop + pin.offsetHeight);
  }
  return posX + ', ' + posY;
};

//  Заполняет поле адреса
var fillAddrressInput = function (isRound) {
  addressInput.value = getPositionPin(mapPinMain, isRound);
}
fillAddrressInput(true);

//  Включает элементы
var enabledElements = function (elements) {
  for(var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
}

//  Функция активации страницы
var onMapPinActivation = function (evt) {
  if(evt.button === 0 || evt.key === 'Enter') {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    enabledElements(adFormFieldsets);
    enabledElements(mapFiltersElement.children);
    renderBlockAds(adsArray, mapPinsElement);
    fillAddrressInput(false);
    mapPinMain.removeEventListener('mousedown', onMapPinActivation);
    mapPinMain.removeEventListener('keydown', onMapPinActivation);
  }
}

//  Активация страницы по нажатию левой кнопкой мыши
mapPinMain.addEventListener('mousedown', onMapPinActivation);
//  Активация страницы нажатием клавиши Enter
mapPinMain.addEventListener('keydown', onMapPinActivation);

var guestRoom = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};
var roomNumberSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');
var adFormSubmitBtn = adForm.querySelector('.ad-form__submit');
var disableCapacityOptions = function (optionValue) {
  var capacityOptions = capacitySelect.querySelectorAll('option');
  for(var i = 0; i < capacityOptions.length; i++) {
    capacityOptions[i].disabled = true;
  }
  for(var j = 0; j < guestRoom[optionValue].length; j++) {
    capacitySelect.querySelector('option[value="' + guestRoom[optionValue][j] + '"]').disabled = false;
  }
  // capacityOptions[guestRoom[optionValue][0]].selected = true;
  console.log(guestRoom[optionValue][0]);
  capacitySelect.value = guestRoom[optionValue][0];
};
roomNumberSelect.addEventListener('change', function () {
  disableCapacityOptions(roomNumberSelect.value);
});
var checkRoomGuestValidity = function () {
  var isValidity = false;
  var rooms = roomNumberSelect.value;
  for(var i = 0; i < guestRoom[rooms].length; i++) {
    if(guestRoom[rooms][i] == capacitySelect.value) {
      isValidity = true;
    }
  }
  return isValidity;
}

adFormSubmitBtn.addEventListener('click', function (evt) {
  if(!checkRoomGuestValidity()) {
    evt.preventDefault();
    capacitySelect.setCustomValidity('Количество гостей не влезут в выбранную комнату');
  } else {
    capacitySelect.setCustomValidity('');
  }
});
