//
//= require shared/gi
//
//=require_self
//=require_tree .
(function() {
  System.config({
    map: {
    },
    meta: {
    }
  });

  var modules = {
    '@angular/platform-browser-dynamic': window.ng.platformBrowserDynamic,
    '@angular/core': window.ng.core,
    '@angular/common': window.ng.common,
    '@angular/compiler': window.ng.compiler,
    '@angular/platform-browser': window.ng.platformBrowser
  };

  _.each(modules, function(v, k) {
    console.log(k);
    console.log(System.normalizeSync(k), v);
    System.set(
      System.normalizeSync(k),
      System.newModule(v));
  });
})();
