"use strict";

class BreadcrumbController {
  constructor(Breadcrumb) {
    "ngInject";
    this.path = Breadcrumb.getPath();
  }
}

class Breadcrumb {
  constructor() {
    this.path = [];
  }

  getPath() {
    return this.path;
  }

  setPath(path) {
    angular.copy(path, this.path);
  }

  addElement(elem) {
    this.path.push(elem);
  }

  removeElement(elem) {
    _.remove(this.path, elem);
  }
}

export function init() {
  angular.module('base')
    .directive('giBreadcrumb', () => ({
      scope: {},
      restrict: 'E',
      templateUrl: 'ng/breadcrumb',
      controller: BreadcrumbController,
      bindToController: true,
      controllerAs: 'ctrl'
    }))
    .service('Breadcrumb', Breadcrumb);
}
