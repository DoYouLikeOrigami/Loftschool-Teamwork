"use strict";

var team9WatermarkGeneratorModule = (function () {

  var
    block = $('.watermark__img-wrapper'), //Блок, который будем двигать
    wrapper = $('.wrapper__img-resize'), //Оболочка блока
    leftPos = parseInt(block.css('left').slice(0, -2)),
    topPos = parseInt(block.css('top').slice(0, -2)),
    leftInput = $('.boxBlock__controls-input-left'),
    topInput = $('.boxBlock__controls-input-top'),
    coordInputs = $('.move__input'),
    gridControls = $('.choose__style'),
    blockWidth = 0,
    blockHeight = 0,
    wrapWidth = 0,
    wrapHeight = 0,
    rightEdge = wrapWidth - blockWidth,
    bottomEdge = wrapHeight - blockHeight;

  var _setUpListners = function () {
    // очищение по кнопке сброс
    $(".btn_reset").on('click', _resetWidget);
    $('#main-file').on('change', _addTextToMainInput);
    $('#water-file').on('change', _addTextToWaterInput);
    coordInputs.on('change', _inputMove);
    gridControls.on('click', _gridMove);
  };

  var _defaultRun = function () {
    _dragMove();
    _arrowsMove();
    _imageUpload();
    _watermarkUpload();
    if ($('.slider').length) _sliderWidget();
  };

  var _imageUpload = function() {

    $('#main-file').fileupload({
      dataType: 'json',
      acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
      disableImageResize: /Android(?!.*Chrome)|Opera/
          .test(window.navigator && navigator.userAgent),
      url: 'server/php/',

      add: function(e, data) {
          data.submit();
          $('#water-file').attr('disabled', false);
          $('.sidebar__form-label_file').removeClass('ui-state-disabled');
          $('#water-text').removeClass('ui-state-disabled');
      },

      done: function(e, data) {
           var  uploadImg = data.result.files[0],
                img = $('<img></img>');

          // создаем наше изображения(загружаем его на сервер)
          $('.img-upload').remove();
          img.attr('src', uploadImg.url);
          img.addClass('img-upload');
          img.fadeIn('.wrapper__img-resize');
          $('.wrapper__img-resize').append(img);

          img.load(function () {
            // получаем  цифры размера изображения из дополнительных классов
            var width = $(this).width(),
                height = $(this).height(),
                sizeHeight = $('.main__content').height(),
                sizeWidth = $('.main__content').width(),
                sizeBox = sizeWidth / sizeHeight,
                setResize = function (cssResize, heightR, widthR) {
                    img.addClass(cssResize);
                    $('.wrapper__img-resize').css({
                        'height': heightR + 'px',
                        'width': widthR + 'px',
                        'margin-top' : - heightR / 2
                    });
                };

            // и масштабируем его добавочным классом
            if ((width < sizeWidth) && (height < sizeHeight)) {
                setResize('', height, width);
            } else if (sizeBox < width / height) {
                setResize('img-upload-widthR ', Math.round(sizeWidth * height / width), sizeWidth);
            } else {
                setResize('img-upload-heightR ', sizeHeight, Math.round(sizeHeight * width / height));
            }

            _setVars();
          });
      }
    });
  };

  var _watermarkUpload = function() {
    $('#water-file').fileupload({
      dataType: 'json',
      acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
      disableImageResize: /Android(?!.*Chrome)|Opera/
      .test(window.navigator && navigator.userAgent),
        url: 'server/php/',

      add: function (e, data) { // отправляем картинку на сервер
          data.submit();
          $('input').attr('disabled', false);
          $('.choose').removeClass('ui-state-disabled');
          $('.btn').removeClass('ui-state-disabled');
          $('.move__input').removeClass('ui-state-disabled');
          $('.arrow__controls').removeClass('ui-state-disabled');
          _sliderWidgetOn();
      },

      done: function (e, data) {

        var uploadWtm = data.result.files[0],
            WtmWrapper = $(".watermark__img-wrapper"),
            imgWtm = $('<img></img>');

            imgWtm.attr('src', uploadWtm.url);
            imgWtm.addClass('img-watermark');
            imgWtm.fadeIn('.watermark__img-wrapper');
            WtmWrapper.html(imgWtm);
            imgWtm.load(function () {
              // получаем  цифры размера изображения
              var width = $(this).width(),
                  height = $(this).height(),
                  sizeHeight =  $('.main__content').height(),
                  sizeWidth =  $('.main__content').width(),
                  sizeBox = sizeWidth / sizeHeight,
                  setResize = function (cssResize, heightR, widthR) {
                    imgWtm.addClass(cssResize);
                    WtmWrapper.css({
                      'height': heightR + 'px',
                      'width': widthR + 'px'
                    });
                  };

              // и масштабируем его добавочным классом
              if ((width < sizeWidth) && (height < sizeHeight)) {
                  setResize('', height, width);
              } else if (sizeBox < width / height) {
                  setResize('img-upload-widthR ', Math.round(sizeWidth * height / width), sizeWidth);
              } else {
                  setResize('img-upload-heightR ', sizeHeight, Math.round(sizeHeight * width / height));
              }

              _setVars();
            });
      }
    });
  };

  var _setVars = function() {
    blockWidth = parseInt(block.css('width').slice(0, -2)),
    blockHeight = parseInt(block.css('height').slice(0, -2)),
    wrapWidth = parseInt(wrapper.css('width').slice(0, -2)),
    wrapHeight = parseInt(wrapper.css('height').slice(0, -2)),
    rightEdge = wrapWidth - blockWidth,
    bottomEdge = wrapHeight - blockHeight;
    leftPos = 0;
    topPos = 0;
    leftInput.val(leftPos);
    block.css({'left': leftPos + 'px'});
    topInput.val(topPos);
    block.css({'top': topPos + 'px'});
    console.log(document.getElementsByClassName('choose__input')[0]);
    document.getElementsByClassName('choose__input')[0].checked = true;
  };

  var _resetWidget = function() {
    $(".img-upload").remove(); // удаляем фоновое изображение
    $(".img-watermark").remove(); // удаляем ватермарк
    $('.wrapper__img-resize').removeAttr('style');//очищаем у оберток дата-атрибуты
    $('.watermark__img-wrapper').removeAttr('style');
    _sliderWidget();
    $('#main-text').val("");
    $('#main-file').val("");
    $('#water-text').val("");
    $('#water-file').val("");
    $('#water-text').attr('disabled', true);
    $('#water-text').addClass('ui-state-disabled');
    $('#water-file').attr('disabled', true);
    $('#water-file-label').addClass('ui-state-disabled');
    $('.choose').addClass('ui-state-disabled');
    $('.choose__input').attr('disabled', true);
    $('.btn_submit').addClass('ui-state-disabled');
    $('.move__input').addClass('ui-state-disabled');
    $('.arrow__controls').addClass('ui-state-disabled');
    document.getElementsByClassName('ui-slider-handle')[1].style.left = '100%';
    document.getElementsByClassName('ui-slider-range')[0].style.width = '100%';
    var radio = document.getElementsByClassName('choose__input');
    for (var i = 0; i < radio.length; i++) {
      radio[i].checked = false;
    }
    leftPos = 0;
    topPos = 0;
    leftInput.val(leftPos);
    topInput.val(topPos);
    block.css({'left': leftPos + 'px'});
    block.css({'top': topPos + 'px'});
    block.css({'opacity': '1'});
  };

  var _sliderWidgetOn = function () {
    $('.slider').slider({
        disabled: false
      });
  }

  var _sliderWidget = function () {
      $('.slider').slider({
        range: true,
        disabled: true,
        min: parseInt($('.slider').data('min')),
        max: parseInt($('.slider').data('max')),
        step: 0.01,
        values: [0, 1]
      });

      var sliderRange = document.getElementsByClassName('ui-slider-range'),
          sliderHandle = document.getElementsByClassName('ui-slider-handle'),
          rangeWidth = 1,
          block = $('#blockToMove');

      sliderHandle[1].onmousedown = function() {
        var Interval;

        Interval = window.setInterval(function() {
            rangeWidth = sliderRange[0].style.width.slice(0, -1) / 100;
            block.css({'opacity' : rangeWidth});
          }, 50);

        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
          rangeWidth = sliderRange[0].style.width.slice(0, -1) / 100;
          block.css({'opacity' : rangeWidth});
          clearTimeout(Interval);
        };
        return false;
      }
  };

  var _addTextToMainInput = function(e) {
    e.preventDefault();

    var input = $(this),
        name = input.val()

    $('#main-text').val(name.replace(/C:\\fakepath\\/, ""));
  };

  var _addTextToWaterInput = function(e) {
    e.preventDefault();

    var input = $(this),
        name = input.val()

    $('#water-text').val(name.replace(/C:\\fakepath\\/, ""));
  };

  var _inputMove = function (e) {

    var control = $(this),
      coord = control.data('coord'), //x или y
      value = parseInt(control.val());
      if (isNaN(value)) value = 0;
      control.val(value);

    if (coord === 'x') {
      if (value < 0) {
        control.val(0);
      } else

      if (value > rightEdge) {
        control.val(rightEdge);
      }

      value = control.val();
      leftPos = parseInt(value);
      block.css({'left': leftPos + 'px'});

    }

    if (coord === 'y') {
      if (value < 0) {
        control.val(0);
      } else

      if (value > bottomEdge) {
        control.val(bottomEdge);
      }

      value = control.val();
      topPos = parseInt(value);
      block.css({'top': topPos + 'px'});

    }
  };

  var _gridMove = function (e) {

    var control = $(this),
      coordX = control.data('x'), //x или y
      coordY = control.data('y'); //x или y

    if (coordX === 1) leftPos = 0;
    if (coordY === 1) topPos = 0;
    if (coordX === 2) leftPos = Math.floor(rightEdge / 2);
    if (coordY === 2) topPos = Math.floor(bottomEdge / 2);
    if (coordX === 3) leftPos = rightEdge;
    if (coordY === 3) topPos = bottomEdge;

    leftInput.val(leftPos);
    block.css({'left': leftPos + 'px'});
    topInput.val(topPos);
    block.css({'top': topPos + 'px'});
  };

  var _dragMove = function () {
    var drag = document.getElementById('blockToMove'),
      dragWrapper = document.getElementById('dragWrapper'),
      wrapperCoords = _getCoords(dragWrapper);

    drag.onmousedown = function(e) {
      var dragCoords = _getCoords(drag),
        shiftX = e.pageX - dragCoords.left,
        shiftY = e.pageY - dragCoords.top;

      document.onmousemove = function(e) {
        leftPos = e.pageX - shiftX - wrapperCoords.left,
        topPos = e.pageY - shiftY - wrapperCoords.top;

        if (leftPos < 0) leftPos = 0;
        if (leftPos > rightEdge) leftPos = rightEdge;
        if (topPos < 0) topPos = 0;
        if (topPos > bottomEdge) topPos = bottomEdge;

        leftPos = Math.floor(leftPos);
        topPos = Math.floor(topPos);
        drag.style.left = leftPos + 'px';
        drag.style.top = topPos + 'px';
        leftInput.val(leftPos);
        topInput.val(topPos);
      }

      document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        };
    }

    drag.ondragstart = function() {
        return false;
      };
  };

  function _getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  };

  var _arrowsMove = function () {
    var
      pressTimer,
      pressInterval,
      controls = document.getElementsByClassName('arrow__controls');

    for (var i = 0; i < controls.length; i++) {

      controls[i].onclick = function(e) {
        e.preventDefault();
        _move($(this));
      }

      controls[i].onmousedown = function(e) {
        e.preventDefault();
        var button = $(this);
        pressTimer = window.setTimeout(function() {
          pressInterval = window.setInterval(function() {
            _move(button);
          }, 20);
        }, 375);

        document.onmouseup = function() {
          clearTimeout(pressInterval);
          clearTimeout(pressTimer);
          document.onmouseup = null;
        }
      }

    };
  };

  function _move(control) {
    var coord = control.data('coord'), //x или y
    step = parseInt(control.data('step'));// +1 или -1

    if (coord === 'x') {
      if ( (leftPos + step > -1) && (leftPos + step < rightEdge + 1) ) {
        leftPos = leftPos + step;
        leftInput.val(leftPos);
        block.css({'left': leftPos + 'px'});
      }
    }

    else if (coord === 'y') {
      if ( (topPos + step > -1) && (topPos + step < bottomEdge + 1) ) {
        topPos = topPos + step;
        topInput.val(topPos);
        block.css({'top': topPos + 'px'});
      }
    }
  };

  return {
    init: function () {
      _setUpListners();
      _defaultRun();
    }
  };

})();

team9WatermarkGeneratorModule.init();
