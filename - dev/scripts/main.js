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
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator && navigator.userAgent),
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
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
                    console.log('создаем обертку для изображения');
                    $(".main__content").html("<div class='wrapper__img'></div>");
                    $(".wrapper__img").html("<div class='wrapper__img-resize'></div>");

                }


            // создаем наше изображения(загружаем его на сервер)
            console.log('создаем наше изображения(загружаем его на сервер)');
            var img = $('<img></img>'),
                uploadImg = data.result.files[0];
            img.attr('src', uploadImg.url);
            img.addClass('img-upload');
            img.appendTo('.wrapper__img-resize');


            img.load(function () {
                    // удаляем атрибуты width и height
                    console.log('удаляем атрибуты width и height');
                    $(this).removeAttr("width")
                        .removeAttr("height")
                        .css({
                            width: "",
                            height: ""
                        });

                    // получаем  цифры размера изображения
                    console.log('начинаем получать цифры размера изображения из дополнительных классов, wrapper__image');
                    var width = $(this).width(),
                        height = $(this).height(),
                        
                        sizeHeight = $('.wrapper__img').height(),
                        sizeWidth = $('.wrapper__img').width(),
                        sizeBox = sizeWidth / sizeHeight,
                        setResize = function (cssResize, heightR, widthR) {
                            img.addClass(cssResize);

                            $('.wrapper__img-resize').css({
                                'height': heightR + 'px',
                                'width': widthR + 'px'
                            });
                        };
                         console.log('заканчиваем получение размера изображения');
                    // и масштабируем его добавочным классом
                    console.log('масштабируем добавочным классом');
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
