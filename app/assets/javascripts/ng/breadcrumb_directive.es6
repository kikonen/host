"use strict";

angular.module('base')
.directive('giBreadcrumb', () => ({
  scope: {},
  templateUrl: 'ng/breadcrumb',
  controller: class {
    constructor(Breadcrumb) {
      this.path = Breadcrumb.getPath();
    }
  },
  bindToController: true,
  controllerAs: 'ctrl'
}))
.service('Breadcrumb', class {
  constructor() {
    this.path = [
      {
        name: 'Home',
        url: '/gi_album'
      },
      {
        name: 'Timeline',
        url: 'Timeline'
      }
    ];
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
});
