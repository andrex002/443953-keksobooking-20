'use strict';

(function () {
  var inputTitle = window.main.adForm.querySelector('#title');
  var timeinSelect = window.main.adForm.querySelector('#timein');
  var timeoutSelect = window.main.adForm.querySelector('#timeout');
  var registrationTimeFieldset = window.main.adForm.querySelector('.ad-form__element--time');

  inputTitle.addEventListener('invalid', function () {
    if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity('Заголовок должнен состоять минимум из 30-и символов');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок не должнен превышать 100 символов');
    } else if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Обязательное поле');
    } else {
      inputTitle.setCustomValidity('');
    }
  });

  window.main.selectType.addEventListener('change', function () {
    window.main.setMinPrice();
  });

  window.main.inputPrice.addEventListener('invalid', function () {
    if (window.main.inputPrice.validity.valueMissing) {
      window.main.inputPrice.setCustomValidity('Поле не может быть пустым');
    } else if (window.main.inputPrice.validity.rangeUnderflow) {
      window.main.inputPrice.setCustomValidity(window.data.TYPE_PRICE[window.main.selectType.value]['errorText']);
    } else if (window.main.inputPrice.validity.rangeOverflow) {
      window.main.inputPrice.setCustomValidity('Максимальное значение — 1 000 000');
    } else {
      window.main.inputPrice.setCustomValidity('');
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
})();
