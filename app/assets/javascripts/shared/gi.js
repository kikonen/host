(function() {
  'use strict';

  /**
   * @return ES6 module
   */
  function getModule(name) {
    // HACK KI This logic is ES6 transpiler specific
    var moduleName = '$__' + name.replace(/\//g, '2F') + '__';
    var module = window[moduleName];

    if (!module) {
      throw "module not found: " + name + " via " + moduleName;
    }

    // HACK KI ES6 transpiler specific
    return module;
  }

  /**
   * @return ES6 module's default export
   */
  function getModuleDefault(name) {
    var module = getModule(name);
    // HACK KI ES6 transpiler specific
    return module.default || module;
  }

  /**
   * Load and init ES6 module via document ready hook
   */
  function initModule(name) {
    var module = getModule(name);
    if (module.init) {
      console.debug('INIT: '+ name);
      module.init();
    } else {
      console.warn('NO INIT: ' + name);
    }
  }

  window.gi = window.gi || {};

  _.assign(window.gi, {
    getModule: getModule,
    getModuleDefault: getModuleDefault,
    initModule: initModule,
  });
})();
