'use strict';

(function () {
  var TYPE_PRICE = window.data.TYPE_PRICE;
  var inputPrice = window.main.inputPrice;
  var adForm = window.main.adForm;
  var selectType = window.main.selectType;
  var setMinPrice = window.main.setMinPrice;

  var inputTitle = adForm.querySelector('#title');
  var timeinSelect = adForm.querySelector('#timein');
  var timeoutSelect = adForm.querySelector('#timeout');
  var registrationTimeFieldset = adForm.querySelector('.ad-form__element--time');

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

  selectType.addEventListener('change', function () {
    setMinPrice();
  });

  inputPrice.addEventListener('invalid', function () {
    if (inputPrice.validity.valueMissing) {
      inputPrice.setCustomValidity('Поле не может быть пустым');
    } else if (inputPrice.validity.rangeUnderflow) {
      inputPrice.setCustomValidity(TYPE_PRICE[selectType.value]['errorText']);
    } else if (inputPrice.validity.rangeOverflow) {
      inputPrice.setCustomValidity('Максимальное значение — 1 000 000');
    } else {
      inputPrice.setCustomValidity('');
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
