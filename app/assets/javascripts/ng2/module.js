//
// Base initialization for angularjs based engines. Provides
// common logic needed in all engines
//
// require modernizr-min-2.8.3/modernizr.min
//= require lodash-3.0.0/lodash
//= require moment-2.10.3/moment
//= require moment-2.10.3/locale/fi
//= require jquery-2.1.3/jquery
//= require jquery-ujs-1.0.3/rails
//= require bootstrap-sass-3.3.4/bootstrap-sprockets
// require bootstrap-switch-3.3.2/bootstrap-switch
// require eonasdan-bootstrap-datetimepicker-4.14.30/bootstrap-datetimepicker.min
// require bootstrap-multiselect-0.9.13/bootstrap-multiselect
// require bootstrap-multiselect-0.9.13/bootstrap-multiselect-collapsible-groups
//
//= require es6-shim-0.35.1/es6-shim
//= require reflect-metadata-0.1.3/Reflect
//= require rxjs-4.1.0/rx
//= require @angular-2.0.0-rc.4/core.umd
//= require @angular-2.0.0-rc.4/common.umd
//= require @angular-2.0.0-rc.4/compiler.umd
//= require @angular-2.0.0-rc.4/platform-browser.umd
//= require @angular-2.0.0-rc.4/platform-browser-dynamic.umd
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
