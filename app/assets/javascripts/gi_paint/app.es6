"use strict";

import * as base from 'ng/module';

export function init() {
  base.init();

  angular.module("paint", [
    'ngTouch',
    'base'
  ]);
}
