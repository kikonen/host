//
//= require_self
//= require_tree ./
"use strict";

import * as base from 'ng/module';
import * as index from './index';

export function init() {
  base.init();

  angular.module("album", [
    'base',
    'smart-table',
    'ngTouch',
  ])
    .config(($stateProvider) => {
      "ngInject";

      $stateProvider
        .state(
          'root',
          {
            abstract: true,
            templateUrl: 'gi_album/album/root'
          });
    });

  index.init();
  gi.initNg('album');
}
