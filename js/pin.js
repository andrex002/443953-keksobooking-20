'use strict';

(function () {
  var PIN_WIDTH = window.data.PIN_WIDTH;
  var PIN_HEIGHT = window.data.PIN_HEIGHT;
  var deleteItems = window.data.deleteItems;
  var activateTag = window.map.activateTag;
  var onPopupEscPress = window.map.onPopupEscPress;
  var closePopup = window.map.closePopup;
  var renderCard = window.card.render;

  //  Создает DOM-элемент объявления по шаблону
  window.pin.renderAd = function (ad) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var adElement = pinTemplate.cloneNode(true);
    var pinImg = adElement.querySelector('img');
    pinImg.src = ad.author.avatar;
    pinImg.alt = ad.offer.title;
    adElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
    adElement.style.top = ad.location.y - PIN_HEIGHT + 'px';
    adElement.addEventListener('click', function () {
      activateTag(adElement);
      deleteItems('.map__card');
      renderCard(ad);
      document.addEventListener('keydown', onPopupEscPress);
      var popupCloseBtn = document.querySelector('.popup__close');
      popupCloseBtn.addEventListener('click', function () {
        closePopup();
      });
    });

    return adElement;
  };
})();
