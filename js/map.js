'use strict';

(function () {
  var deleteItems = window.data.deleteItems;

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
    deleteItems('.map__card');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  window.map = {
    layout: map,
    activateTag: activateTag,
    onPopupEscPress: onPopupEscPress,
    closePopup: closePopup
  };
})();
