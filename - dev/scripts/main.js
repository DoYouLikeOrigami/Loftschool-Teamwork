"use strict";

var team9WatermarkGeneratorModule = (function () {

  var init = function () {
    _setUpListners();
  };

  var _setUpListners = function () {

          // событие отправки изображения на сервер
        $('#main-file').fileupload({
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator && navigator.userAgent),
            url: 'server/php/',
            add: function(e, data) {
                console.log('add');
                data.submit();
            },
            done: function(e, data) {
                 var  uploadImg = data.result.files[0];
                 if ($('.wrapрer__img').length > 0) {
                        $('.img-upload').remove();
                    } else {
                        // создаем обертку для изображения
                        // $(".main__content").html("<div class='wrapper__img'></div>");
                        // $(".wrapper__img").html("<div class='wrapper__img-resize'></div>");
                    }
                // создаем наше изображения(загружаем его на сервер)
                var img = $('<img></img>');
                img.attr('src', uploadImg.url);
                img.addClass('img-upload');
                img.fadeIn('.wrapper__img-resize');
                img.appendTo('.wrapper__img-resize');
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
            });
        }
    });
   //событие отправки вотермарка на сервер

     $('#water-file').fileupload({
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator && navigator.userAgent),
              url: 'server/php/',
            add: function (e, data) { // отправляем картинку на сервер
                data.submit();
            },
            done: function (e, data) {
                var uploadWtm = data.result.files[0];
                    var wrapper = $(".watermark__img-wrapper");
                // $(".wrapper__img-resize").append("<div class='watermark__img-wrapper'></div>");
                
                    var imgWtm = $('<img></img>');
                        imgWtm.attr('src', uploadWtm.url);
                        imgWtm.addClass('img-watermark');
                        imgWtm.fadeIn('.watermark__img-wrapper');


                $(".watermark__img-wrapper").html(imgWtm);
                 imgWtm.load(function () {
                    
                     // получаем  цифры размера изображения
                    var width = $(this).width(),
                        height = $(this).height(),
                        sizeHeight = $('.watermark__img-wrapper').height(),
                        sizeWidth = $('.watermark__img-wrapper').width(),
                        sizeBox = sizeWidth / sizeHeight,
                        setResize = function (cssResize, heightR, widthR) {
                        imgWtm.addClass(cssResize);
                        $('.watermark__img-wrapper').css({
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
            });
        }
    });


    /* --------- DOCUMENT READY --------- */

    $(document).ready(function(){
      _sliderWidget(),
      $('#main-file').on('change', _addTextToMainInput)
      $('#water-file').on('change', _addTextToWaterInput)
    });
  };

  var _sliderWidget = function () {
    if ($('.slider').length){
      $('.slider').slider({
        range: true,
        min: parseInt($('.slider').data('min')),
        max: parseInt($('.slider').data('max')),
        step: 0.01,
        values: [0, 0.5]
      });
    }
  };

  var _addTextToMainInput = function(e) {
    e.preventDefault();

    console.log($(this));


    var input = $(this),
        name = input.val()

    $('#main-text').val(name.replace(/C:\\fakepath\\/, ""));

  };

  var _addTextToWaterInput = function(e) {
    e.preventDefault();

    console.log($(this));


    var input = $(this),
        name = input.val()

    $('#water-text').val(name.replace(/C:\\fakepath\\/, ""));

  };

  return {
    init: init
  };

})();

team9WatermarkGeneratorModule.init();
