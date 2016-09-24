//
//= require ./test_controller
//= require ./example
//= require ./test
//
//= require_self
//

$(function() {
  gi.initModule('test/test').then(function() {
    gi.initNg('test');
  });
});
