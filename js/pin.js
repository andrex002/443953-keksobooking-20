'use strict';

(function () {
  //  Создает DOM-элемент объявления по шаблону
  window.pin.renderAd = function (ad) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var adElement = pinTemplate.cloneNode(true);
    var pinImg = adElement.querySelector('img');
    pinImg.src = ad.author.avatar;
    pinImg.alt = ad.offer.title;
    adElement.style.left = ad.location.x - window.data.PIN_WIDTH / 2 + 'px';
    adElement.style.top = ad.location.y - window.data.PIN_HEIGHT + 'px';
    adElement.addEventListener('click', function () {
      window.map.activateTag(adElement);
      window.data.deleteItems('.map__card');
      window.card.renderCard(ad);
      document.addEventListener('keydown', window.map.onPopupEscPress);
      var popupCloseBtn = document.querySelector('.popup__close');
      popupCloseBtn.addEventListener('click', function () {
        window.map.closePopup();
      });
    });

    return adElement;
  };
})();
