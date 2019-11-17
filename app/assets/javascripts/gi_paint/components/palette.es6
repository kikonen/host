"use strict";

class PaletteController {
  constructor($scope) {
    this.state = $scope.state;
    console.log(this);
  }

  selectTool(toolId) {
    this.state.toolId = toolId;
  }
}

export function init() {
  angular.module('paint')
    .directive('giPalette', () => {
      return {
        restrict: 'E',
        scope: {
          state: '=giState'
        },
        controller: PaletteController,
        controllerAs: 'palette',
        templateUrl: 'gi_paint/ui/palette'
      };
    });
}
