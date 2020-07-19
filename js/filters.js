// 'use script';

// (function () {


//   var map = window.map.layout;
//   var housingTypeSelect = map.querySelector('#housing-type');
//   var housingPriceSelect = map.querySelector('#housing-price');
//   var housingRoomsSelect = map.querySelector('#housing-rooms');
//   var housingGuestsSelect = map.querySelector('#housing-guests');
//   var housingFeaturesFields = window.main.housingFeaturesFields;
//   var adsAll = window.main.adsAll;
//   var deleteItems = window.data.deleteItems;
//   var debounce = window.debounce;
//   var formFilter = window.main.formFilter;
//   var renderBlockAds = window.main.renderBlockAds;

//   //  Фильтрует по "типу жилья"
//   var filterByType = function(ad) {
//     return housingTypeSelect.value === 'any' || housingTypeSelect.value === ad.offer.type;
//   };

//   //  Фильтрует по "цене"
//   var filterByPrice = function(ad) {
//     switch(housingPriceSelect.value) {
//       case 'low':
//         return ad.offer.price < 10000;
//       case 'middle':
//         return ad.offer.price >= 10000 && ad.offer.price < 50000;
//       case 'high':
//         return ad.offer.price >= 50000;
//        default:
//         return true;
//     }
//   };

//   //  Фильтрует по "количеству комнат"
//   var filterByRooms = function (ad) {
//     return housingRoomsSelect.value === 'any' || Number(housingRoomsSelect.value) === ad.offer.rooms;
//   };

//   //  Фильтрует по "количеству гостей"
//   var filterByGuests = function (ad) {
//     return housingGuestsSelect.value === 'any' || Number(housingGuestsSelect.value) === ad.offer.guests;
//   };

//   //  Фильтрует по "удобствам"
//   var filterByFeatures = function (ad) {
//     var featuresCheckedElement = map.querySelectorAll('.map__checkbox:checked');
//     var features = Array.from(featuresCheckedElement).map(function(item) {
//       return item.value;
//     });
//     var adFeatures = ad.offer.features;
//     return features.every(function(item) {
//       return adFeatures.includes(item);
//     })
//   };

//   //  Фильтрует объявления
//   var filtersAds = function () {
//     var filteredAds = [];
//     for(var i = 0; i < adsAll.length; i++) {

//       if(filterByType(adsAll[i])
//         && filterByPrice(adsAll[i])
//         && filterByRooms(adsAll[i])
//         && filterByGuests(adsAll[i])
//         && filterByFeatures(adsAll[i])
//       ) {
//         filteredAds.push(adsAll[i]);
//       }
//     }
//     return filteredAds;
//   };

//   //  Обновляет список меток объявлений в зависимости от установок фильтров
//   var updateAds = function () {
//     deleteItems('.map__pin:not(.map__pin--main)');
//     deleteItems('.map__card');
//     filtersAds();
//     var newAds = filtersAds();
//     renderBlockAds(newAds);
//   };

//   //  Обработчик изменения фильтров
//   var onFiltersChange = function () {
//     debounce(updateAds)
//   };

//   formFilter.addEventListener('change', onFiltersChange);
// })();
