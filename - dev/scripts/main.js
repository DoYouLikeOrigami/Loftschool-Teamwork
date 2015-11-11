"use strict";

var team9WatermarkGeneratorModule = (function () {

  var init = function () {
    _setUpListners();
  };

  var _setUpListners = function () {
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

  return {
    init: init
  };

})();

/* --------- DOCUMENT READY --------- */

$(document).ready(function(){



});

team9WatermarkGeneratorModule.init();
