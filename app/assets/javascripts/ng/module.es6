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
//= require bootstrap-switch-3.3.2/bootstrap-switch
//= require eonasdan-bootstrap-datetimepicker-4.14.30/bootstrap-datetimepicker.min
//= require bootstrap-multiselect-0.9.13/bootstrap-multiselect
//= require bootstrap-multiselect-0.9.13/bootstrap-multiselect-collapsible-groups
//
//= require angular-1.3.15/angular
//= require angular-ui-router-0.2.13/angular-ui-router
//
//= require shared/gi
//
//=require_self
//=require_tree .
"use strict";

import * as breadcrumb from 'ng/breadcrumb_directive';

export function init() {
  // NOTE KI cannot us "ng" as module name since it's used by angularjs itself
  angular.module("base", [
    'ui.router'
  ])
    .constant('Rails', window.Rails)
    .config((
      $compileProvider,
      $locationProvider,
      $httpProvider,
      $urlRouterProvider,
      Rails) => {
        // turn off debug into for performance
        $compileProvider.debugInfoEnabled(Rails.debug);

        // setup HTTP defaults
        _.forEach(document.getElementsByTagName('meta'), (e) => {
          if (e.name === 'csrf-token') {
            $httpProvider.defaults.headers.common['X-CSRF-Token'] = e.content;
          }
        });
        $httpProvider.defaults.headers.common.Accept = 'application/json';

        // Setup routing
        $locationProvider.html5Mode(true);
      });
  breadcrumb.init();
}
