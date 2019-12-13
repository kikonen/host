"use strict";
import { Example } from 'test/example';
import { TestController } from 'test/test_controller';
import { TypeaheadSvelteInit } from 'test/typeahead_svelte_init';
//import { SelectSvelteInit } from 'test/select_svelte_init';

class Test {
  constructor() {
    console.log("test class instantiated");
  }

  foo() {
    return "x";
  }

}

function registerNg() {
  angular.module('test', [])
    .controller('TestController', TestController);
}

function runExample() {
  let test = new Test(),
      example = new Example(1, 2);
  console.log(example.concat());
}

function initToggle() {
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
}

function initDatetime() {
  var opt = {
    useCurrent: false,
    keepInvalid: true,
    showTodayButton: true,
    showClear: true,
    showClose: true,
    sideBySide: true,
    calendarWeeks: true,
    allowInputToggle: true,
    focusOnShow: true,
    widgetPositioning: {
      horizontal: 'auto',
      vertical: 'auto'
    },
    extraFormats: [
      'YYYY-MM-DD HH:mm',
      'MM/DD/YY HH:mm',
      'MM/DD/YYYY HH:mm',
    ],
  };

  $('.ki-js-datetime-input').datetimepicker(opt);

  var inlineOpt = _.assign({}, opt, {
    inline: true,
    showClose: false,
    daysOfWeekDisabled: [6, 0],
  });

  $('.ki-js-inline-datetime-input').datetimepicker(inlineOpt);
}

function initMoment() {
  moment.locale('fi');
  console.log("moment locale: " + moment.locale());
}

function initBootstrapMultiSelect() {
  $('#example-select').multiselect({
    onChange: function(option, checked) {
      console.log("selected: " + option + "=" + checked);
    },
    buttonText: function(options) {
      if (options.length === 0) {
        return 'None selected';
      }
      else if (options.length > 3) {
        return options.length + ' selected';
      }
      else {
        var selected = [];
        options.each(function() {
          selected.push([$(this).text(), $(this).data('order')]);
        });

        selected.sort(function(a, b) {
          return a[1] - b[1];
        });

        var text = '';
        for (var i = 0; i < selected.length; i++) {
          text += selected[i][0] + ', ';
        }

        return text.substr(0, text.length -2);
      }
    }
  });
}

function initTypeaheadSvelte() {
  new TypeaheadSvelteInit().init();
}

function initSelectSvelte() {
  new SelectSvelteInit().init();
}

export function init() {
  runExample();
  initMoment();
//  initToggle();
//  initDatetime();
//  initBootstrapMultiSelect();
  registerNg();

  initTypeaheadSvelte();
//  initSelectSvelte();
}
