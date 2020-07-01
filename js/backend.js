'use strict';

(function () {
  var TIMEOUT_IN_MS = 10000;
  var statusCode = {
    OK: 200
  };

  //  Загружает метки объявлений с сервера
  var loadPins = function (onSuccess, onError) {
    var URL = 'https://javascript.pages.academy/keksobooking/data';
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.open('GET', URL);
    xhr.send();
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener('load', function () {
      if (xhr.status === statusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Не удалось загрузить объявления! Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Не удалось загрузить объявления! Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Не удалось загрузить объявления! Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };

  window.backend = {
    loadPins: loadPins
  };
})();
