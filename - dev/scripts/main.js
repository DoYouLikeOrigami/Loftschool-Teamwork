"use strict";

var team9WatermarkGeneratorModule = (function () {

  var init = function () {
    _setUpListners();
  };

  var _setUpListners = function () {

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
