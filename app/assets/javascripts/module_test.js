//
//= require_tree ./test
//
//= require_self
//
$(function() {
  gi.initModule('test/test').then(function() {
    gi.initNg('test');
  });
});
