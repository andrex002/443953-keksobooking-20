'use strict';

(function () {
  var BEGINNING_MAP_X = window.data.BEGINNING_MAP_X;
  var END_MAP_X = window.data.END_MAP_X;
  var BEGINNING_MAP_Y = window.data.BEGINNING_MAP_Y;
  var END_MAP_Y = window.data.END_MAP_Y;
  var TYPE_PRICE = window.data.TYPE_PRICE;
  var GUEST_ROOM = window.data.GUEST_ROOM;
  var NUMBER_ADS = window.data.NUMBER_ADS;
  var fillAdsData = window.data.fillAds;
  var map = window.map.layout;
  var renderAd = window.pin.renderAd;
  var enableElements = window.data.enableElements;
  var disableElements = window.data.disableElements;
  var deleteItems = window.data.deleteItems;

  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinsElement = map.querySelector('.map__pins');
  var mapFiltersElement = map.querySelector('.map__filters');
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
    ads.forEach(function (item) {
      fragment.appendChild(renderAd(item));
    });
    mapPinsElement.appendChild(fragment);
  };

  //  Активирует страницу
  var activatePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    renderBlockAds(ads);
    enableElements(adFormFieldsets);
    enableElements(mapFiltersElement.children);
    fillAddressInput(true);
    mapPinMain.removeEventListener('mouseup', onMapPinMouseUp);
    mapPinMain.removeEventListener('keydown', onMapPinKeydown);
    addressInput.setAttribute('readonly', 'readonly');
  };

  //  Деактивирует страницу
  var deactivatePage = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    deleteItems('.map__pin:not(.map__pin--main)');
    disableElements(adFormFieldsets);
    disableElements(mapFiltersElement.elements);
    fillAddressInput(false);
    mapPinMain.addEventListener('mouseup', onMapPinMouseUp);
    mapPinMain.addEventListener('keydown', onMapPinKeydown);
    roomNumberSelect.removeEventListener('change', onSelectChange);
    capacitySelect.removeEventListener('change', onSelectChange);
  };

  //  Функция-обработчик клика левой кнопки мыши на элементе
  var onMapPinMouseUp = function (evt) {
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
    if (!GUEST_ROOM[rooms]['guests'].includes(capacity)) {
      roomNumberSelect.setCustomValidity(GUEST_ROOM[rooms]['errorText']);
    } else {
      roomNumberSelect.setCustomValidity('');
    }
  };

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

  var ads = fillAdsData(NUMBER_ADS);
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
  };
})();
