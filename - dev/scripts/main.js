"use strict";

var team9WatermarkGeneratorModule = (function () {

  var init = function () {
    _setUpListners;
    _blockMove;
  };

  var _setUpListners = function () {

  };

  var _blockMove = function () {
  		var controls = $('.controls__move'),
  			left = $('.controls__move-left'),
  			right = $('.controls__move-right'),
  			block = $('.block');

  		controls.on('click', function(e) {
  			e.preventDefault();
  			var $this = $(this);

  			console.log($this);
  			console.log(e);
  		});
  };

  return {
    init: init
  };

})();

team9WatermarkGeneratorModule.init();
