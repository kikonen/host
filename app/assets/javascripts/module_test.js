//
//= require_tree ./test
//= require @kikonen/typeahead_svelte-0.0.14/typeahead_svelte
//
//= require_self
//
$(function() {
  gi.initModule('test/test').then(function() {
    gi.initNg('test');
  });
});
