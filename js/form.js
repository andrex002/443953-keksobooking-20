'use strict';

(function () {
  var TYPE_PRICE = window.data.TYPE_PRICE;
  var inputPrice = window.main.inputPrice;
  var adForm = window.main.adForm;
  var selectType = window.main.selectType;
  var setMinPrice = window.main.setMinPrice;
  var deactivatePage = window.main.deactivatePage;
  var saveFormData = window.backend.saveFormData;

  var inputTitle = adForm.querySelector('#title');
  var timeinSelect = adForm.querySelector('#timein');
  var timeoutSelect = adForm.querySelector('#timeout');
  var registrationTimeFieldset = adForm.querySelector('.ad-form__element--time');

  //  Обработчик закрытия окна успешного сообщения по клику и нажатию Escape
  var onOverlaySuccessClose = function (evt) {
    var overlay = document.querySelector('.success');
    if (evt.key === 'Escape' || evt.type === 'click') {
      overlay.remove();
      document.removeEventListener('keydown', onOverlaySuccessClose);
      document.removeEventListener('click', onOverlaySuccessClose);
    }
  };

  //  Обработчик закрытия окна сообщения ошибки по клику, нажатию Escape и кнопки закрытия
  var onOverlayErrorClose = function (evt) {
    var overlay = document.querySelector('.error');
    var overlayErrorBtn = overlay.querySelector('.error__button');
    if (evt.key === 'Escape' || evt.type === 'click' || evt.target === overlayErrorBtn) {
      overlay.remove();
      document.removeEventListener('keydown', onOverlayErrorClose);
      document.removeEventListener('click', onOverlayErrorClose);
    }
  };

  //  Создает и показывает сообщение успешной отправки формы
  var renderMessageSuccess = function () {
    var messageTemplate = document.querySelector('#success').content.querySelector('.success');
    var messageElement = messageTemplate.cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', messageElement);
    document.addEventListener('keydown', onOverlaySuccessClose);
    document.addEventListener('click', onOverlaySuccessClose);
  };

  //  Создает и показывает сообщение об ошибке отправки формы
  var renderMessageError = function () {
    var messageTemplate = document.querySelector('#error').content.querySelector('.error');
    var messageElement = messageTemplate.cloneNode(true);
    var main = document.querySelector('main');
    main.insertAdjacentElement('afterbegin', messageElement);
    document.addEventListener('keydown', onOverlayErrorClose);
    document.addEventListener('click', onOverlayErrorClose);
  };

  //  Деактивирует страницу и выводит сообщение в случае успешной отправки формы
  var onSuccessSaveForm = function () {
    deactivatePage();
    renderMessageSuccess();
  };

  // Выводит сообщение в случае ошибки при отправке формы
  var onErrorSaveForm = function () {
    renderMessageError();
  };

  inputTitle.addEventListener('invalid', function () {
    inputTitle.style.border = '2px solid red';
    if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity('Заголовок должнен состоять минимум из 30-и символов');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок не должнен превышать 100 символов');
    } else if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Обязательное поле');
    } else {
      inputTitle.setCustomValidity('');
      inputTitle.style.border = '';
    }
  });

  selectType.addEventListener('change', function () {
    setMinPrice();
  });

  inputPrice.addEventListener('invalid', function () {
    inputPrice.style.border = '2px solid red';
    if (inputPrice.validity.valueMissing) {
      inputPrice.setCustomValidity('Поле не может быть пустым');
    } else if (inputPrice.validity.rangeUnderflow) {
      inputPrice.setCustomValidity(TYPE_PRICE[selectType.value]['errorText']);
    } else if (inputPrice.validity.rangeOverflow) {
      inputPrice.setCustomValidity('Максимальное значение — 1 000 000');
    } else {
      inputPrice.setCustomValidity('');
      inputPrice.style.border = '';
    }
  });

  registrationTimeFieldset.addEventListener('change', function (evt) {
    var time = evt.target.value;
    if (evt.target === timeinSelect) {
      timeoutSelect.value = time;
    } else {
      timeinSelect.value = time;
    }
  });

  adForm.addEventListener('submit', function (evt) {
    saveFormData(onSuccessSaveForm, onErrorSaveForm, new FormData(adForm));
    adForm.reset();
    evt.preventDefault();
  });
})();
