'use strict';

(function () {
  var TIMEOUT_IN_MS = 10000;
  var StatusCode = {
    OK: 200
  };

  //  Создает и отправляет запрос на сервер
  var makeRequestToServer = function (url, method, data) {
    var message = 'Не удалось загрузить объявления! ';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open(method, url);

    if (data) {
      xhr.send(data);
      message = 'Не удалось сохранить данные! ';
    } else {
      xhr.send();
    }

    return function (onSuccess, onError) {
      xhr.addEventListener('load', function () {
        if (xhr.status === StatusCode.OK) {
          onSuccess(xhr.response);
        } else {
          onError('Не удалось загрузить объявления! Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError(message + 'Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError(message + 'Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
    };
  };

  //  Загружает метки объявлений с сервера
  var loadPins = function (onSuccess, onError) {
    var URL = 'https://javascript.pages.academy/keksobooking/data';
    var processServerResponse = makeRequestToServer(URL, 'GET');
    processServerResponse(onSuccess, onError);
  };

  //  Сохраняет данные формы нового объявления
  var saveFormData = function (onSuccess, onError, data) {
    var URL = 'https://javascript.pages.academy/keksobooking';
    var processServerResponse = makeRequestToServer(URL, 'POST', data);
    processServerResponse(onSuccess, onError);
  };

  window.backend = {
    loadPins: loadPins,
    saveFormData: saveFormData
  };
})();
