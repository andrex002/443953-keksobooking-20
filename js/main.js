'use strict';

(function () {
  var mapPinMain = window.map.map.querySelector('.map__pin--main');
  var mapPinsElement = window.map.map.querySelector('.map__pins');
  var mapFiltersElement = window.map.map.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var addressInput = adForm.querySelector('#address');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var selectType = adForm.querySelector('#type');
  var inputPrice = adForm.querySelector('#price');

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
    var minPrice = window.data.TYPE_PRICE[typeHousing]['minPrice'];
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
    ads.forEach(function (item) {
      fragment.appendChild(window.pin.renderAd(item));
    });
    mapPinsElement.appendChild(fragment);
  };

  //  Активирует страницу
  var activatePage = function () {
    window.map.map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    renderBlockAds(ads);
    window.data.enableElements(adFormFieldsets);
    window.data.enableElements(mapFiltersElement.children);
    fillAddressInput(true);
    mapPinMain.removeEventListener('mousedown', onMapPinMousedown);
    mapPinMain.removeEventListener('keydown', onMapPinKeydown);
    addressInput.setAttribute('readonly', 'readonly');
  };

  //  Деактивирует страницу
  var deactivatePage = function () {
    window.map.map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    window.data.deleteItems('.map__pin:not(.map__pin--main)');
    window.data.disableElements(adFormFieldsets);
    window.data.disableElements(mapFiltersElement.elements);
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

  //  Навешивает событие change на select
  var addEventChange = function (select) {
    select.addEventListener('change', onSelectChange);
  };

  //  Валидация roomNumberSelect и capacitySelect
  var validateRooms = function () {
    var rooms = roomNumberSelect.value;
    var capacity = capacitySelect.value;
    if (!window.data.GUEST_ROOM[rooms]['guests'].includes(capacity)) {
      roomNumberSelect.setCustomValidity(window.data.GUEST_ROOM[rooms]['errorText']);
    } else {
      roomNumberSelect.setCustomValidity('');
    }
  };

  var ads = window.data.fillAdsData(window.data.NUMBER_ADS);
  deactivatePage();
  addEventChange(roomNumberSelect);
  addEventChange(capacitySelect);
  validateRooms();
  setMinPrice();

  window.main = {
    adForm: adForm,
    selectType: selectType,
    inputPrice: inputPrice,
    setMinPrice: setMinPrice
  }
})();
