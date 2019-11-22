//
//= require_tree ./test
//= require @kikonen/typeahead_svelte/typeahead_svelte
//
//= require_self
//
$(function() {
  gi.initModule('test/test').then(function() {
    gi.initNg('test');
  });
});
