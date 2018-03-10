//
//= require_tree .
//= require_self
//
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
        "ngInject";

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
