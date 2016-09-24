(function() {
  'use strict';

  /**
   * HACK KI ES6 transpiler specific
   *
   * @return promise to get module
   */
  function importModule(name) {
    return System
      .import(name)
      .catch(function(err) {
        console.error("module not found: " + name);

        console.log(err);
        console.log(err.message);
        console.log(err.stack);

        var err2 = err.originalErr;
        if (err2) {
          console.log(err2);
          console.log(err2.message);
          console.log(err2.stack);
        }

        throw err;
      });
  }

  /**
   * Asynchronouslyl load and init ES6 module via document ready hook
   *
   * @return module load promise
   */
  function initModule(name) {
    return importModule(name).then(function(module) {
      if (module.init) {
        console.debug('INIT: '+ name);
        try {
          module.init();
        } catch (e) {
          console.error("INIT FAILED: " + name);
          console.error(e);
          console.error(e.message);
          console.error(e.stack);

          var e2 = e.originalException;
          if (e2) {
            console.error(e2);
            console.error(e2.message);
            console.error(e2.stack);
          }

          throw e;
        };
      } else {
        console.warn('NO INIT: ' + name);
      }
    });
// .catch(function(err) {
//       console.warn('INIT failed: ' + err.message);
//     });
  }

  function initNg(appName) {
    // NOTE KI not using @ng_app due to dependency order cycle in es6 module logic
    // => need to tune logic to avoid this
    angular.bootstrap("[data-giapp]", [appName], { strictDi: Rails.strictId });
  }

  window.gi = window.gi || {};

  _.assign(window.gi, {
    importModule: importModule,
    initModule: initModule,
    initNg: initNg,
  });
})();
