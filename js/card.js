'use strict';

(function () {
  var mapFiltersContainer = window.map.map.querySelector('.map__filters-container');

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

  window.card = {
    renderCard: function (ad) {
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
      cardTypeHousing.textContent = window.data.TYPE_HOUSING[ad.offer.type];
      cardCapacity.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      cardRegistrationTime.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      cardFeatures.innerHTML = '';
      cardFeatures.appendChild(createFeaturesFragment(ad.offer.features));
      cardDescription.textContent = ad.offer.description;
      cardPhotos.innerHTML = '';
      cardPhotos.appendChild(createPhotosFragment(ad.offer.photos, cardPhoto));
      cardAvatar.src = ad.author.avatar;

      mapFiltersContainer.insertAdjacentElement('beforebegin', cardElement);
    }
  };
})();
