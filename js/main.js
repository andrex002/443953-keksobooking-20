'use strict';

(function () {
  var TYPE_PRICE = window.data.TYPE_PRICE;
  var GUEST_ROOM = window.data.GUEST_ROOM;
  var map = window.map.layout;
  var renderAd = window.pin.renderAd;
  var enableElements = window.data.enableElements;
  var disableElements = window.data.disableElements;
  var deleteItems = window.data.deleteItems;
  var loadPins = window.backend.loadPins;
  var debounce = window.debounce;

  var mapPinMain = map.querySelector('.map__pin--main');
  var initialPositionPinMainX = mapPinMain.style.left;
  var initialPositionPinMainY = mapPinMain.style.top;
  var mapPinsElement = map.querySelector('.map__pins');
  var mapFiltersElement = map.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var addressInput = adForm.querySelector('#address');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var selectType = adForm.querySelector('#type');
  var inputPrice = adForm.querySelector('#price');
  var resetBtn = adForm.querySelector('.ad-form__reset');
  var formFilter = map.querySelector('.map__filters');
  var adsAll = [];
  var housingTypeSelect = map.querySelector('#housing-type');
  var housingPriceSelect = map.querySelector('#housing-price');
  var housingRoomsSelect = map.querySelector('#housing-rooms');
  var housingGuestsSelect = map.querySelector('#housing-guests');
  var housingFeaturesFields = map.querySelectorAll('.map__checkbox');

  //  Возвращает главную метку в начальное положение
  var returnsInitialPositionPin = function () {
    var pinPositionX = mapPinMain.style.left;
    var pinPositionY = mapPinMain.style.top;
    if (pinPositionX !== initialPositionPinMainX || pinPositionY !== initialPositionPinMainY) {
      mapPinMain.style.left = initialPositionPinMainX;
      mapPinMain.style.top = initialPositionPinMainY;
    }
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

  //  Устанавливает значение минимальной цены
  var setMinPrice = function () {
    var typeHousing = selectType.value;
    var minPrice = TYPE_PRICE[typeHousing]['minPrice'];
    inputPrice.min = minPrice;
    inputPrice.placeholder = minPrice;
  };

  //  Обработчик события change на select
  var onSelectChange = function () {
    validateRooms();
  };

  //  Добавляет DOM-элементы (метки) объявлений в блок mapPinsElement
  var renderBlockAds = function (ads) {
    var fragment = document.createDocumentFragment();
    var selectedAds = ads.slice(0, 5);
    selectedAds.forEach(function (item) {
      fragment.appendChild(renderAd(item));
    });
    mapPinsElement.appendChild(fragment);
  };

  //  Активирует страницу
  var activatePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    loadPins(onSuccessLoad, onErrorLoad);
    enableElements(adFormFieldsets);
    enableElements(mapFiltersElement.children);
    enableElements(housingFeaturesFields);
    fillAddressInput(true);
    mapPinMain.removeEventListener('mouseup', onMapPinMouseUp);
    mapPinMain.removeEventListener('keydown', onMapPinKeydown);
    addressInput.setAttribute('readonly', 'readonly');
    resetBtn.addEventListener('click', onResetBtnClick);
  };

  //  Выводит произвольный текст ошибки на экран
  var onErrorLoad = function (errorMessage) {
    var element = document.createElement('div');
    element.style = 'z-index: 100; text-align: center; padding: 20px; color: white; background: rgba(255, 0, 0, 0.7)';
    element.style.position = 'fixed';
    element.style.left = '50%';
    element.style.top = '50%';
    element.style.transform = 'translate(-50%, -50%)';
    element.style.fontSize = '20px';
    element.textContent = errorMessage;

    document.body.insertAdjacentElement('afterbegin', element);
  };

  //  Показывает метки при успешной загрузке с сервера
  var onSuccessLoad = function (response) {
    adsAll = response;
    renderBlockAds(adsAll);
  };

  //  Деактивирует страницу
  var deactivatePage = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    deleteItems('.map__pin:not(.map__pin--main)');
    deleteItems('.map__card');
    disableElements(adFormFieldsets);
    disableElements(mapFiltersElement.elements);
    fillAddressInput(false);
    returnsInitialPositionPin();
    mapPinMain.addEventListener('mouseup', onMapPinMouseUp);
    mapPinMain.addEventListener('keydown', onMapPinKeydown);
    roomNumberSelect.removeEventListener('change', onSelectChange);
    capacitySelect.removeEventListener('change', onSelectChange);
  };

  //  Активация страницы кликом левой кнопки мыши на элементе
  var onMapPinMouseUp = function (evt) {
    if (evt.button === 0) {
      activatePage();
    }
  };

  //  Активация страницы нажатием клавиши Enter
  var onMapPinKeydown = function (evt) {
    if (evt.key === 'Enter') {
      activatePage();
    }
  };

  //  Навешивает событие change на select
  var addEventChange = function (select) {
    select.addEventListener('change', onSelectChange);
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

  //  Сбрасывает страницу в исходное состояние
  var onResetBtnClick = function (evt) {
    evt.preventDefault();
    deactivatePage();
    formFilter.reset();
    adForm.reset();
    resetBtn.removeEventListener('click', onResetBtnClick);
  };

  //  Фильтрует по "типу жилья"
  var filterByType = function (ad) {
    return housingTypeSelect.value === 'any' || housingTypeSelect.value === ad.offer.type;
  };

  //  Фильтрует по "цене"
  var filterByPrice = function (ad) {
    switch (housingPriceSelect.value) {
      case 'low':
        return ad.offer.price < 10000;
      case 'middle':
        return ad.offer.price >= 10000 && ad.offer.price < 50000;
      case 'high':
        return ad.offer.price >= 50000;
      default:
        return true;
    }
  };

  //  Фильтрует по "количеству комнат"
  var filterByRooms = function (ad) {
    return housingRoomsSelect.value === 'any' || Number(housingRoomsSelect.value) === ad.offer.rooms;
  };

  //  Фильтрует по "количеству гостей"
  var filterByGuests = function (ad) {
    return housingGuestsSelect.value === 'any' || Number(housingGuestsSelect.value) === ad.offer.guests;
  };

  //  Фильтрует по "удобствам"
  var filterByFeatures = function (ad) {
    var featuresCheckedElement = map.querySelectorAll('.map__checkbox:checked');
    var features = Array.from(featuresCheckedElement).map(function (item) {
      return item.value;
    });
    var adFeatures = ad.offer.features;
    return features.every(function (item) {
      return adFeatures.includes(item);
    });
  };

  //  Фильтрует объявления
  var filtersAds = function () {
    var filteredAds = [];
    for (var i = 0; i < adsAll.length; i++) {

      if (filterByType(adsAll[i])
        && filterByPrice(adsAll[i])
        && filterByRooms(adsAll[i])
        && filterByGuests(adsAll[i])
        && filterByFeatures(adsAll[i])
      ) {
        filteredAds.push(adsAll[i]);
      }
    }
    return filteredAds;
  };

  //  Обновляет список меток объявлений в зависимости от установок фильтров
  var updateAds = function () {
    deleteItems('.map__pin:not(.map__pin--main)');
    deleteItems('.map__card');
    filtersAds();
    var newAds = filtersAds();
    renderBlockAds(newAds);
  };

  //  Обработчик изменения фильтров
  var onFiltersChange = function () {
    debounce(updateAds);
  };

  formFilter.addEventListener('change', onFiltersChange);

  deactivatePage();
  addEventChange(roomNumberSelect);
  addEventChange(capacitySelect);
  validateRooms();
  setMinPrice();

  window.main = {
    mapPinMain: mapPinMain,
    adForm: adForm,
    selectType: selectType,
    inputPrice: inputPrice,
    setMinPrice: setMinPrice,
    getPositionPin: getPositionPin,
    fillAddressInput: fillAddressInput,
    activatePage: activatePage,
    deactivatePage: deactivatePage,
    renderBlockAds: renderBlockAds
  };
})();
