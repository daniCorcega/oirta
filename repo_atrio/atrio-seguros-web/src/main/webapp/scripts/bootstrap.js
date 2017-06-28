/**
 * bootstraps angular onto the window.document node
 */

define([
    'require',
    'angular',
    'app',
    'routes'
], function (require, ng) {
    'use strict';

    require(['domReady!'], function (document) {
      try {
        ng.bootstrap(document, ['atrioApp']);
      }
      catch (e) {
        console.error(e.stack || e.message || e);
      }
    });
});
