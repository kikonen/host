"use strict";

import * as palette from './components/palette';
import * as canvas from './components/canvas';
import {Arrow} from './tools/arrow';
import {Pen} from './tools/pen';
import {Rectangle} from './tools/rectangle';
import {Ellipse} from './tools/ellipse';

class PaintController {
  constructor($scope, $http, $location, $timeout, Breadcrumb) {
    "ngInject";

    console.log("paint");
    this.$location = $location;
    this.$timeout = $timeout;
    this.$http = $http;
    this.Breadcrumb = Breadcrumb;

    this.state = {
      palette: {
        strokeStyle: 'blue',
        background_color: 'green',
        lineWidth: 1
      },
      toolId: 1,
      tools: this.createTools(),
      location: {
        original: {
          x: null,
          y: null
        },
        previous: {
          x: null,
          y: null
        },
        current: {
          x: null,
          y: null
        }
      }
    };
  }

  createTools() {
    return [
      {
        name: 'Arrow',
        create() {
          return new Arrow();
        }
      },
      {
        name: 'Pen',
        create() {
          return new Pen();
        }
      },
      {
        name: 'Rectangle',
        create() {
          return new Rectangle();
        }
      },
      {
        name: 'Ellipse',
        create() {
          return new Ellipse();
        }
      },
    ];
  }
}

export function init() {
  angular.module('paint')
    .controller('PaintController', PaintController)
    .config(($stateProvider) => {
      $stateProvider
        .state(
          'paint',
          {
            url: '/',
            templateUrl: 'gi_paint/ui/paint',
            controller: PaintController,
            controllerAs: 'paint'
          });
    });

  palette.init();
  canvas.init();
}
