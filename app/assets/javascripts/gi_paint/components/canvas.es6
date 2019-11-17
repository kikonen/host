"use strict";

const BUTTON_1 = 1;

class Layer {
  constructor(id, canvas) {
    this.id = id;
    this.state = canvas.state;
  }

  getCanvas() {
    this.canvas = this.canvas || document.getElementById(this.id);
    return this.canvas;
  }

  getContext() {
    this.ctx = this.ctx || this.getCanvas().getContext("2d");
    return this.ctx;
  }

  getOffset() {
    if (!this.offset) {
      let rect = this.getCanvas().getBoundingClientRect();
      this.offset = {
        x: rect.left,
        y: rect.top
      };
    }
    return this.offset;
  }
}

class CurrentTool {
  constructor(canvas) {
    this.canvas = canvas;
    this.state = canvas.state;
    this.activeId = null;
  }

  getTool() {
    if (this.activeId !== this.state.toolId) {
      this.tool = null;
      this.activeId = this.state.toolId;
    }

    this.tool = this.tool || this.createTool();
    return this.tool;
  }

  createTool() {
    let tool = this.state.tools[this.activeId].create();
    tool.setCanvas(this.canvas);
    return tool;
  }

  setupMouseEvent(event) {
    let state = this.state,
        loc = state.location,
        curr = loc.current,
        prev = loc.previous,
        orig = loc.original,
        pen = event.which === BUTTON_1;
    if (curr.x) {
      prev.x = curr.x;
      prev.y = curr.y;
    }
    curr.x = event.offsetX;
    curr.y = event.offsetY;

    if (pen && !orig.x) {
      orig.x = curr.x;
      orig.y = curr.y;
    }

    return pen ? loc : null;
  }

  onMousemove(event) {
    let loc = this.setupMouseEvent(event);
    if (loc) {
      this.getTool().onPenMove(this.state, loc);
    }
  }

  onMousedown(event) {
    let loc = this.setupMouseEvent(event);
    if (loc) {
      this.getTool().onPenDown(this.state, loc);
    }
  }

  onMouseup(event) {
    let loc = this.setupMouseEvent(event);
    if (loc) {
      this.getTool().onPenUp(this.state, loc);
    }
  }

  onTouchmove(event) {
    let state = this.state,
        loc = state.location,
        curr = loc.current,
        prev = loc.previous,
        orig = loc.original,
        offset = this.canvas.draw.getOffset(),
        touches = event.originalEvent.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];

      if (curr.x) {
        prev.x = curr.x;
        prev.y = curr.y;
      }
      curr.x = Math.round(touch.clientX - offset.x);
      curr.y = Math.round(touch.clientY - offset.y);

      if (!orig.x) {
        orig.x = curr.x;
        orig.y = curr.y;
      }

      this.getTool().onPenMove(state, loc);
    }
  }

  onTouchend(event) {
    this.getTool().onPenUp(this.state, this.state.loc);
  }
}


class CanvasController {
  constructor($scope) {
    "ngInject";

    this.state = $scope.state;
    this.primary = new Layer("gi-primary-canvas", this);
    this.draw = new Layer("gi-draw-canvas", this);
    this.currentTool = new CurrentTool(this);

    this.current = this.state.location.current;
  }
}

export function init() {
  angular.module('paint')
    .directive('giCanvas', () => {
      return {
        restrict: 'E',
        scope: {
          state: '=giState'
        },
        controller: CanvasController,
        controllerAs: 'canvas',
        templateUrl: 'gi_paint/ui/canvas'
      };
    })
  // @see http://jsfiddle.net/guillaumebiton/R8mmR/6/
    .directive('giTouchmove', function($parse) {
      return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
          let fn = $parse(attrs.giTouchmove);
          elem.bind('touchmove', (event) => {
            let callback = () => {
              fn(scope, {$event:event});
            };
            scope.$apply(callback);
          });
        }
      };
    })
  // @see http://jsfiddle.net/guillaumebiton/R8mmR/6/
    .directive('giTouchend', function($parse) {
      return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
          let fn = $parse(attrs.giTouchend);
          elem.bind('touchend', (event) => {
            let callback = () => {
              fn(scope, {$event:event});
            };
            scope.$apply(callback);
          });
        }
      };
    })
  ;
}
