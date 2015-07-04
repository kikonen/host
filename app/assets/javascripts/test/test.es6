"use strict";
import { Example } from 'test/example';
import { TestController } from 'test/test_controller';

class Test {
  constructor() {
    console.log("test class instantiated");
  }

  foo() {
    return "x";
  }

}
console.log("loaded test module");

let test = new Test(),
    example = new Example(1, 2);
console.log(example.concat());

angular.module('test', [])
.controller('TestController', TestController);


$(function() {
  $.fn.bootstrapSwitch.defaults.onColor = 'success';
  $.fn.bootstrapSwitch.defaults.offColor = 'danger';
  $.fn.bootstrapSwitch.defaults.inverse = true;
  $.fn.bootstrapSwitch.defaults.animate = false;

  var opt = {
    onInit: function(ev) {
      var $elem = $(this),
          $off = $elem.siblings('.bootstrap-switch-handle-off'),
          $on = $elem.siblings('.bootstrap-switch-handle-on'),
          onIcon = $elem.data('on-icon'),
          offIcon = $elem.data('off-icon');

      if (offIcon) {
        $off.html('');
        $off.addClass(offIcon);
      }

      if (onIcon) {
        $on.html('');
        $on.addClass(onIcon);
      }
    }
  };

  $('.togglebutton').bootstrapSwitch(opt);
});
