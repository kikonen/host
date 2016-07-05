//
//= require ./test_controller
//= require ./example
//= require ./test
//
//= require_self
//

$(function() {
  gi.initModule('test/test');

  // NOTE KI not using @ng_app due to dependency order cycle in es6 module logic
  // => need to tune logic to avoid this
  angular.bootstrap("[data-giapp]", ['test'], { strictDi: Rails.strictId });
});
