'use strict';

(function () {
  var map = document.querySelector('.map');

  //  Переключает класс active на метках объявлений
  var activateTag = function (adTag) {
    var adTagActive = map.querySelector('.map__pin--active');
    if (adTagActive) {
      adTagActive.classList.remove('map__pin--active');
    }
    adTag.classList.add('map__pin--active');
  };

  //  Обработчик закрытия попапа (карточки объявления) клавишей Escape
  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      closePopup();
    }
  };

  //  Закрывает попап (карточку объявления)
  var closePopup = function () {
    window.data.deleteItems('.map__card');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  window.map = {
    map: map,
    activateTag: function (adTag) {
      var adTagActive = map.querySelector('.map__pin--active');
      if (adTagActive) {
        adTagActive.classList.remove('map__pin--active');
      }
      adTag.classList.add('map__pin--active');
    },
    onPopupEscPress: function (evt) {
      if (evt.key === 'Escape') {
        closePopup();
      }
    },
    closePopup: function () {
      window.data.deleteItems('.map__card');
      document.removeEventListener('keydown', onPopupEscPress);
    }
  }
})();
